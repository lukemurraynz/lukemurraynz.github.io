---
title: Changing the default Management Group in Azure
authors: [Luke]
tags:
  - Azure
toc: false
header:
  teaser: /images/posts/ChangeDefaultManagementGroup.png
date: '2023-07-17 00:00:00 +1300'
slug: azure/Changing-default-management-group-for-azure
---

By default, when a [Management Group](https://learn.microsoft.com/azure/governance/management-groups/overview?WT.mc_id=AZ-MVP-5004796) gets created, it goes under the Root Management Group, the same is true for [Subscriptions](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/organize-subscriptions?WT.mc_id=AZ-MVP-5004796).

This works fine, when you have a simple Microsoft Azure environment, but as soon as you start expanding into areas such as [Subscription vending](https://learn.microsoft.com/azure/architecture/landing-zones/subscription-vending?WT.mc_id=AZ-MVP-5004796) or limited access to who can see the Root Management Group and start to look into Visual Studio Enterprise subscriptions, you may want to consider moving new subscriptions, under its own Management Group, away from any policies or RBAC controls, essentially into a Management Group that acts as a shopping cart, to then be picked up and moved later.

If we refer to a [recommendation](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-management-groups?WT.mc_id=AZ-MVP-5004796#management-group-recommendations) on the Microsoft Cloud Adoption Framework:

> Configure a default, dedicated management group for new subscriptions. This group ensures that no subscriptions are placed under the root management group. This group is especially important if there are users eligible for Microsoft Developer Network (MSDN) or Visual Studio benefits and subscriptions. A good candidate for this type of management group is a [sandbox](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/considerations/sandbox-environments?WT.mc_id=AZ-MVP-5004796) management group.

So, how can we change the default Management Group, that new Subscriptions go into?

Lets take a look at the different ways we could use to update the default management group, that new subscriptions go into.

### Configure using Azure Portal

1. Use the search bar to search for and select 'Management groups'.
1. On the root management group, select details next to the name of the management group.
1. Under Settings, select Hierarchy settings.
1. Select the Change default management group button.

### Configuring using Bicep

    resource symbolicname 'Microsoft.Management/managementGroups/settings@2021-04-01' = {
    name: 'default'
    parent: resourceSymbolicName
    properties: {
    defaultManagementGroup: 'string'
    requireAuthorizationForGroupCreation: bool
    }
    }

Reference: [Microsoft.Management managementGroups/settings](https://learn.microsoft.com/en-us/azure/templates/microsoft.management/managementgroups/settings?pivots=deployment-language-bicep&WT.mc_id=AZ-MVP-5004796)

### Configure using REST API using PowerShell

    $root_management_group_id = "Enter the ID of root management group"
    $default_management_group_id = "Enter the ID of default management group (or use the same ID of the root management group)"
    $body = '{
     "properties": {
          "defaultManagementGroup": "/providers/Microsoft.Management/managementGroups/' + $default_management_group_id + '",
          "requireAuthorizationForGroupCreation": true
     }
    }'
    $token = (Get-AzAccessToken).Token
    $headers = @{"Authorization"= "Bearer $token"; "Content-Type"= "application/json"}
    $uri = "https://management.azure.com/providers/Microsoft.Management/managementGroups/$root_management_group_id/settings/default?api-version=2021-04-01"
    Invoke-RestMethod -Method PUT -Uri $uri -Headers $headers -Body $body

### Configure using Terraform

    resource "azurerm_management_group_subscription_association" "example" {
    management_group_id = data.azurerm_management_group.example.id
    subscription_id     = data.azurerm_subscription.example.id
    }

Note: Not quite the same, as configuring the default setting as above - but you can specify the Managament Group association for subscriptions using Terraform.