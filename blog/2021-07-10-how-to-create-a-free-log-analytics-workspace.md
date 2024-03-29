---
title: How to create a Free Azure Log Analytics Workspace using PowerShell
authors: [Luke]
tags:
  - Azure
date: 2021-07-10 00:00:00 +1300
toc: false
header:
  teaser: "/uploads/log_analytics_free.png"

---
When you create a Log Analytics workspace using the Azure Portal, you only get the Pricing or 'Pay-as-you-go' tiers to select.

You used to create a 'Free' tier using the Azure Portal; however, since 2018; they removed it with a change in plans and it became a legacy offering.

However, using PowerShell, you can still create a Log Analytics Free SKU!

> The Free pricing tier is a [legacy pricing tier](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/cost-logs?WT.mc_id=AZ-MVP-5004796#legacy-pricing-tiers) that is available for trying Azure Log Analytics. It has a data cap of 500 MB/day and only 7 days of data retention, so it is intended only for testing and is not to be used for production deployments.

You can change a Free Tier Log Analytics workspace to a Pay-as-you-go or commitment tier later.

You cannot change a Log Analytics workspace created on a higher tier back to Free, even using PowerShell, due to [adjustments](https://azure.microsoft.com/en-us/blog/introducing-a-new-way-to-purchase-azure-monitoring-services/?WT.mc_id=AZ-MVP-5004796 "Introducing a new way to purchase Azure monitoring services") in 2018 around the Log Analytics billing and plans.

![Azure Log Analytics - Free](/uploads/log_analytics_free.png)

## Create a 'Free Tier' Log Analytics using PowerShell

Change the script's variables below to suit your environment, connect to Azure and run the script to create your Log Analytics workspace.

Note: I tested this script on an MSDN subscription, which I've had for a few years and a recent one created a few months back _(2021)_, but there may be limitations on other subscription types that I haven't tested _- see blurb below the script_.

    #Connect to Azure
    Connect-AzAccount
    
    #Set Variables
    $ResourceGroup = 'aad_mgmt'
    $Location = 'australiaeast'
    $LogAnalyticsName = 'la-free'
    $SKU = 'Free'
    
    #Creates Log Analytics Workspace
    New-AzOperationalInsightsWorkspace -Location $Location -Name $LogAnalyticsName -Sku $SKU -ResourceGroupName $ResourceGroup

> If you get an error: Error Message: Pricing tier doesn't match the subscription's billing model. Read [http://aka.ms/PricingTierWarning](http://aka.ms/PricingTierWarning "http://aka.ms/PricingTierWarning?WT.mc_id=AZ-MVP-5004796#moving-to-the-new-pricing-model") for more details, unfortunately it means that your Subscription is under a different Billing model, and may have been created recently are you are unable to use the 'Free' tier, instead you may have to create it using 'standard' instead.

![Azure Log Analytics - Free](/uploads/log_analytics_free_tier.png)