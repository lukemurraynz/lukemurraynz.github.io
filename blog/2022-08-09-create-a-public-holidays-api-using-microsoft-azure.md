---
title: Create a Public Holidays API using Microsoft Azure
authors: [Luke]
tags:
  - Azure
date: 2022-08-09 00:00:00 +1300
toc: true
header:
  teaser: /uploads/azureportal_storagebrowser_api_table.png
---

Using a previous [blog post](https://luke.geek.nz/azure/turn-on-a-azure-virtual-machine-using-azure-automation/ "Turn on a Azure Virtual Machine using Azure Automation") I did on using a third-party API _(Application Programming Interface)_ to start a Virtual Machine when it wasn't a Public Holiday, I had a thought on what could be an option if I wanted an API only accessible on an internal network or if I wanted to include custom Holidays such as Star Wars day or company holidays? Could I create and query my API using Microsoft Azure services? You can!

### Overview

> Today we will create a base Public Holidays API using several Microsoft Azure serverless services, such as Azure Function, Azure Storage Account and API Management.

_Note: As this is a demonstration, I will be using a_ [_Consumption-based Azure Function_](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale?WT.mc_id=AZ-MVP-5004796 "Azure Functions hosting options") _and Azure storage account, and although it is a good place to start - depending on your requirements, you may be better off with Azure Function Premium Plan to avoid cold-start times, and if you need a high amount of requests and writes (GET and POSTs) and resiliency, then replace the Storage account table with a_ [_Cosmos DB_](https://learn.microsoft.com/en-us/azure/cosmos-db/introduction?WT.mc_id=AZ-MVP-5004796 "Azure Cosmos DB")_._

The solution will be made up of the following:

| Azure Service | Name | Plan | Note |
| --- | --- | --- | --- |
| Application Insights | ai-nzPublicHolidays-prd-ae |  |  |
| Azure API Management | apims-publicholidays-prd-ae | Developer (No SLA) |  |
| Azure Function | func-nzpublicHolidays-prd-ae | Function App - Consumption |  |
| Azure Storage Account | funcnzpublicholidaystgac | StorageV2 (general purpose v2) - Locally-redundant storage (LRS) | Contains 'PublicHolidays' table |
| Azure Storage Account | rgnzpublicholidayspb4ed | Storage (general purpose v1)  - Locally-redundant storage (LRS) | Contains Azure Functions App Files |
| Resource Group | rg-publicholidays-prd-ae |  | Resource Group - containing above resources. |

![Azure Resource Group - Diagram](/uploads/api_resourcegroupazviz.png "Azure Resource Group - Diagram")

#### Pre-requisites

* An Azure subscription _(with at least Contributor rights to a Resource Group)_.
* Azure PowerShell modules _(_[_Az.Accounts_](https://learn.microsoft.com/en-us/powershell/module/az.accounts/?view=azps-8.2.0&WT.mc_id=AZ-MVP-5004796 "Az.Accounts")_,_ [_Az.Storage_](https://learn.microsoft.com/en-us/powershell/module/az.storage/?view=azps-8.2.0&WT.mc_id=AZ-MVP-5004796 "Az.Storage") _&_ [_AzTables_](https://www.powershellgallery.com/packages/AzTable/ "AzTable")_)_

_Note: AzTables is not part of the standard Az PowerShell module set and is a separate module you will need to install (Install-Module AzTables)._

We will use a mix of the Azure Portal and PowerShell to deploy this solution from start to finish; you can find the source data and code directly in the GitHub repository here: [lukemurraynz/PublicHoliday-API](https://github.com/lukemurraynz/PublicHoliday-API "PublicHoliday-API") for reference _(feel free to fork, raise pull requests etc.)._ In this guide, I will try not to assume preexisting knowledge _(other than general Azure and PowerShell knowledge)_.

### Deployment

The deployment steps will be separated into different sections to help simplify implementation.

> First, make sure you adjust the names of your resources and locations to suit your naming conventions and regional locations _(such as Australia East or West Europe)_. Your deployments may fail if a name is already in use. See "[Microsoft Azure Naming Conventions](https://luke.geek.nz/azure/microsoft-azure-naming-conventions/ "Microsoft Azure Naming Conventions ")" for more about Naming conventions.

#### Create Resource Group

The Resource Group will contain all resources related to the API that we will deploy today.

_However, I recommend you consider what resources might be shared outside of this API - such as API Management, and put them in a separate Shared or Common Resource Group, to keep the li.e.ecycle of your resources together (ie API resources all in one place, so if it gets decommissioned, it is as easy a deleting the Resource Group)._

1. Log in to the [**Microsoft Azure Portal**](https://portal.azure.com/#home "Microsoft Azure Portal")
2. Click **Click on the burger and click** [**Resource groups**](https://portal.azure.com/#view/HubsExtension/BrowseResourceGroups "Resource Groups")
3. Click **+ Create**
4. Select your **Subscription**
5. Type in a name for your **Resource Group** _(like 'rg-publicholidays-prd-ae')_
6. Select your **Region** and click **Next: Tags**
7. Enter in applicable **tags** _(i.e. Application: Public Holidays API)_
8. Click **Next: Review + create**
9. Click **Create**

![Create a resource group](/uploads/azureportal_creatergapi.png "Create a resource group")

If you prefer PowerShell, you can deploy a new Resource Group with the below:

    New-AzResourceGroup -Name 'rg-publicholidays-prd-ae' -Location 'Australia East' -Tag @{Application="Public Holidays API"}

#### Create Storage Account

Now that the Resource Group has been created, it's time to import our Storage Account - which will hold our Table of data around Public Holidays.

 1. Log in to the [**Microsoft Azure Portal**](https://portal.azure.com/#home "Microsoft Azure Portal")
 2. Click **Click on the burger and click** [**Storage Accounts**](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts "Storage accounts")
 3. Click **+ Create**
 4. Select the **Subscription** and **Resource Group** you created earlier
 5. Enter in a **Name** for your **Storage Account** (_like 'funcnzpublicholidaystgac')_
 6. Select your **Region** _(i.e. Australia East)_
 7. For **Performance**, I am going to select: **Standard**
 8. For **Redundancy**, as this is a demo, I will select **Locally-redundant storage (LRS). However, if** you plan on running this in production, you may consider ZRS for zone redundancy.
 9. If you plan on locking down the Storage Account to your Virtual Network or specific IP addresses, continue to the Networking Tab; we can accept the defaults and click: **Review**.
10. Click **Create**

If you prefer PowerShell, you can deploy a new Storage account with the below:

    New-AzStorageAccount -ResourceGroupName 'rg-publicholidays-prd-ae' -Name 'funcnzpublicholidaystgac' -Location 'Australia East' -SkuName 'Standard_LRS' -Kind StorageV2

#### Import Public Holiday data

##### Create Azure Storage Account Table

Now that we have the Storage account that will hold our Public Holiday time to import the data.

Most of this task will be done with PowerShell, but first, we need to create the Table that will hold our Public Holidays.

1. Log in to the [**Microsoft Azure Portal**](https://portal.azure.com/#home "Microsoft Azure Portal")
2. Click **Click on the burger and click** [**Storage Accounts**](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts "Storage accounts")
3. **Navigate** to your created **Storage** account
4. In the Navigation blade, click **Tables**
5. Click **+ Table**
6. For a Table Name, I will go with **PublicHolidays**
7. Click **Ok**

![Create Azure Storage Account Table](/uploads/azureportal_createpublicholidaystable.png "Create Azure Storage Account Table")

You can use PowerShell to create the Table below:

    $storageAccount = Get-AzStorageAccount -ResourceGroupName 'rg-publicholidays-prd-ae' -Name 'funcnzpublicholidaystgac'
    $storageContext = $storageAccount.Context
    New-AzStorageTable -Name 'PublicHolidays' -Context $storageContext

##### Import Public Holiday Data into Table

Now that we have the Azure storage account and PublicHolidays table, it's time to import the data.

If you want to do this manually, the Azure Table will have the following columns:

| Date | Country | Type | Name | Day | Year | Comments |

We could enter the data manually, but I will leverage the Nager API to download and parse a CSV file for a few countries. You can find the source data and code directly in the GitHub repository here: [lukemurraynz/PublicHoliday-API](https://github.com/lukemurraynz/PublicHoliday-API "PublicHoliday-API") for reference.

To do this, we will need PowerShell, so assuming you have logged into PowerShell and set the context to your Azure subscription, let us continue.

I have created a CSV _(Comma-separated values)_ file with a list of countries _(i.e. US, NZ, AU)_ called 'SourceTimeDate.CSV', but you can adjust this to suit your requirements and place it in a folder on my C:\\ drive called: Temp\\API.

Open **PowerShell** and **run** the following:

    $Folder = 'C:\Temp\API\'
    $Csv = Import-csv "$Folder\DateTimeSource\SourceTimeDate.csv"
    $CurrentYear = (Get-Date).Year
    
       ForEach ($Country in $Csv)
      {
    $CountryCode = $Country.Country
    Invoke-WebRequest -Uri "https://date.nager.at/PublicHoliday/Country/$CountryCode/$CurrentYear/CSV" -OutFile "$FolderAPI\DateTimeSource\Country$CountryCode$CurrentYear.csv" 
    }

These cmdlets will download a bunch of CSV files into the API folder, with the Public Holidays for each Country for this year, and then you can adjust the $CurrentYear variable for future years _(i.e. 2025)_.

Once you have all the CSV files for your Public Holidays and before we import the data into the Azure storage table, now is the time to create a new Custom Holidays CSV; you can easily use an existing one to create a new CSV containing your company's public holidays or other days that may be missing from the standard list, make sure it matches the correct format and save it into the same folder.

![Custom Public Holidays API](/uploads/customholidays_api.png "Custom Public Holidays API")

Now that you have all your CSV files containing the Public Holidays in your Country or countries, it's time to import them into the Azure Table. First, we import the data using a PowerShell session logged into Azure.

    # Imports Public Holiday into Azure Storage table
    # Requires AzTable Module (not part of the normal Az cmdlets)
    Import-Module AzTable
    
    #Imports data from CSV files into $GLobalHolidays variable
    $Folder = 'C:\Temp\API\'
    
    $GlobalHolidays = Get-ChildItem "$Folder\DateTimeSource\*.csv" | Foreach-Object {
      $basename = $_.BaseName
      import-csv $_ 
    }
    
    #Connect-AzAccount
    #Connects to Azure Storage Account
    $storageAccountName = 'funcnzpublicholidaystgac'
    $resourceGroupName = 'rg-publicHolidays-prd-ae'
    $tableName = 'PublicHolidays'
    $storageAccount = Get-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName
    $storageContext = $storageAccount.Context
    $cloudTable = (Get-AzStorageTable -Name $tableName -Context $storageContext).CloudTable
    
      
    #Imports CSV data into Azure Table
    $counter = 0
    ForEach ($Holiday in $GlobalHolidays)
    
    {
      $Date = [DateTime]($Holiday.Date)
      $Dayofweek = $Date.DayOfWeek | Out-String
      $Year = $Date.Year
      $HolidayDate = Get-Date $Date -format "dd-MM-yyyy"
    
     Add-AzTableRow `
      -table $cloudTable `
      -partitionKey '1' `
      -rowKey ((++$counter)) -property @{"Date"=$HolidayDate;"Country"=$Holiday.CountryCode;"Type"=$Holiday.Type;"Name"=$Holiday.LocalName;"Day"=$Dayofweek;"Year"=$Year;"Comments"=$Holiday.Counties}
    
    }
    
    
    #Validate the data in the Storage table
    Get-AzTableRow -table $cloudTable

![Import CSV to Azure Storage Account](/uploads/import-csvtoazuretables.gif "Import CSV to Azure Storage Account")

![Validate Azure Storage Account Table](/uploads/import-csvtoazuretablesvalidate.gif "Validate Azure Storage Account Table")

Now the Public Holidays are imported into the Azure storage account table with additional information, such as the Day it falls, and the Date format has been changed to suit the NZ format _(DD-MM-YYYY)_.

If we log in to the Azure Portal, navigate to the Storage account and under Storage Browser, we can now see our Table is full of Public Holidays.

![](/uploads/azureportal_storagebrowser_api_table.png)

#### Create API

That we have our Table with Public Holiday data, it's time to create our Azure Function to act as the API that will talk to the azure storage account!

##### Create Azure Function

 1. Log in to the [**Microsoft Azure Portal**](https://portal.azure.com/#home "Microsoft Azure Portal")
 2. Click **Click on the burger and click** [**Resource groups**](https://portal.azure.com/#view/HubsExtension/BrowseResourceGroups "Resource groups")
 3. Navigate to your **resource group** and click **+ Create**
 4. Search for: **Function**
 5. Select **Function App**, and click **Create**
 6. Enter your **Function App Name** _(i.e. 'func-nzpublicHolidays-prd-ae')_
 7. For Runtime Stack, select **PowerShell Core**
 8. Select the latest version (at this time, it's **7.2**)
 9. Select your **Region**
10. Select **Windows**
11. Set your **Plan** _(in my example, its Consumption (Serverless))_
12. Click **Review + Create**
13. Click **Create**

![Azure Function - Create](/uploads/azureportal_createazfunctionapiwin.png "Azure Function - Create")

##### Configure Environment Variables

Now that the Function App has been created before creating the GetPublicHoliday function, we need to add a few environment variables that the Function will use; these variables will contain the ResourceGroup and Storage account name.

1. **Navigate** to your **Azure Function**
2. Click **Configuration**
3. Click **+ New application setting**
4. Under the name, add: **PublicHolidayRESOURCEGROUPNAME**
5. For value, type in the name of your resource group.
6. Add a second application setting named: **PublicHolidaySTORAGEACCNAME**
7. For value, type in the name of your storage account that contains the Public Holiday table.
8. Click **Save** _(to save the variables)_.

![Azure Function - Variables](/uploads/azureportal_funcapp_api_variables.png "Azure Function - Variables")

##### Configure Managed Identity

Next, we need to give the Function App the ability to read the Azure storage account. To do this, we need to configure a System assigned managed identity.

 1. **Navigate** to your **Azure Function**
 2. Click **Identity**
 3. Under the System assigned heading, toggle the status to **On**
 4. Click **Save**
 5. Select **Yes**, to enable the System assigned managed identity
 6. Under Permissions, click **Azure role assignments**
 7. Click **+ Add role assignment**
 8. For Scope, select **Storage**
 9. Select your Subscription and storage account containing your Public Holiday data
10. For role, select **Contributor** _(Storage Table Data Reader is not enough)._
11. Click **Save**

##### Configure Requirements

The Azure function app will rely on a few PowerShell Modules; for the FunctionApp to load them, we need to add them to the requirements.psd1 file.

1. **Navigate** to your **Azure Function**
2. Click **App files**
3. Change the dropdown to **requirements.psd1**
4. In the hash array, comment out the #Az module line _(as this will load the entire Az Module set, which will cause an increased delay in the startup as those extra modules aren't needed)_, and add the following:

       # This file enables modules to be automatically managed by the Functions service.
       # See https://aka.ms/functionsmanageddependency for additional information.
       #
       @{
           # For latest supported version, go to 'https://www.powershellgallery.com/packages/Az'. 
           # To use the Az module in your function app, please uncomment the line below.
           #'Az' = '8.*'
           'Az.Accounts'  = '2.*'
           'Az.Storage'   = '4.*'
           'Az.Resources' = '2.*'
           'AzTable'      = '2.*'
       
       }
5. Click **Save**

##### Create Function PublicHolidays

Now that the Function App has been configured, it is time to create our Function.

1. **Navigate** to your **Azure Function**
2. Click **Functions**
3. Click **+ Create**
4. Change Development environment to **Develop in Portal**
5. Select Template, an **HTTP trigger**
6. For the New Function name, I will go with **GetPublicHoliday**
7. Change Authorization level to **Anonymous** _(if you aren't going to implement API Management, select Function and look at whitelisting your IP only, we will be locking it down to API Management later)_.
8. Click **Create**

![Create Azure Function App](/uploads/azureportal_createfunctionpublicholidays.png "Create Azure Function App")

1. Click **Code + Test**
2. Copy the following Code into the run.ps1 file, this code is core to the Function that will read the HTTP request and bring back a PowerShell object with the Public Holiday information as part of a GET request:

       <# The code above does the following, explained in English:
       1. Read the query parameters from the request.
       2. Read the body of the request.
       3. Write to the Azure Functions log stream.
       4. Interact with query parameters or the body of the request.
       5. Associate values to output bindings by calling 'Push-OutputBinding'. 
       https://luke.geek.nz/ #>
       
       using namespace System.Net
       
       # Input bindings are passed in via param block.
       param([Parameter(Mandatory = $true)]$Request, [Parameter(Mandatory = $true)]$TriggerMetadata)
       
       # Write to the Azure Functions log stream.
       Write-Host 'GetPublicHoliday function processed a request.'
       
       
       # Interact with query parameters or the body of the request.
       $date = $Request.Query.Date
       $country = $Request.Query.CountryCode
       
       $resourceGroupName = $env:PublicHolidayRESOURCEGROUPNAME
       $storageAccountName = $env:PublicHolidaySTORAGEACCNAME
       $tableName = 'PublicHolidays'
       
       $ClientIP = $Request.Headers."x-forwarded-for".Split(":")[0]
            
       try {   
           
         $storageAccount = Get-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName
         $storageContext = $storageAccount.Context
         $cloudTable = (Get-AzStorageTable -Name $tableName -Context $storageContext).CloudTable
         Import-Module AzTable   
             
         $Tables = Get-AzTableRow -table $cloudTable 
       
       
         ForEach ($table in $Tables)
         {
       
       
           [string]$Filter1 = [Microsoft.Azure.Cosmos.Table.TableQuery]::GenerateFilterCondition("Country", [Microsoft.Azure.Cosmos.Table.QueryComparisons]::Equal, $country)
           [string]$Filter2 = [Microsoft.Azure.Cosmos.Table.TableQuery]::GenerateFilterCondition("Date", [Microsoft.Azure.Cosmos.Table.QueryComparisons]::Equal, $date)
           [string]$finalFilter = [Microsoft.Azure.Cosmos.Table.TableQuery]::CombineFilters($Filter1, "and", $Filter2)     
           $object = Get-AzTableRow -table $cloudTable -CustomFilter $finalFilter
          
          
           $body = @()
            
           $System = New-Object -TypeName PSObject
           Add-Member -InputObject $System -MemberType NoteProperty -Name CountryCode -Value   $object.Country
           Add-Member -InputObject $System -MemberType NoteProperty -Name HolidayDate -Value   $object.Date
           Add-Member -InputObject $System -MemberType NoteProperty -Name HolidayYear -Value   $object.Year
           Add-Member -InputObject $System -MemberType NoteProperty -Name HolidayName -Value   $object.Name
           Add-Member -InputObject $System -MemberType NoteProperty -Name HolidayType -Value   $object.Type
           Add-Member -InputObject $System -MemberType NoteProperty -Name Comments -Value      $object.Comments
           Add-Member -InputObject $System -MemberType NoteProperty -Name RequestedIP -Value   $ClientIP
       
           $body += $System
           $System = New-Object -TypeName PSObject
            
           $status = [Net.HttpStatusCode]::OK
       
         }
         
       
       }
       catch {
         $body = "Failure connecting to table for state data, $_"
         $status = [Net.HttpStatusCode]::BadRequest
       }
       #$body =  $TriggerMetadata
       
       
       # Associate values to output bindings by calling Push-OutputBinding'
       Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
           StatusCode = $status
           Body       = $body
         }
       )
3. Click **Save**

##### Test Function - PublicHolidays

Before proceeding with the next step, it's time to test the function.

1. **Navigate** to your **Azure Function**
2. Click **Functions**
3. Click **GetPublicHoliday**
4. Click **Code + Test**
5. Click **Test/Run**
6. Change HTTP method to **Get**
7. Under Query, add Country value and Date value.

Note: Make sure the date and country formats match what is in the Azure storage account.

You can also Invoke the function app directly with PowerShell, with the Date and Country as Parameters at the end:

    Invoke-RestMethod -URI "https://func-nzpublicholidays-prd-ae.azurewebsites.net/api/GetPublicHoliday?Date=25-12-2023&CountryCode=NZ"

![Test Public Holiday API](/uploads/testpublicholidayapi.gif "Test Public Holiday API")

Congratulations! You have now created a Public Holiday API that you can call for automation! You can lock down the Function App to only certain IPs or proceed to configure Azure API Management.

##### Configure Azure API Management

Now that the Function App responds to requests, we can expose the HTTP endpoint through [Azure API Management](https://learn.microsoft.com/en-us/azure/azure-functions/functions-openapi-definition?WT.mc_id=AZ-MVP-5004796 "Expose serverless APIs from HTTP endpoints using Azure API Management"). Azure API Management will give greater flexibility and security over API endpoints, particularly when dealing with more than one API. Azure API Management also offers inbuilt shared cache functionality and integration into [Azure Cache for Redis](https://azure.microsoft.com/en-us/services/cache/?WT.mc_id=AZ-MVP-5004796 " Azure Cache for Redis®2").

1. Log in to the [**Microsoft Azure Portal**](https://portal.azure.com/#home "Microsoft Azure Portal")
2. **Navigate** to your **Azure Function**
3. On the Navigation blade, select **API Management**
4. Click **Create New**
5. Select your subscription, **Region**, and organisation **name**.
6. Select a [**Pricing Tier**](https://azure.microsoft.com/en-us/pricing/details/api-management/?WT.mc_id=AZ-MVP-5004796 " API Management pricing")
7. Click **Review + Create**
8. Click **Create**

![Create Azure API Management](/uploads/azureportal_createapimanagement.png)

1. Wait for 10 minutes to half an hour for provisioning to take place, and Azure API Management will be in an activating state.
2. Once API Management has been provisioned, you can **copy** the **Virtual IP (VIP)** addresses of API Management and **restrict** your **function** app to **only** allow **inbound** access from that **IP**.
3. Once you have done that, add the GetPublicHoliday function app into Azure API Management, add the paths to add a version, and then, using the subscription key, you run the following command to pull data.

    Invoke-RestMethod -uri "https://apims-nzpublicholidays-prd-ae.azure-api.net/v1/GetPublicHoliday?Date=4/05/2022&CountryCode=NZ&Ocp-Apim-Subscription-Key=$KEY"
