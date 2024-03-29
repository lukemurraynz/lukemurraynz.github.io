---
date: 2022-01-02T11:00:00.000Z
title: Microsoft Entra ID Application Proxy Implementation
authors: [Luke]
tags:
  - Azure
toc: true
header:
  teaser: uploads/aadproxynetworkdiagram.png
slug: azure/azure-active-directory-application-proxy-implementation
---

Are you running internal web-based applications that you want to give access to users working remotely securely without the need for a VPN or firewall? Do you want to enforce or use Azure Conditional Access policies to protect and manage access?

Let me introduce the Microsoft Microsoft Entra ID Application Proxy...

> Application Proxy is a feature of Azure AD that enables users to access on-premises web applications from a remote client. Application Proxy includes both the Application Proxy service which runs in the cloud, and the Application Proxy connector, which runs on an on-premises server. Azure AD, the Application Proxy service, and the Application Proxy connector work together to securely pass the user sign-on token from Azure AD to the web application. Application Proxy also supports single sign-on.
>
> Application Proxy is recommended for giving remote users access to internal resources. Application Proxy replaces the need for a VPN or reverse proxy.

## Overview

The [Microsoft Entra ID Application Proxy](https://learn.microsoft.com/en-us/azure/active-directory/app-proxy/what-is-application-proxy?WT.mc_id=AZ-MVP-5004796)has been around for a few years, but appears to be a hidden gem; the Application Proxy allows users_(by using Microsoft Entra ID and an Application Proxy Connector(s))_ to connect to internally hosted web applications, by the connector relaying the traffic.

![Azure Application Proxy - Network Diagram](/uploads/aadproxynetworkdiagram.png "Azure Application Proxy - Network Diagram")

Application Proxy supports the following types of applications:

* Web applications
* Web APIs that you want to expose to rich applications on different devices
* Applications hosted behind a Remote Desktop Gateway
* Rich client apps that are integrated with the Microsoft Authentication Library (MSAL)

Azure Application Proxy can often be overlooked to solve your business requirements without the need to implement costly third-party firewalls _(it also doesn't have to be an on-premises workload, for example, if the web application is running on a VM in Azure, it will also work)_.

The Azure Application proxy connector is a lightweight agent installed on a Windows Server machine that is logically close to the backend service that you want to deliver through the proxy. 

The Connector gives access to and relays the information to the Application proxy service in Microsoft Azure via HTTP/HTTPS as long as it has access to the following:

| URL | Port | How it's used |
| --- | --- | --- |
| *.msappproxy.net  *.servicebus.windows.net | 443/HTTPS | Communication between the connector and the Application Proxy cloud service |
| crl3.digicert.com  crl4.digicert.com  ocsp.digicert.com  crl.microsoft.com  oneocsp.microsoft.com  ocsp.msocsp.com | 80/HTTP | The connector uses these URLs to verify certificates. |
| login.windows.net  secure.aadcdn.microsoftonline-p.com  *.microsoftonline.com  *.microsoftonline-p.com  *.msauth.net  *.msauthimages.net  *.msecnd.net  *.msftauth.net  *.msftauthimages.net  *.phonefactor.net  enterpriseregistration.windows.net  management.azure.com  policykeyservice.dc.ad.msft.net  ctldl.windowsupdate.com  www.microsoft.com/pkiops | 443/HTTPS | The connector uses these URLs during the registration process. |
| ctldl.windowsupdate.com | 80/HTTP | The connector uses this URL during the registration process. |

## Setup Azure Application Proxy

I will set up an Azure Application Proxy to grant access to my Synology NAS _(Network Attached Storage)_ device web page in this guide. 

Although I am using my local NAS web administration page, it can be any webpage _(Unifi Controller, hosted on Apache, IIS etc.)_ accessible from the connector.

* I have a Windows Server 2022 Domain Controller.
* Synology NAS _(not domain joined, but accessible on the network via a DNS record from the domain)_
* Microsoft 365 Developer subscription with appropriate licenses

### Pre-requisites for Azure Application Proxy setup

The following resources and rights will be needed to set up Azure Application Proxy:

* An Microsoft Entra ID tenant
* A minimum of Application Administrator rights is required to set up the Application and user and group assignments.
* A server running Windows Server 2012 R2 or above to install the Application Proxy connector on (and the permissions to install)
* If you are using a third-party domain _(you will need a public SSL certificate)_ and, of course, the ability to edit external DNS records, the domain will need to be added to Microsoft Entra ID as a custom domain in order to be used.
* Microsoft Entra ID Premium P1 license or M365 Business Premium/E3 license for each user using Microsoft Entra ID Application Proxy.

![Microsoft Entra ID Application Proxy Licensing](/uploads/aadproxylicensing.png "Microsoft Entra ID Application Proxy Licensing")

_(Note: Normal [Azure AD service limits](https://learn.microsoft.com/en-us/azure/active-directory/enterprise-users/directory-service-limits-restrictions?WT.mc_id=AZ-MVP-5004796) and restrictions apply)_.

I will be configuring the Azure Application Proxy on a domain controller running Windows Server 2022.

### Disable IE Enhanced Security Configuration

The Azure Application Proxy connector requires you to log in to Microsoft Azure, and I will be installing this on a Windows Server 2022 domain controller; if this Enhanced Security Configuration is enabled _(as it should be),_ you will have problems authenticating to Microsoft Azure, so the easiest thing is to turn it off temporarily.

1. Open **Server Manager**
2. Click on **Local Server**
3. Click on: **IE Enhanced Security Configuration**
4. Select Off for: **Administrators**
5. **Close** Microsoft **Edge** _(if you have it opened)_
6. ![Disable IE Enhanced Security Configuration](/uploads/disable_ie_enhancedconfiguration.png "Disable IE Enhanced Security Configuration")

### Install Azure Application Proxy Connector

 1. Login to **Azure Portal** _(on the server that you want to install the Connector on)_
 2. Navigate to: [**Microsoft Entra ID**](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview)
 3. Select **Application Proxy**
 4. ![Azure Portal - Application Proxy](/uploads/azureportal-applicationproxy.png "Azure Portal - Application Proxy")
 5. Click on: **Download connector service**.
 6. Accept the system requirements and click **Accept Terms & Download**
 7. A file named: 'AADApplicationProxyConnectorInstaller.exe' should have been downloaded. **Run** it.
 8. Select: **I agree to the license terms and conditions** and select **Install**
 9. ![Microsoft Microsoft Entra ID Application Proxy Connector Installation](/uploads/microsoftazureapplicationproxyconnector.png "Microsoft Microsoft Entra ID Application Proxy Connector Installation")
10. Wait for the Microsoft Microsoft Entra ID Application to display and **log in** with an Microsoft Entra ID account with Application Administrator rights.
11. The Microsoft Microsoft Entra ID Application **Connector will now** be **registered** in your Microsoft Entra ID tenancy.
12. ![Microsoft Microsoft Entra ID Application Proxy Connector Installation](/uploads/microsoftazureapplicationproxyconnectorinstalled.png "Microsoft Microsoft Entra ID Application Proxy Connector Installation")
13. Click **Close**
14. Now **re-enable IE enhanced security configuration**.

You should now see two new services appear in services as Automatic (Delayed Start):

* WAPCsvc - Microsoft AAD Application Proxy Connector
* WAPCUpdaterSvc - Microsoft AAD Application Proxy Connector Updater

And the following processes running:

* ApplicationProxyConnectorService
* ApplicationProxyConnectorUpdateService

![ApplicationProxyConnectorService](/uploads/azureaadapplicationservices.png "ApplicationProxyConnectorService")

If you are running Server Core, Microsoft Microsoft Entra ID Application Proxy can be installed via [PowerShell](https://learn.microsoft.com/en-us/azure/active-directory/app-proxy/application-proxy-register-connector-powershell?WT.mc_id=AZ-MVP-5004796).

The Azure Application Proxy Connector agent gets [updated](https://learn.microsoft.com/en-us/azure/active-directory/app-proxy/application-proxy-faq?WT.mc_id=AZ-MVP-5004796#why-is-my-connector-still-using-an-older-version-and-not-auto-upgraded-to-latest-version-) automatically when a new major version is released by Microsoft.

### Configure Connector Group

Now that you have created the Connector, the Application Proxy has put our Connector in a group that has defaulted to Asia; because you can have more than one Application Proxy Connector for redundancy and different applications, we will create a new Connector Group that is set to use the Australia region if Asia works for you – feel free to skip this step.

 1. Login to **Azure Portal** _(on any PC/server)_
 2. Navigate to: [**Microsoft Entra ID**](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview)
 3. Select **Application Proxy**
 4. You should now see: Default and your Region
 5. If you **expand** the Default **Group**, will you see your Connector:
 6. ![Azure AD Application Proxy Connector Groups](/uploads/azureportal-applicationproxyconnector.png "Azure AD Application Proxy Connector Groups")
 7. Click on **+ New Connector Group**
 8. Give it a **name** _(i.e., On-premises_)
 9. **Select** the **Connector** you had earlier and **select the** region closest to you _(currently, the following regions can be chosen: Asia, Australia, Europe, North America)_
10. ![Azure AD Application Proxy - New Connector Group](/uploads/azureportal-applicationproxynewconnectorgroup.png "Azure AD Application Proxy - New Connector Group")
11. **Click + Create**
12. Clicking create will create your new On-premises connector group and add the Connector to the group.

### Configure your Azure Application Proxy Application

Now that you have your Connector setup, its time to set up your application

1. Login to **Azure Portal** _(on any PC/server)_
2. Navigate to: [**Microsoft Entra ID**](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview)
3. Select **Application Proxy**
4. Click on: **+ Configure an app**
5. **Fill** in the **details** that match your **application**:

* **Name**: This is the application that users will see _(i.e. I am going with Pizza, which is the name of my NAS)_
* **Internal URL**: This is the internal URL used to access your application inside the network _(in my example, it is:_ [_http://pizza.corp.contoso.com/_](http://pizza.corp.contoso.com/)_)_
* **External Url**: This is the external URL that will be created so that users can access the application form; _I will go with Pizza._ Note this URL down.
* **Pre-Authentication**: You don't have to authenticate with Azure AD, you can use passthrough, but it is not something I would recommend without delving into requirements, testing _– I am going to select: Microsoft Entra ID._
* **Connector Group**: Select the connector group you created earlier or that your Connector is signed to.
* **Leave** all **Additional Settings as default** – they can be changed later if you need to.
  1. ![Azure Application Proxy](/uploads/azureportal-applicationproxynewapplication.png)
  2. **Verify** that **everything** is filled out **correctly** and, click **+ Add**
  3. Azure **Application Proxy has now created a new Enterprise Application for you**; based on the name mentioned earlier, if you navigate to the external URL mentioned earlier, you should get a prompt similar to below:
  4. ![Azure AD Login Error](/uploads/azureportal-pizzaloginerror.png "Azure AD Login Error")
  5. It is now time to assign the permissions for users to access the Application via Microsoft Entra ID!

### Assign rights to your Azure Application Proxy Application

 1. Login to **Azure Portal** _(on any PC/server)_
 2. Navigate to: [**Microsoft Entra ID**](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview)
 3. Select [**Enterprise Applications**](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps/menuId/)
 4. **Find** the **application** that was **created** earlier by the Azure Application Proxy service.
 5. ![Microsoft Entra ID, Enterprise Application](/uploads/azureportal-enterpriseapplicationspane.png "Microsoft Entra ID, Enterprise Application")
 6. Click on the **Application**
 7. Click on: **Users and Groups**
 8. Click **Add Assignment**
 9. **Add** a **user** or **group** _(preferred)_ you want to have access to this application.
10. Click **Assigned**
11. ![Azure AD Enterprise Applications - User & Group Assignment](/uploads/azureportal-enterpriseapplicationsuserandgrpassignment.png "Azure AD Enterprise Applications - User & Group Assignment")
12. Click on **Application Proxy**
13. Here you can see and edit the information you created earlier when you created the application, **copy** the **External URL**
14. **Open** Microsoft **Edge** (_or another browser of your choice)_
15. **Paste** in the External **URL**
16. **Log in** with the Microsoft Entra ID **account** that was **assigned** to the Enterprise **application.**
17. You should now have access to your on-premises web application from anywhere in the world, and because you are using Microsoft Entra ID, your conditional access policies and restrictions will be in effect:
18. ![Synology Login](/uploads/microsoftazureapplicationproxyloginscreen.png "Synology Login")

_Note: Because the Synology web interface was running on port: 5000, I had to go back and add the port to the internal URL, as the Application Proxy was attempting to route to the incorrect port._
_Note: You may also notice that Microsoft has supplied an *.msappproxy.net certificate, even if your backend service doesn't have one.._

### Setup Password-based Single-Sign on

Azure Application Proxy supports various [single](https://learn.microsoft.com/en-us/azure/active-directory/app-proxy/application-proxy-config-sso-how-to?WT.mc_id=AZ-MVP-5004796) sign-on methods, including Kerberos SPN integration. 

However, my Synology NAS uses standalone accounts, so I will set Password-based single sign-on, allowing the MyApps extension to store my credentials _(if you want single-sign-on using the password-based sign in, then every user will need to have this extension configured)_.

 1. Download and install the [**MyApps Secure Sign-in extension**](https://microsoftedge.microsoft.com/addons/detail/my-apps-secure-signin-ex/gaaceiggkkiffbfdpmfapegoiohkiipl#:\~:text=My%20Apps%20Secure%20Sign-in%20Extension.%20This%20extension%20is,to%20cloud%20applications%20within%20your%20organization%20or%20school.)
 2. **Log** in using your Microsoft account to the MyApps **extension**
 3. ![Azure App Proxy](/uploads/myappsextensionlogo.png)
 4. **Login** to **Azure Portal** (_on any PC/server)_
 5. Navigate to: [**Microsoft Entra ID**](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview)
 6. Select [**Enterprise Applications**](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps/menuId/)
 7. **Find** the **application** that was created earlier by the Azure Application Proxy service.
 8. Click on **Single sign-on**
 9. Select **Password-based**
10. ![Azure Portal - Single Signon](/uploads/azureportal-appproxysso.png "Azure Portal - Single Signon")
11. **Type** in the **URL** of the **authentication webpage** and click **Save**
12. ![Azure App Proxy](/uploads/azureportal-appproxyssourl.png)
13. The Azure AD Application Proxy didn't find my sign-in login and password fields, so I have to manually configure them, select: **Configure Pizza Password Single Sign-on Settings**.
14. Select: **Manually detect sign-in fields**
15. Select **Capture sign-in fields**
16. ![Azure Application Proxy - Configure Sign-on](/uploads/azureportal-configuresignin.png "Azure Application Proxy - Configure Sign-on")
17. Your MS Edge Extension should show **Capture Field**:
18. ![Azure Application Configure Extension](/uploads/azureportal-configuresigninextension.png "Azure Application Configure Extension")
19. **Enter** in your **username**
20. Press **Enter**
21. **Enter** in your **password**
22. **Select** the MS Apps **extension** and select **Save**
23. Navigate back to the **Azure Portal**
24. Select '**I was able to sign in.'**
25. If successful, **Azure AD should now have mapped the fields**:
26. ![Azure Portal - Signin Fields](/uploads/azureportal-configuresigninextensionfields.png "Azure Portal - Signin Fields")
27. Click **Save**
28. Next time you log in to the application, the **My Apps Secure Sign-in Extension will have cached the credentials.** It should automatically log you into the application, meaning you should only log in once with your Azure AD credentials.

### Access your Azure Application Proxy published application

1. You can now go to [**My Apps (microsoft.com)**](https://myapps.microsoft.com/), and you will **see** your **application**.
2. ![M365 Waffle](/uploads/myapps.png)
3. Your application will also **appear** in the **Microsoft 365 Waffle** _(it may take up to an hour to appear)_:
4. ![M365 Waffle](/uploads/m365waffle_pizza.png)

I recommend you go into the Enterprise Application and upload a better image/logo so your users can quickly tell it apart.
