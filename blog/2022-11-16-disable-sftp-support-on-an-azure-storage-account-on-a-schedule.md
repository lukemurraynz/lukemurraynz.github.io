---
title: Disable SFTP support on an Azure Storage account on a Schedule
authors: [Luke]
tags:
  - Azure
date: 2022-11-16 00:00:00 +1300
toc: true
header:
  teaser: /uploads/azautomation_runbook_run.png
slug: azure/disable-sftp-support-on-an-azure-storage-account-on-a-schedule
---

Azure Storage account [SFTP functionality](https://learn.microsoft.com/en-us/azure/storage/blobs/secure-file-transfer-protocol-support?WT.mc_id=AZ-MVP-5004796#pricing-and-billing "SSH File Transfer Protocol (SFTP) support for Azure Blob Storage") has now gone GA _(Generally Available)_ across most regions as part of the GA release - SFTP support for Azure Storage accounts was free while it was in preview - but now that the service is GA - there is an additional charge for SFTP _(Secure File Transfer)_ functionality.

> Enabling the SFTP endpoint has a cost of $0.30 per hour. We will start applying this hourly cost on or after December 1, 2022.

This service has worked for me without a hitch for months, but as with most resources in Microsoft Azure - you pay for what you use! Therefore, there may be instances where you do not need SFTP support 24 hours a day, seven days a week! This is where the following Azure Automation runbook can help.

_Feel free to check out a_ [_previous article_](https://luke.geek.nz/azure/sftp-in-microsoft-azure-using-azure-blob-storage/ "SFTP in Microsoft Azure using Azure Blob Storage ") _on setting up SFTP support for an Azure storage account._

#### Overview

Using an [Azure Automation](https://learn.microsoft.com/en-us/azure/automation/overview?WT.mc_id=AZ-MVP-5004796 "What is Azure Automation?") PowerShell runbook and Schedules _(as part of the Azure Automation account)_  - we can turn on the SFTP endpoint - when we need it and disable it - the rest of the time - which is excellent from a security and cost perspective.

#### Prerequisites

To do this, we will need an:

* Azure Automation Account
* System Managed Identity set with Storage Account Contributor rights
* PowerShell runbook _(supplied below)_

For this article, I will assume you already have an Azure Automation account - if you do not - then follow the Microsoft documentation: [Create a standalone Azure Automation account](https://learn.microsoft.com/en-us/azure/automation/automation-create-standalone-account?tabs=azureportal&WT.mc_id=AZ-MVP-5004796 "Create a standalone Azure Automation account").

#### Deploy & Configure

Now that the Azure Automation account has been configured and set up - we need to add the Runbook, but before we can do that - there are some dependencies. For example, SFTP is a new service that the currently installed Az Modules in the Azure Automation don't have visibility on - so to configure the SFTP service - we need to update 2 Modules to the most recent version.

These modules are:

* Az.Accounts _(≥ 2.10.3)_
* Az.Storage

Az.Accounts are a dependent service of the latest Az.Storage account, so let us import that first.

##### Update Az.Accounts module

1. In the [**Azure Portal**](https://portal.azure.com/#home "Microsoft Azure Portal"), navigate to [**Azure Automation accounts**](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Automation%2FAutomationAccounts "Azure Automation Accounts").
2. Find your Azure Automation account and, click on it, navigate to **Modules** _(under Shared resources)_.
3. Select **Browse Gallery**
4. Search for: **Az.Accounts**
5. ![Import Az.Accounts](/uploads/azautomation_gallery_azaccounts.png "Az.Accounts")
6. Click '**Az.Accounts**' and select **Select.**
7. Set the **runtime** version to: **5.1** & select impor**t**
8. Wait for 5 minutes while the module imports.

##### Update Az.Storage module

_Note: the Az.The accounts module will need to finish its import before the Az.The storage module is updated._

1. In the [**Azure Portal**](https://portal.azure.com/#home "Microsoft Azure Portal"), navigate to [**Azure Automation accounts**](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Automation%2FAutomationAccounts "Azure Automation Accounts").
2. Find your Azure Automation account and, click on it, navigate to **Modules** _(under Shared resources)_.
3. Select **Browse Gallery**
4. Search for: **Az.Storage**
5. ![Import  Az.Storage](/uploads/azautomation_gallery_azstorage.png " Az.Storage")
6. Click '**Az.Storage**' and select **Select.**
7. Set the **runtime** version to: **5.1** & select impor**t**
8. Wait for 5 minutes while the module imports.

##### Create System Managed Identity

Now that the base Modules have been updated, we need to create a System Managed Identity - this Managed Identity will allow the Azure Automation runbook to authenticate to your Azure resources - and, in our example - make changes, such as Disabling or Enabling the SFTP service. This System Managed Identity will need Storage Account Contributor rights.

1. In the [**Azure Portal**](https://portal.azure.com/#home "Microsoft Azure Portal"), navigate to [**Azure Automation accounts**](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Automation%2FAutomationAccounts "Azure Automation Accounts").
2. Find your Azure Automation account and click on it; click on **Identity** _(under Account Settings)_
3. Select Status to: **On** and select **Save**
4. Click on: **Azure role assignments**
   1. Select your **Scope** _(in our example, we will go with Storage - to limit what changes this Azure Automation account can make)_
   2. Select the **Subscription** and **Storage account** Resource on which you want to disable or enable the SFTP service.
   3. For the role, select **Storage Account Contributor**.
   4. Click **Save**

_You should now see the Azure automation account, listed as having Storage account contributor rights - under your Automation account's Access Control (IAM) blade._

##### Import Runbook - Set-AzStgFTP.ps1

Now that the AzAccounts, Az.Storage modules have been updated, and the Azure Automation account has been given permission - to enable and disable the SFTP service on the storage account- it's time to import the Runbook that will make this happen.

 1. In the [**Azure Portal**](https://portal.azure.com/#home "Microsoft Azure Portal"), navigate to [**Azure Automation accounts**](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Automation%2FAutomationAccounts "Azure Automation Accounts").
 2. Find your Azure Automation account and, click on it, navigate to **Runbooks** _(under Process Automation)_.
 3. Click **+ Create a Runbook**
 4. Enter your runbook **name** _(i.e. Set-AzSFTP)_
 5. Select the Runbook type as **PowerShell**
 6. Select the Runtime version as: **5.1**
 7. \[Optional\] Add a description of what this Runbook does and who to contact.
 8. Click **Create**
 9. Open the newly created blank Runbook, and select **Edit**
10. **Copy** the following PowerShell [**script**](https://github.com/lukemurraynz/Azure/blob/main/Azure%20Automation/Set-AzStgSFTP.ps1 "Set-AzStgSFTP.ps1") into the Edit pane:

         param
            (
                [Parameter(Mandatory=$true,Position = 0, HelpMessage = 'Enter the Azure Resource Group, that contains your Azure Storage account')]
                [string]
                $resourceGroupName,
            
                [Parameter(Position = 1, Mandatory = $true, HelpMessage = 'Enter the Azure Storage account name')]
                [string]
                $storageAccountName,
            
                [Parameter(Mandatory = $true, HelpMessage = '$True = Enable SFTP & $False = Disable SFTP')][ValidateSet('False','True')]
                $enableSftp
            )
          
              <#
            .SYNOPSIS
            Disables or enables SFTP support on an Azure Storage Account.
            .DESCRIPTION
            Disables or enables SFTP support on an Azure Storage Account. The intention is for this script to be used in Azure Automation, alongside a Schedule to enable or disable SFTP support on an Azure Storage Account.
        
            .EXAMPLE
            Set-AzStgSFTP -resourceGroupName sftp_prod -storageAccountName sftpprod0 -EnableSFTP $true
          #>
        
          
          # Ensures you do not inherit an AzContext in your runbook
        Disable-AzContextAutosave -Scope Process
        
        Import-Module -Name Az.Storage
        # Connect to Azure with system-assigned managed identity
        $AzureContext = (Connect-AzAccount -Identity).context
        
        Write-Output -InputObject $AzureContext
        Write-Output -InputObject $AzureContext.Subscription
        Write-Output -InputObject $resourceGroupName 
        Write-Output -InputObject $storageAccountName
        Write-Output -InputObject $EnableSFTP
        # set and store context
        $AzureContext = Set-AzContext -SubscriptionName $AzureContext.Subscription -DefaultProfile $AzureContext
        
          
          $SetSFTP = [System.Convert]::ToBoolean($enableSftp)
        
            $SFTPStatusBefore = Get-AzStorageAccount -DefaultProfile $AzureContext -ResourceGroupName $resourceGroupName -Name $storageAccountName | Select-Object -ExpandProperty EnableSftp
        
            $Status = $SFTPStatusBefore -replace 'True', 'Enabled' -replace 'False', 'Disabled'
        
            Write-Output -InputObject ('SFTP for {0} currently has SFTP set to: {1} before update.' -f $storageAccountName, $Status)
          
            Set-AzStorageAccount -DefaultProfile $AzureContext -ResourceGroupName $resourceGroupName -Name $storageAccountName -EnableSftp $SetSFTP 
           
        
            $SFTPStatusAfter = Get-AzStorageAccount -DefaultProfile $AzureContext -ResourceGroupName $resourceGroupName -Name $storageAccountName | Select-Object -ExpandProperty EnableSftp
        
            $Status = $SFTPStatusAfter -replace 'True', 'Enabled' -replace 'False', 'Disabled'
        
            Write-Output -InputObject ('SFTP for {0} currently has SFTP set to: {1} after update.' -f $storageAccountName, $Status)
11. Click **Save**
12. Click **Publish**

##### Run Runbook - Set-AzStgFTP

Now that the Runbook is imported, we need to run it.

The Runbook uses the following parameters:

| Parameters | Values |
| --- | --- |
| resourceGroupName | Enter the name of the Azure Resource Group, that contains your Azure Storage account. |
| storageAccountName | Enter the name of your Azure Storage account. |
| enableSftp | The following boolean values are accepted: False (Disable SFTP) and True (Enable SFTP). |

1. Next, find your Runbook, and select **Start.**
2. Enter your parameters, **Resource Group**, **Storage Account** and **Enable SFTP.**
3. ![Start Azure Automation runbook](/uploads/azautomation_runbook_runparameters.png "Start Azure Automation runbook")
4. Click **Ok**
5. The Runbook will run, and as you can see - outputs its state Before the Runbook ran and after.
6. ![Azure Automation - Run](/uploads/azautomation_runbook_run.png "Azure Automation - Run")

**Once working correctly, you can set up an** [**Azure Automation schedule**](https://learn.microsoft.com/en-us/azure/automation/shared-resources/schedules?WT.mc_id=AZ-MVP-5004796 "Azure Automation schedule") **to trigger the runbook to enable and disable the SFTP when needed only!**
