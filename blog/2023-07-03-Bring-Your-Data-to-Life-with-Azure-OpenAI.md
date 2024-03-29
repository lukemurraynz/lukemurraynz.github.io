---
title: Bring Your Data to Life with Azure OpenAI
authors: [Luke]
tags:
  - Azure
toc: true
header:
  teaser: /images/posts/Header-BringYourDatatoLifewithAzureOpenAI.gif
date: '2023-07-04 15:15:00 +1300'
slug: azure/Bring-Your-Data-to-Life-with-Azure-OpenAI
---

Today, we will look at using Azure OpenAI and 'Bring Your Data' to allow recent documentation to be referenced and bring life (and relevance) to your data.

![Bring Your Data to Life with Azure OpenAI](/images/posts/Header-BringYourDatatoLifewithAzureOpenAI.gif "Bring Your Data to Life with Azure OpenAI")

The example we are going to use today is the Microsoft Learn documentation for [Microsoft Azure](https://learn.microsoft.com/azure/?product=popular&WT.mc_id=AZ-MVP-5004796).

Our scenario is this:

* We would like to use ChatGPT functionality to query up-to-date information on Microsoft Azure; in this example, we will look for information on Azure Elastic SAN (which was added in late 2022).

When querying ChatGPT for Azure Elastic SAN, we get the following:

![ChatGPT - Azure Elastic SAN Query](/images/posts/ChatGPT_Query_AzureElasticSAN.png "ChatGPT - Azure Elastic SAN Query")

Just like the prompt states, ChatGPT only has data up to September 2021 and isn't aware of Elastic SAN *(or any other changes/updates or new (or retired) services after this date)*.

So let us use the Azure OpenAI and bring in outside data [(ground data)](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/chatgpt?pivots=programming-language-chat-completions&WT.mc_id=AZ-MVP-5004796#using-data-for-grounding), in this case, the Azure document library, to overlay on top of the GPT models, giving the illusion the model is aware of the data.

To do this, we will leverage native '[Bring Your Own Data](https://learn.microsoft.com/azure/cognitive-services/openai/use-your-data-quickstart?tabs=command-line&pivots=programming-language-studio&WT.mc_id=AZ-MVP-5004796)' functionality, now in Azure OpenAI - **this is in Public Preview as of 04/07/2023**.

**To be clear, I don't expect you to start downloading from GitHub; this is just an example I have used to add your data. The ability to bring in updated data on Azure, specifically, will be solved by [Plugins](https://techcommunity.microsoft.com/t5/ai-cognitive-services-blog/generative-ai-for-developers-exploring-new-tools-and-apis-in/ba-p/3817003?WT.mc_id=AZ-MVP-5004796), such as Bing Search.**

To do this, we will need to provision a few Microsoft Azure services, such as:

1. [Azure Storage Account](https://learn.microsoft.com/azure/storage/common/storage-account-overview?WT.mc_id=AZ-MVP-5004796) *(this will hold the Azure document library (markdown files) in a blob container)*
1. [Cognitive Search](https://learn.microsoft.com/azure/search/search-what-is-azure-search?WT.mc_id=AZ-MVP-5004796) *(this search functionality, is the glue that will hold this solution together, by breaking down and indexing the documents in the Azure blob store)*
1. [Azure OpenAI](https://learn.microsoft.com/azure/cognitive-services/openai/overview?WT.mc_id=AZ-MVP-5004796) *(to do this, we will need GPT3.5 turbo or GPT4 models deployed)*
1. Optional - [Azure Web App](https://learn.microsoft.com/azure/app-service/overview?WT.mc_id=AZ-MVP-5004796) *(this can be created by the Azure OpenAI service, to give users access to your custom data)*

*[Make sure you have Azure OpenAI approved for your subscription](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/use-your-data-quickstart?tabs=command-line&pivots=programming-language-studio&WT.mc_id=AZ-MVP-5004796#prerequisites)*

We will use the following tools to provision and configure our services:

1. Azure Portal
1. PowerShell [(Az Modules)](https://learn.microsoft.com/powershell/azure/install-azure-powershell?WT.mc_id=AZ-MVP-5004796)
1. [AzCopy](https://learn.microsoft.com/azure/storage/common/storage-use-azcopy-v10?WT.mc_id=AZ-MVP-5004796)

### Download Azure Documents

First, we will need the Azure documents to add to our blob storage.

The Microsoft Learn documentation is open-sourced and constantly updated using a git repository hosted on GitHub. We will download and extract the document repository locally *(roughly 6 GB)*. To do this, we will use a PowerShell script:

         $gitRepoUrl = "https://github.com/MicrosoftDocs/azure-docs"
         $localPath = "C:\temp\azuredocs"
         $zipPath = "C:\temp\azurdocs.zip"
         #Download the Git repository and extract
         Invoke-WebRequest -Uri "$gitRepoUrl/archive/master.zip" -OutFile $zipPath
         Expand-Archive -Path $zipPath -DestinationPath $localPath

### Create Azure Storage Account

Now that we have a copy of the Azure document repository, it's time to create an Azure Storage account to copy the data into. To create this storage account, we will use PowerShell.

         # Login to Azure
         Connect-AzAccount
         # Set variables
         $resourceGroupName = "azuredocs-ai-rg"
         $location = "eastus"
         $uniqueId = [guid]::NewGuid().ToString().Substring(0,4)
         $storageAccountName = "myaistgacc$uniqueId"
         $containerName = "azuredocs"
         # Create a new resource group
         New-AzResourceGroup -Name $resourceGroupName -Location $location
         # Create a new storage account
         New-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName -Location $location -SkuName Standard_LRS -AllowBlobPublicAccess $false
         # Create a new blob container
         New-AzStorageContainer -Name $containerName -Context (New-AzStorageContext -StorageAccountName $storageAccountName -StorageAccountKey (Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName).Value[0])

We have created our Resource Group and Storage account to hold our Azure documentation.

### Upload Microsoft Learn documentation to an Azure blob container

Now that we have the Azure docs repo downloaded and extracted and an Azure Storage account to hold the documents, it's time to use AzCopy to copy the documentation to the Azure storage account.
We will use PowerShell to create a SAS token (open for a day) and use that with AzCopy to copy the Azure repo into our newly created container.

         # Set variables
         $resourceGroupName = "azuredocs-ai-rg"
         $storageAccountName = "myaistgacc958b"
         $containerName = "azuredocs"
         $storageAccountKey = (Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName).Value[0]
         $localPath = "C:\Temp\azuredocs\azure-docs-main"
         $azCopyPath = "C:\tools\azcopy_windows_amd64_10.19.0\AzCopy.exe"
         # Construct SAS URL for destination container
         $sasToken = (New-AzStorageContainerSASToken -Name $containerName -Context (New-AzStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey) -Permission rwdl -ExpiryTime (Get-Date).AddDays(1)).TrimStart("?")
         $destinationUrl = "https://$storageAccountName.blob.core.windows.net/$containerName/?$sasToken"
         # Run AzCopy command as command line
         $command = "& `"$azCopyPath`" copy `"$localPath`" `"$destinationUrl`" --recursive=true"
         Invoke-Expression $command

*Note: I took roughly 6 minutes to copy the Azure docs repo from my local computer (in New Zealand) into a blob storage account in East US, so roughly a gigabyte a minute.*

![Azure Storage Account - Microsoft Learn Docs](/images/posts/AzureStorage_AzureDocs_UploadedAzCopy.png "Azure Storage Account - Microsoft Learn Docs")

### Create Cognitive Search

Now that we have our Azure Blob storage accounts, it's time to create our Cognitive Search.
We will need to create a Cognitive Search, with an SKU of Standard, to support the 6GBs of Azure documents that must be indexed. Please check your costs; this is roughly NZ$377.96 a month to run; you can reduce this cost by limiting the amount of data you need to index (i.e., only certain documents, not an entire large repository of markdown files). Make sure you refer to the [Pricing Calculator](https://azure.microsoft.com/pricing/details/search/?WT.mc_id=AZ-MVP-5004796).

         # Set variables
         $resourceGroupName = "azuredocs-ai-rg"
         $searchServiceName = "azuredocssearchservice" #Cognitive Service name needs to be lowercase.
         # Create a search service
         Install-Module Az.Search
         $searchService = New-AzSearchService -ResourceGroupName $resourceGroupName -Name $searchServiceName -Location "eastus" -Sku Standard

Now that the cognitive search has been created, we need to create the index, and indexers, which will index our Azure documents to be used by Azure OpenAI by creating the index and linking it to the Azuredocs blob container, we created earlier.

*Note: There is no PowerShell cmdlet support for Azure Cognitive Search indexes; you can create using the [RestAPI](https://learn.microsoft.com/azure/search/search-get-started-powershell?WT.mc_id=AZ-MVP-5004796) - but we will do this in the Azure Portal as part of the next step.*

### Create Azure Cognitive Search Index

It's time to time to create the Cognitive Search Index, an indexer that will index the content.

We will move away from PowerShell and into the Microsoft Azure Portal to do this.

1. Navigate to the [Microsoft Azure Portal](https://portal.azure.com/#home)
1. In the top center search bar, type in Cognitive Search
1. Click on [Cognitive Search](https://portal.azure.com/#view/Microsoft_Azure_ProjectOxford/AppliedAIHub/~/CognitiveSearch)
1. Click on your newly created Cognitive Search
![Azure Portal - Cognitive Search](/images/posts/AzurePortal_CognitiveSearch_Resource.png "Azure Portal - Cognitive Search")
1. Select Import Data
1. Select Azure Blob Storage
![Azure Portal - Cognitive Search - Add Azure Blob Storage](/images/posts/AzurePortal_CognitiveSearch_AddDataStorage.png "Azure Portal - Cognitive Search")
1. Type in your data source name *(i.e., azuredocs)*
1. For the Connection string, select Choose an existing connection
1. Select your Azure Storage account and a container containing the Azure document repository uploaded earlier.
1. Click Select
![Azure Portal - Cognitive Search - Add Azure Blob Storage](/images/posts/AzurePortal_CognitiveSearch_ConnectBlobStorage.png "Azure Portal - Cognitive Search - Add Azure Blob Storage")
1. Click Next: Add cognitive skills (Optional)
1. Here, you can Enrich your data, such as enabling OCR (extracting text from images automatically) or extracting people's names, and translating text from one language to another; these enrichments are billed separately, and we won't be using any enrichments so we will select Skip to: Customize target index.
1. Here is the index mapping that was done by Cognitive Search automatically by scanning the schema of the documents. You can bring in additional data about your documents if you want, but I am happy with the defaults, so I click: Next: Create an indexer
![Azure Portal - Cognitive Search - Search Index](/images/posts/AzurePortal_CognitiveSearch_SearchIndex.png "Azure Portal - Cognitive Search - Search Index")
1. The indexer is what is going to create your index, which will be referenced by Azure OpenAI later; you can schedule an indexer to run hourly, if new data is being added to the Azure blob container where your source files are sitting, for my purposes I am going leave the Schedule as: Once
1. Uncollapse Advanced Options and scroll down a bit
1. Here, we can select to only index certain files; for our purposes, we are going to exclude png files, the Azure document repository contains png images files that aren't able to be indexed (we aren't using OCR), so I am going to optimize the indexing time slightly by excluding them. You can also exclude gif/jpg image files.
![Azure Portal - Cognitive Search - Create Search Indexer](/images/posts/AzurePortal_CognitiveSearch_CreateIndexer.png "Azure Portal - Cognitive Search - Create Search Indexer")
1. Finally, hit Submit to start the indexing process. *This could take a while, depending on the amount of data*
1. Leave this running in the background and navigate to the Cognitive Search resource, Overview pane to see the status.
![Azure Portal - Cognitive Search - Indexer](/images/posts/AzurePortal_CognitiveSearch_OverviewIndexer.png.png "Azure Portal - Cognitive Search - Indexer")

*Note: You can also run the Import Data in Azure OpenAI Studio, which will trigger an index - but you need to keep your browser open and responsive. Depending on how much data you are indexing, doing it manually through this process could be preferred to avoid browser timeout. You also get more options around the index.*

### Create Azure OpenAI

Now that we have our base Azure resources, it's time to create Azure OpenAI.
Make sure your region and subscription have been approved for Azure OpenAI.

Run the following PowerShell cmdlets to create the Azure OpenAI service:

To create the Azure OpenAI service, we will be using the Azure Portal.

1. Navigate to the [Microsoft Azure Portal](https://portal.azure.com/#home)
1. In the top center search bar, type in Azure OpenAI
1. In the Cognitive Services, [Azure OpenAI](https://portal.azure.com/#view/Microsoft_Azure_ProjectOxford/CognitiveServicesHub/~/OpenAI) section, click + Create
1. Select your subscription, region, name, and pricing tier of your Azure OpenAI service (remember certain [models](https://learn.microsoft.com/azure/cognitive-services/openai/concepts/models?WT.mc_id=AZ-MVP-5004796#model-summary-table-and-region-availability) are only available in specific regions - we need GPT 3.5+), then select Next
![Azure OpenAI - Create Resource](/images/posts/AzurePortal_AzureOpenAI_Create.png "Azure OpenAI - Create Resource")
1. Update your Network Configuration; for this demo, we will select 'All Networks' - but the best practice is to restrict it. Click Next
![Azure OpenAI - Create Resource](/images/posts/AzurePortal_AzureOpenAI_CreateSelectNetwork.png "Azure OpenAI - Create Resource")
1. If you have any Tags, enter them, then click Next
1. The Azure platform will now validate your deployment (an example is ensuring that the Azure OpenAI has a unique name). Review the configuration, then click Create to create your resource.
![Azure OpenAI - Create Resource](/images/posts/AzurePortal_AzureOpenAI_CreateReview.png "Azure OpenAI - Create Resource")

Now that the Azure OpenAI service has been created, you should now have the following:

* An Azure OpenAI service
* A Storage account
* A Cognitive Search service

![Azure OpenAI - RAG Deployed Resources](/images/posts/AzurePortal_AzureOpenAI_BYOD_Resources.png "Azure OpenAI - RAG Deployed Resources")

### Deploy Model

Now that we have our Azure OpenAI instance, it's time to deploy our Chat model.

1. Navigate to the [Microsoft Azure Portal](https://portal.azure.com/#home)
1. In the top center search bar, type in Azure OpenAI
1. Open your Azure OpenAI instance to the Overview page, and click: Go to Azure OpenAI Studio
1. Click on Models, and verify that you have gpt models *(ie, gpt-36-turbo, or gpt-4)*. If you don't, then make sure you have been [onboarded](https://azure.microsoft.com/en-us/products/cognitive-services/openai-service?WT.mc_id=AZ-MVP-5004796).
1. Once verified, click on Deployments
1. Click on + Create new deployment
1. Select your model (I am going to go with gpt-35-turbo), type in a deployment name, and then click Create
1. Once deployment has been completed, you may have to wait up to 5 minutes for the Chat API to be aware of your new deployment.

![Azure OpenAI - Deploy Model](/images/posts/Create_AzureOpenAI_GPT3.5_Deployment.gif "Azure OpenAI - Deploy Model")

### Run Chat against your data

Finally, it's time to query and work with our Azure documents.

We can do this using the Chat Playground, a feature of Azure OpenAI that allows us to work with our Chat models and adjust [prompts](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/concepts/advanced-prompt-engineering?pivots=programming-language-chat-completions&WT.mc_id=AZ-MVP-5004796).

We will not change the System Prompt (although to get the most out of your own data, I recommend giving it ago); the System Prompt will remain as: You are an AI assistant that helps people find information.

1. Navigate to the [Microsoft Azure Portal](https://portal.azure.com/#home)
1. In the top center search bar, type in Azure OpenAI
1. Open your Azure OpenAI instance to the Overview page, and click: Go to Azure OpenAI Studio
1. Click Chat
1. Click Add your data (preview) - if this doesn't show, ensure you have deployed a GPT model as part of the previous steps.
1. Click on + Add a data source
1. Select the dropdown list in the Select data source pane and select Azure Cognitive Search
1. Select your Cognitive Search service, created earlier
1. Select your Index
1. Check, I acknowledge that connecting to an Azure Cognitive Search account will incur usage to my account. [View Pricing](https://azure.microsoft.com/en-us/pricing/details/search/?WT.mc_id=AZ-MVP-5004796)
1. Click Next
1. It should bring in the index metadata; for example - our content data is mapped to content - so I will leave this as is; click Next
1. I am not utilizing Semantic search, so I click Next
1. Finally, review my settings and click Save and Close
1. Now we can verify our own data is getting checked by leaving the: Limit responses to your own data content checked
1. Then, in the Chat session, in the User message, I type: Tell me about Azure Elastic SAN?
1. It will now reference the Cognitive Search and bring in the data from the index, including references to the location where it found the data!

![Azure OpenAI - Chat Playground](/images/posts/Query_AzureOpenAI_ChatPlayground_AzureDocs.gif "Azure OpenAI -Chat Playground")

### Optional - Deploy to an Azure WebApp

Interacting with our data in the Chat playground can be an enlightening experience, but we can go a step further and leverage the native tools to a chat interface - straight to an Azure web app.

To do this, we need to navigate back to the Chat playground, ensure you have added your own cognitive search, and can successfully retrieve data from your index.

1. Click on Deploy to
1. Select A new web app...
1. If you have an existing WebApp, you can update it with an updated System Message or Search Index from the Chat playground settings, but we will: Create a new web app
1. Enter a suitable name (i.e., AI-WebApp-Tst - this needs to be unique)
1. Select the Subscription and Resource Group and location to deploy to. I had issues accessing my custom data, when deployed to Australia East (as AI services are in East US), so I will deploy in the same region as my OpenAI and Cognitive Search service - i.e., East US.
1. Specify a plan (i.e., Standard (S1))
1. Click Deploy

![Azure OpenAI - Deploy](/images/posts/Deploy_AzureOpenAI_ChatPlayground_WebApp.gif "Azure OpenAI -Chat Playground")

Note: Deployment may take up to 10 minutes to deploy; you can navigate to the Resource Group you are deploying to, select Deployments, and monitor the deployment. Once deployed, it can take another 10 minutes for authentication to be configured.

Note: By default, the Azure WebApp is restricted to only be accessible by yourself; you can expand this out by adjusting the [authentication](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/use-your-data-quickstart?tabs=command-line&pivots=programming-language-studio&WT.mc_id=AZ-MVP-5004796#important-considerations).

Once it is deployed, you can access the Chat interface, directly from an Azure WebApp!

![Azure OpenAI - Run Azure WebApp](/images/posts/Run_AzureOpenAI_ChatPlayground_WebApp.gif "Azure OpenAI - Run Azure WebApp")

If you navigate to the WebApp resource in the Azure Portal, and look at the Configuration and Application Settings of your WebApp, you can see variables used as part of the deployment. You can adjust these, but be wary as it could break the WebApp, I would recommend redeploying/updating the WebApp for major changes, from Azure OpenAI studio.
![Azure OpenAI - App Service - App Settings](/images/posts/AzureOpenAI_AzureAppService_Deployment_AppSettings.png "Azure OpenAI - App Service - App Settings")
