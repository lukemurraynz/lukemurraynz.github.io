---
title: Keep up to date with Azure changes using PowerShell
description: "Keeping up with what is happening with changes and previews in Microsoft Azure is difficult, change happens all the time - and being able to stay inform..."
authors: [Luke]
tags:
    - Misc
    - PowerShell
    - Azure
date: 2021-04-03 00:00:00 +1300
toc: true
header:
    teaser: "images/powershell-blog-feature-banner.png"
---
Keeping up with what is happening with changes and previews in Microsoft Azure is difficult, change happens all the time - and being able to stay informed on what is happening with the Azure ecosystem is half the battle, whether it is a new feature or security fix.

Microsoft publishes the latest updates on Azure Products and features to their Azure Updates blog: [https://azure.microsoft.com/en-us/updates/](https://azure.microsoft.com/en-us/updates/ "https://azure.microsoft.com/en-us/updates/?WT.mc_id=AZ-MVP-5004796")

So you can browse the website each week, or... monitor the RSS feeds. Sometimes this isn't enough, you may want to do something with this information such as:

* Create Alerts or Notifications to specific teams who may work with Azure SQL, or Azure Automation and not care about any other product.
* Not have to go to the website to keep up-to-date with what is happening, maybe your happy with it popping up in your PowerShell session each time you open it.
* Publish the information to Microsoft Teams channels to keep people informed.

I have created a basic PowerShell function, that will retrieve the latest updates from the Microsoft Azure Updates RSS Feed and turn it into a PowerShell object you can actually use to keep informed.

## The Script - Get-AzureBlogUpdates

The script is hosted on my Github repository. Feel free to clone/recommend improvements or fork, I can add parameter sets instead of relying on the PowerShell methods listed in the examples section - if you find this script useful:

```powershell title="Get-AzureBlogUpdates.ps1"

function Get-AzureBlogUpdates {
    <#
      .SYNOPSIS
      Retrieves the latest Updates of Azure, from the Azure Blog RSS feed.
      .DESCRIPTION
      Retrieves the latest Updates of Azure, from the Azure Blog RSS feed.
      .NOTES
      Version:        1.0
      Author:         Luke Murray (Luke.Geek.NZ) 
      Website: https://luke.geek.nz/keep-up-to-date-with-latest-changes-on-azure-using-powershell
      Creation Date:  03.04.21
      Purpose/Change: 
      03.04.21 - Intital script development
      .EXAMPLE
      Get-AzureBlogUpdate

  #>
  #Retrieving RSS Feed Content - as XML, then converting into PSObject
    $xml = [xml](Invoke-WebRequest -Uri 'https://azurecomcdn.azureedge.net/en-us/updates/feed/').content
    $Array = @()
    foreach ($y in $xml.rss.channel.selectnodes('//item'))
    {
        $PSObject = New-Object -TypeName PSObject
        $Date = [datetime]$y.pubdate
        $PSObject | Add-Member NoteProperty 'Title'  $y.title
        $PSObject | Add-Member NoteProperty 'Date' $Date
        $PSObject | Add-Member NoteProperty 'Category'  $y.category
        $PSObject | Add-Member NoteProperty 'Description'  $y.content.InnerText
        $PSObject | Add-Member NoteProperty 'Link'   $y.link
    
    
        $Array += $PSObject
    } 
    #Some article had multiple categories, to make it easier for reporting, joined the categories together and got rid of duplicates.

    $results = @()
    ForEach ($item in $Array) {
        $Category = Foreach ($title in $item.Title)
        {
            $results += [pscustomobject]@{
                'Title'          = $item.Title
                'Category'       = $item.Category -join ',' | Select-Object -Unique
                'Published Date' = $item.Date
                'Description'    = $item.Description
                'Link'           = $item.Link
            }
        }
    }
    $results
}

```

## Examples

    #Runs the actual Function:
    Get-AzureBlogUpdates

![Get-AzureBlogUpdates](/uploads/windowsterminal_5oqnizj8ko.png)

    #EXAMPLE - Gets Azure Blog Updates, that have been published in the last 7 days.
    $PublishedIntheLastDays = (Get-Date).AddDays(-7)
    Get-AzureBlogUpdates | Where-Object 'Published Date' -GT $PublishedIntheLastDays

![Get-AzureBlogUpdates](/uploads/windowsterminal_duphvuiqpz.png)

    #EXAMPLE - Gets all Azure Blog Updates, and displays it as a Table, organised by Category
    Get-AzureBlogUpdates | Sort-Object Category -Descending | Format-Table

![Get-AzureBlogUpdates](/uploads/windowsterminal_xrskcraov0.png)

    #EXAMPLE -Gets the latest 10 Azure Blog Articles
    Get-AzureBlogUpdates | Select -Last 10

![Get-AzureBlogUpdates - Select Last 10 Articles](/uploads/windowsterminal_bxxy0lnrjc.png "Get-AzureBlogUpdates - Select Last 10 Articles")

    #EXAMPLE - Gets the Azure Blog Update articles, where the title has Automation in it.
    Get-AzureBlogUpdates | Where-Object Title -match 'Automation'

![Get-AzureBlogUpdates - Title matches Automation](/uploads/windowsterminal_qitgwrqfm9.png "Get-AzureBlogUpdates - Title matches Automation")