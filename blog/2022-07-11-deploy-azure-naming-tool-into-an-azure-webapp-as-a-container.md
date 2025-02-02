---
date: '2022-07-11 00:00:00 +1200'
title: Deploy Azure Naming Tool into an Azure WebApp as a container
authors: [Luke]
tags:
  - Azure
toc: true
header:
  teaser: /uploads/azurenamingtool_referencepage.png
slug: azure/deploy-azure-naming-tool-into-an-azure-webapp-as-a-container
---

Organising your cloud workloads to support governance, operational management, and accounting requirements can take a lot of effort before the first resource is created.

Well-defined naming and metadata tagging conventions help to locate and manage resources quickly. These conventions also help associate cloud usage costs with business teams via chargeback and show-back accounting mechanisms, along with rapidly identifying what services are used across services.

A useful naming convention composes resource names from important information about each resource. A well-chosen name helps you quickly identify the resource's type, associated workload, deployment environment, and the Azure region hosting it. Some resource names, such as PaaS services with public endpoints or virtual machine DNS labels, have global scopes, so they must be unique across the Azure platform.

There's no one size fits Azure naming convention; it needs to suit your organisation. However, it is worth noting that there are limitations to naming rules for Azure resources.

* [Naming rules and restrictions for Azure resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-name-rules?WT.mc_id=AZ-MVP-5004796 "Naming rules and restrictions for Azure resources")
* [Define your naming convention](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming?WT.mc_id=AZ-MVP-5004796 "Define your naming convention")

With rules around naming resources that are Global, specific to Resource Groups or that have maximum character limits that can't contain specific characters - it can become a project on its own, the world of Cloud where resources are treated as [cattle and not pets](http://cloudscaling.com/blog/cloud-computing/the-history-of-pets-vs-cattle/ "The History of Pets vs Cattle and How to Use the Analogy Properly") - the effort to develop a proper naming convention, used across teams or even companies can be quite complex.

This is where the Azure Naming Tool, as part of the Microsoft Cloud Adoption framework, comes into play.

### Overview

The Naming Tool _(v2 as of June 2022)_ was developed using a naming pattern based on [Microsoft's best practices](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging). Once the organisational components have been defined by an administrator, users can use the tool to generate a name for the desired Azure resource.

![Azure \[naming-tool\]](/uploads/azurenamingtoollogo.png "Azure [naming-tool]")

This tool sitting in the [Azure Naming Tool](https://github.com/mspnp/AzureNamingTool) GitHub repository runs as a standalone Web _(.NET 6 Blazor application)_ application using stateless JSON files for its Configuration and offers users the ability to generate and customise their own [Microsoft Azure Naming convention](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming?WT.mc_id=AZ-MVP-5004796 "Define your naming convention") taking all the restrictions into account. In addition, Azure Naming Tool - also provides a Swagger API that can be used in your Infrastructure as Code deployments to generate the names of resources on the fly.

![Azure Naming Tool - Reference](/uploads/azurenamingtool_referencepage.png "Azure Naming Tool - Reference")

This information is straight from the project README.md:

> **Project Components**
>
> * UI/Admin
> * API
> * JSON configuration files
> * Dockerfile
>
> **Important Notes**
>
> The following are important notes/aspects of the Azure Naming Tool:
>
> * The application is designed to run as a stand-alone solution, with no internet/Azure connection.
> * The application can be run as a .NET 6 site, or as a Docker container.
> * The site can be hosted in any environment, including internal or in a public/private cloud.
> * The application uses local JSON files to store the configuration of the components.
> * The application requires persistent storage. If running as a container, a volume is required to store configuration files.
> * The application contains a _repository_ folder, which contains the default component configuration JSON files. When deployed, these files are copied to the _settings_ folder.
> * The Admin interface allows configurations to be "reset", if needed. This process copies the configuration from the _repository_ folder to the _settings_ folder.
> * The API requires an API Key for all executions. A default API Key (guid) will be generated on first launch. This value can be updated in the Admin section.
> * On first launch, the application will prompt for the Admin password to be set.

### Deployment

#### Prerequisites

Today, we will deploy the Azure Naming Tool into an Azure WebApp, running as a Container.![Azure Naming Tool - High-Level Architecture](/uploads/azurenamingtool_architecture.png "Azure Naming Tool - High-Level Architecture")

The Azure resources we will create are:

* [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/?WT.mc_id=AZ-MVP-5004796 " Azure Container Registry")
* [Azure Storage Account](https://azure.microsoft.com/en-us/products/category/storage/?WT.mc_id=AZ-MVP-5004796 "Storage") _(with File Share - to store our persistent data and Configuration)_
* [Azure App Service Plan and App Service for Containers](https://azure.microsoft.com/en-us/services/app-service/containers/?WT.mc_id=AZ-MVP-5004796 " Web App for Containers") _(to run our Azure Naming Tool)_

You need Contributor rights in at least a Resource Group to deploy these Azure resources.

We will be using a mix of services such as:

* [Docker](https://www.docker.com/ "Docker")
* [PowerShell](https://learn.microsoft.com/en-us/powershell/?WT.mc_id=AZ-MVP-5004796 "PowerShell") & [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/?WT.mc_id=AZ-MVP-5004796 "Azure Command-Line Interface (CLI) documentation")
* [Azure Bicep](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/?WT.mc_id=AZ-MVP-5004796 "Bicep documentation")

To reduce the need to set up these dependencies on individual workstations, we will use a mix of the Azure Cloud Shell and Azure Portal. If you haven't set up your Azure Cloud Shell, you can refer to an article I wrote previously "[here](https://luke.geek.nz/2022/03/07/setup-azure-cloud-shell/ "Setup Azure Cloud Shell ")" for this remainder of this article I am going to assume you have it set up already.

Note: I will connect to the Cloud Shell using the [Windows Terminal](https://learn.microsoft.com/en-us/shows/it-ops-talk/azure-cloud-shell-in-the-windows-terminal?WT.mc_id=AZ-MVP-5004796 "Azure Cloud Shell in the Windows Terminal") so that any screenshots will be of the Terminal, but it's the same behaviour if I used the browser experience.

#### Clone the Git Repository

Now is time to clone the git repository into our Cloud Shell so that we can build the docker image definition.

1. **Log in** to the [Microsoft Azure Portal](https://portal.azure.com/#home "Microsoft Azure - Portal") and open up the **Azure Cloud Shell** _(make sure you are in PowerShell (not Bash))._
2. **Run** the following **commands** and wait for the Repository to be cloned directly into the CloudShell virtual instance:

       git clone https://github.com/mspnp/AzureNamingTool

![Azure Naming Tool - Clone Repo](/uploads/AzNamingTool_RepoClone.gif "Azure Naming Tool - Clone Repo")

#### Create Resource Group & Azure Container Registry

Now that we have our Repository, it's time to create our Resource Group and Container Registry _(Public)_; we will use a few PowerShell cmdlets to develop the resources; make sure you change the name of your Container Registry and Resource Group to match your environment.

1. Log in to the [Microsoft Azure Portal](https://portal.azure.com/#home "Microsoft Azure - Portal") and open up the **Azure Cloud Shell** _(make sure you are in PowerShell (not Bash))._
2. **Run** the following **commands** to **create** the **Resource Group** and the **Azure Container Registry**:

**Remember to change the name of the Container Registry - this is a globally unique resource, so if someone else has already created a registry with the same name, yours won't deploy.**

       $ResourceGroup = New-AzResourceGroup -Name 'AzNamingTool-PROD-RG' -Location 'Australia East'
       $registry = New-AzContainerRegistry -ResourceGroupName 'AzNamingTool-PROD-RG' -Name "ContainerRegistryAzNamingTool" -EnableAdminUser -Sku Basic
       Connect-AzContainerRegistry -Name $registry.Name

![AzureNaming Tool - Create Resource Group & Azure Container Registry](/uploads/AzNamingTool_ContainerRegistryImageBuild.gif "AzureNaming Tool - Create Resource Group & Azure Container Registry")

#### Build your image to the Azure Container Registry

The Azure Container Registry will be stored to host and build your image definition, as Docker support is not native to the Azure Cloud Shell; now that we have created it is time to build the image and push it to the registry. Ensure you are in the AzNamingTool folder _(CloudAdoptionFramework/ready/AzNamingTool/)_.

1. **Run** the following **Azure CLI** command:

       az acr build --image azurenamingtool:v1 --registry $registry.Name --file Dockerfile .

![AzureNaming Tool - Azure Container Registry](/uploads/AzNamingTool_ContainerRegistryImageBuild.gif "AzureNaming Tool - Azure Container Registry")

#### Deploy Azure App Service and WebApp

For the following, we will use a mix of Azure Bicep and the Azure Portal _(I ran into an Access Key error and PowerShell_ [_issue_](https://github.com/Azure/azure-powershell/issues/10645 "webapp: New-AzWebApp does not set LinuxFxVersion from ContainerImageName") _when attempting to map the share using Bicep and PowerShell - if you managed to complete the setup feel free to add a comment in the comments below)_.

Azure Bicep will be used to create the App Service and Storage account + file share, and then we will use the Azure Portal to complete the setup _(Azure WebApp as a Container and mapping the persistent file share)_.

First, we need to install Azure Bicep and import the Bicep file into Cloud Shell; we could Upload the file straight from the Portal or clone a [repo](https://github.com/lukemurraynz/Azure-Bicep "Azure-Bicep") with the file - but because I am using Azure Cloud Shell from the Terminal because Azure Cloud Shell runs on Linux - I am going to use 'nano' to create the Bicep file manually - feel free to do any of the above options to get the Azure Bicep into Cloud Shell.

##### Install Azure Bicep

1. To **install** Azure **Bicep,** run:

       az bicep install

![Azure Naming Tool - Install Azure Bicep](/uploads/install_azbicep.gif "Azure Naming Tool - Install Azure Bicep")

##### Create Azure Bicep File

We will use Nano, copy the Azure Bicep file and Paste it into Nano, and make sure you adjust the parameters to suit your environment before deploying.

1. In the **Azure Cloud Shell**, let us create the file by typing.

       nano AzNamingTool_main.bicep

2. **Paste** the Azure **Bicep file** and do any final edits
3. Now we need to save the file; press **Ctrl+X** on your keyboard
4. Press **Y** to save the file
5. Verify the file name and press **Enter** to accept the filename.

   ![Azure Naming Tool - Create Bicep file](/uploads/createazbicepfile.gif "Azure Naming Tool - Create Bicep file")

**Remember to edit the Azure Bicep parameters, the Resource Names need to be globally unique, so you may run into problems if someone has deployed using the same name!**

```bicep title="AzNamingTool_main.bicep"
//Related to a Blog Article: https://luke.geek.nz for setting up Azure Naming Tool.
///Parameter Setting
param location string = resourceGroup().location

//Adjust Parameter values to match your naming conventions

param serverfarms_AzNamingTool_ASP_Prod_name string = 'AzNamingTool-ASP-Prod'
param storageAccounts_aznamingstgacc_name string = 'aznaming'

// The following Parameters are used add Tags to your deployed resources. Adjust for your own needs.

param dateTime string = utcNow('d')
param resourceTags object = {
  Application: 'Azure Naming Tool'
  Version: 'v2.0'
  CostCenter: 'Operational'
  CreationDate: dateTime
  Createdby: 'Luke Murray (luke.geek.nz)'
}

/// Deploys Resources

//Deploys Azure Storage Account for Azure File Share for AzNamingtool persistant data

resource storageAccounts_aznamingstgacc_name_resource 'Microsoft.Storage/storageAccounts@2021-09-01' = {
  name: '${storageAccounts_aznamingstgacc_name}${uniqueString(resourceGroup().id)}'
  location: location
  tags: resourceTags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    dnsEndpointType: 'Standard'
    defaultToOAuthAuthentication: false
    publicNetworkAccess: 'Enabled'
    allowCrossTenantReplication: false
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: true
    allowSharedKeyAccess: true
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
    }
    supportsHttpsTrafficOnly: true
    encryption: {
      requireInfrastructureEncryption: false
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
}
// Deploys Azure File Share from the Storage Account above.

resource Microsoft_Storage_storageAccounts_fileServices_storageAccounts_aznamingstgacc_name_default 'Microsoft.Storage/storageAccounts/fileServices@2021-09-01' = {
  parent: storageAccounts_aznamingstgacc_name_resource
  name: 'default'

  properties: {

    shareDeleteRetentionPolicy: {
      enabled: true
      days: 7
    }
  }
}

resource storageAccounts_aznamingstgacc_name_default_aznamingtool 'Microsoft.Storage/storageAccounts/fileServices/shares@2021-09-01' = {
  parent: Microsoft_Storage_storageAccounts_fileServices_storageAccounts_aznamingstgacc_name_default
  name: 'aznamingtool'
  properties: {
    accessTier: 'TransactionOptimized'
    shareQuota: 100
    enabledProtocols: 'SMB'
  }
}

//Deploys the App Service PLan for AzNamingTool

resource serverfarms_AzNamingTool_ASP_Prod_name_resource 'Microsoft.Web/serverfarms@2021-03-01' = {
  name: serverfarms_AzNamingTool_ASP_Prod_name
  tags: resourceTags
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
    size: 'B1'
    family: 'B'
    capacity: 1
  }
  kind: 'linux'
  properties: {
    perSiteScaling: false
    elasticScaleEnabled: false
    maximumElasticWorkerCount: 1
    isSpot: false
    reserved: true
    isXenon: false
    hyperV: false
    targetWorkerCount: 0
    targetWorkerSizeId: 0
    zoneRedundant: false
  }
}
```

##### Deploy Azure Bicep

Now it's time to create the Azure App Service Plan and Storage account **_(remove the -what if flag at the end, when you confirmed there are no errors)_**.

1. **Run** the following **command** to deploy the **App Service and Storage** account into your Resource Group:

       New-AzResourceGroupDeployment -Name 'AzNamingTool-WebApp' -ResourceGroupName 'AzNamingTool-PROD-RG' -TemplateFile .\AzNamingTool_main.bicep -WhatIf

![Azure Naming Tool - Deploy Azure Bicep resources](/uploads/deployaznamingtoolbicepresources.gif "Azure Naming Tool - Deploy Azure Bicep resources")

Your resources _(App Service, Storage account with File Share)_ should now be deployed, and we can now close our trusty Cloud Shell.

##### Deploy and configure WebApp as a Container

 1. Log in to the [Microsoft Azure Portal](https://portal.azure.com/#home "Microsoft Azure - Portal")
 2. Click **+ Create a Resource**
 3. Search for: Web App and click **Create a Web App**
 4. Select your **Subscription** and **Resource Group**
 5. **Select** a **name** for your Web App _(AzNamingTool-AS-Prod)_
 6. In **Publish**, select **Docker Container**
 7. For Operating system: Select **Linux**
 8. Select the **Region** that your App Service plan was deployed to
 9. **Select** the App Service **Plan** created earlier, then Select **Next: Docker**
10. ![Azure Naming Tool - Web App Deployment](/uploads/azure-naming-tool-webapp-deployment-general.png "Azure Naming Tool - Web App Deployment")
11. Under Options, select **Single Container**
12. Change Image Source to **Azure Container Registry**
13. Select your **Registry** and **Azure Naming Too**l image, then select **Next: Networking**
14. ![Azure Naming Tool - Registry](/uploads/azure-naming-tool-webapp-deployment-docker.png "Azure Naming Tool - Registry")
15. If you want to enable Network injection, by placing it on your Virtual Network, you can configure this, and we are just going head to **Monitoring.** 
16. Application Insights isn't required, but it is recommended _- even if it is just for Availability alerting)_; I always enable it, so select **Yes** and **Next Tags.**
17. ![Azure App Deployment - Application Insights](/uploads/azure-naming-tool-webapp-deployment-app-insights.png "Azure App Deployment - Application Insights")
18. Enter in any applicable **Tags** and finally click **Review + Create**
19. Click **Create**
20. Now that your container is running, we need to mount the Azure file share, so any persistent data is saved.
21. **Open** your newly created **App Service.**
22. Navigate to **Configuration**, under Settings in the navigation bar
23. Click on **Path mappings**
24. Click **+ New Azure Storage Mount**
25. **Give** the **mount** a **name**: i.e. _a naming tool-stg-mnt_
26. Select **Basic Configuration**
27. Select the **Storage account** created earlier _(as part of the Bicep deployment)_ and select **Azure File share**
28. Select your Storage container and enter in**/app/settings** to the mount path and click **Ok**
29. ![Azure App Service - Mount Azure File Share](/uploads/azure-naming-tool-webapp-deployment-storage-mount.png "Azure App Service - Mount Azure File Share")
30. Then select Save to **Save** the Path Mappings

##### Optional: Azure App Service Tweaks

By now, your Azure Naming Tool should be accessible,  you don't need to do any of the following, but I recommend them at a bare minimum _(environment and use case depending)_.

###### Enable [**Always On**](https://learn.microsoft.com/en-us/azure/app-service/configure-common?tabs=portal&WT.mc_id=AZ-MVP-5004796 "Configure an App Service app")

1. In your App Service, select **Configuration**, then **General Settings**
2. Check **'On**' under 'Always On'
3. Click **Save**

###### Configure Firewall

Your App Service will be publically accessible by default, and although you may want to link it to your network via a Private Endpoint, locking down by Public IP may be suitable in some scenarios _(such as this demo environment)_. 

1. To lock it down to a specific Public IP, in your App Service, Select **Networking**, then **Access restriction.**
2. Add in your **Public IP** to restrict it from being accessible from your network and click **Ok.**
3. Make sure you select the scm instance and select: **Same restrictions** so that the SCM instance isn't also publically accessible.

### Let's take a look!

Now that you have successfully deployed the Azure Naming Tool let's take a look.

To open your **Azure Naming Tool**, navigate to your **App Service** and select **Browse** (or copy the URL).

When you open it the first time, you will have the option to create an Admin password, set your Password and select Save; if the Azure File Share wasn't mounted to the Web App - then your Password won't be saved if the App Services crashes or gets reloaded to another node.

![Azure Naming Tool](/uploads/azure-naming-tool.png)

Click on **Generate**

You can immediately generate a naming standard out of the box _(and it already contains the prefix for the NZ North Azure region!)_.

![Azure Naming Standard - Generate](/uploads/azurenamingtool-generate.png "Azure Naming Standard - Generate")

If you click **Reference,** you can see the reference criteria that Azure Naming Tool works with generating your Naming schema; for example, for ApiManagement APS, we can see that the short name is: API; it supports up to 256 characters but cannot have a '#', and does not need a globally unique name.

![Azure Naming Tool - Reference API Management](/uploads/azurenamingstandard-referenceapi.png "Azure Naming Tool - Reference API Management")

If you navigate to: **Configuration**, this is where you can specify any Custom changes to suit your Organisation or Organisations _(yes, you can use this as a Cloud Architect or Consultant to generate names of multiple organisations)_. If you don't like the default prefixes for the Resources, Regions, Environment or even Delimiters, you can adjust them here.

![Azure Naming Tool - Configuration](/uploads/azurenamingtool-configuration.png "Azure Naming Tool - Configuration")

You can also **Export** and **Import** a configuration from a previous install on the Configuration pane.

There is also an Azure Naming Tool Swagger API that you can leverage _(the API key can be found under Admin)_ in your Infrastructure as Code or script deployments.

![Azure Naming Tool - API](/uploads/azurenamingtool-api.png "Azure Naming Tool - API")
