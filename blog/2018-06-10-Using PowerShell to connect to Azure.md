---
date: "2018-06-10"
title: Using PowerShell to connect to Microsoft Azure
authors: [Luke]
tags:
  - Azure
  - PowerShell
header:
  teaser: "images/powershell-blog-feature-banner.png"
---

Microsoft Azure has a good user portal where you can do most things, however
when it comes to automation, gathering a lot of information at once and more
in-depth scenarios that the Portal doesn’t quite offer – PowerShell is used.

Before you can use PowerShell to connect to Microsoft Azure, you need to install
the Azure Resource Manager modules first – follow the guide below:

- [Install and configure Azure
    PowerShell](https://learn.microsoft.com/en-us/powershell/azure/new-azureps-module-az?view=azps-7.5.0&viewFallbackFrom=azps-5.7.0&WT.mc_id=AZ-MVP-5004796)

![Disable SMB1](/images/posts/InstallAzureRMModule.gif)

Once the Az modules has been installed – you can now connect to Azure.

Usually you would have to go through the process of logging in to Azure, finding
what subscription you need to connect to and then selecting that manually,
however I have created a little function that will connect to Azure and
automatically populate a list of the subscriptions that your account has access
to in a window which you can then select to connect to which makes the process
easier without having to remember different Azure subscription names or ids.
This function can easily be used in any environment. I have it loaded as part of
my PowerShell profile script so the function can be run from the second I open
up a new PowerShell prompt.

*Note: Script is also hosted on my Github repository. Feel free to
clone/recommend improvements or fork.*
