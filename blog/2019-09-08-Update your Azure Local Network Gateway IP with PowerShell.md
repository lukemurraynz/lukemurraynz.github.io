---
date: 2019-09-08
title: Update your Azure Local Network Gateway IP with PowerShell
description: "One of the issues you face with setting up an Azure Site to Site VPN"
authors: [Luke]
tags:
  - Azure
  - PowerShell
header: 
  teaser: "images/iazure-marketplace-banner.png"
---
One of the issues you face with setting up an Azure [Site to Site VPN](https://learn.microsoft.com/en-us/azure/vpn-gateway/tutorial-site-to-site-portal?WT.mc_id=AZ-MVP-5004796) is making sure that your Azure Local Network Gateway always has your Public/On-premises IP.

This setup is fine when used in environments that have Static IPs (and yes if setting this up for a Business or Production, it is highly recommended to have a static IP!).

However, when used in environments like my home network or lab environments - which has a Dynamic IP that could change at any time it will cause connectivity issues if your IP changes and the Local Network Gateway is not updated.

The script below – intended to be run on as a Daily scheduled task, will find
your Public IP and connect to Azure and if needed – will update the IP of your
Local Network Gateway.

Prerequisites:

* [Az PowerShell Module](https://learn.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-7.5.0&WT.mc_id=AZ-MVP-5004796)
* [Azure Service Principal](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal?WT.mc_id=AZ-MVP-5004796) (with Contributor rights to the Azure Local Network Gateway)

Once you have the Azure Service Principal and Az Module installed, you need to
edit the following variables to suit your environment:

* $ResourceGroup = 'RESOURCE GROUP OF LOCAL NETWORK GATEWAY'
* $LocalNetworkGateway = ‘NAME OF AZURE LOCAL NETWORK GATEWAY’
* $azureAplicationId =’AZURE AD APPLICATION ID’
* $azureTenantId= ‘AZURE AD TENANCY/DIRECTORY ID’
* $azureAPI = ‘AZURE AD APPLICATION API/CLIENT SECRET’

```powershell title="Update-LocalNetGatewayIP.ps1"

#requires -Version 3.0 -Modules Az.Network
<#
      .SYNOPSIS
      Custom script to update your Azure Local Network Gateway with your Public IP
      .DESCRIPTION
      Updates the Azure Local Network Gateway with your Public IP
      Version: 1.0
      Author:  Luke Murray (Luke.Geek.NZ)
      If no Public IP parameter is set, it will automatically grab the Public IP of the computer running it and set it.
      The intention of this script is to run as as a scheduled task on your network, which connects to Azure and updates. Intended for Homelabs and scenarios which have Dynamic IPs.

  #>
#---------------------------------------------------------[Initialisations]--------------------------------------------------------
  
$ErrorActionPreference = 'Stop'

[Object]$PublicIP = (Invoke-WebRequest -Uri 'http://ifconfig.me/ip').Content 
[string]$ResourceGroup = 'z_Network'
[string]$LocalNetworkGateway = 'Prod-SiteToSite-VLAN-LNGateway'

## Use the application ID as the username, and the secret as password
$azureAplicationId ="Azure AD Application Id"
$azureTenantId= "Your Tenant Id"
$azureAPI = "Your API Key"
$azurePassword = ConvertTo-SecureString "$azureAPI" -AsPlainText -Force
$psCred = New-Object System.Management.Automation.PSCredential($azureAplicationId , $azurePassword)
Connect-AzAccount -Credential $psCred -TenantId $azureTenantId  -ServicePrincipal 

<#

Before adding the Azure Service Principal in and testing as a Scheduled Task, it is recommended that you just test the script first by connecting manually using:

Connect-AzAccount

 #>
  
#-----------------------------------------------------------[Execution]------------------------------------------------------------  

 
  
$a = Get-AzLocalNetworkGateway -ResourceGroupName $ResourceGroup -Name $LocalNetworkGateway
$GatewayIP = $a.GatewayIpAddress
 

If ($PublicIP -ne $GatewayIP) {

    $a.GatewayIpAddress = $PublicIP
    Set-AzLocalNetworkGateway -LocalNetworkGateway $a

}
  
Else {

   $null
    
}

```

_Note: Script is also hosted on my Github repository. Feel free to clone/recommend improvements or fork._
