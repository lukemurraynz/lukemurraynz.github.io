---
title: Using PowerShell to start the DFS Namespace service
description: "Distributed File System DFS has some service dependencies - so if those don't start the DFS Namespace service will also not start."
tags:
  - PowerShell
date: 2018-06-11 00:00:00 +1300
header:
  teaser: "images/powershell-blog-feature-banner.png"
---
Distributed File System (DFS) has some service dependencies - so if those don't start the DFS Namespace service will also not start.

<img class="alignnone" src="https://i1.wp.com/luke.geek.nz/wp-content/uploads/2016/12/121316_0835_DFSNamespac1.png?resize=584%2C112" alt="DFS Namespace" width="584" height="112" data-recalc-dims="1" />

The dependencies are:

 * Remote Registry
 * Security Accounts Manager
 * Server
 * Workstation

I have seen the Remote Registry service become the culprit of the DFS-N service not starting.

In my experience, this had been caused by antivirus software changing the Remote Registry service to Disabled start-up type so when the DFS-N server restarts, one of the dependency services:

Remote Registry does not start so if you have issues with the DFS-N service not starting – check the Remote Registry Start-up type is configured to Automatic and click Start to confirm there are no errors and try starting the DFS-N service again.

*Note: RemoteRegistry – although it is Automatic, will only Start when it is being used so don't be alarmed if it is in a 'Stopped' state.*
  
<img class="alignnone" src="https://i2.wp.com/luke.geek.nz/wp-content/uploads/2016/12/121316_0835_DFSNamespac2.png?resize=377%2C267" alt="Remote Registry" width="377" height="267" data-recalc-dims="1" />

I have also created a PowerShell script to do some general checking for the DFS namespace service – which sets the Remote Registry service to Automatic startup then gets the other DFS dependency services and changes the startup type to Automatic and starts them and finally tries to start the DFS Namespace service.

```powershell title="Start-DFS.ps1"

#requires -Version 2.0

<#
.SYNOPSIS
  Starts the DFS service

.DESCRIPTION
  Changes the Remote Registry service to Automatic start-up and Start the DFS NameSpace service dependencies, then start the DFS namespace service. 
  If the service does not start, it will retrieve the last 10 event log items from the DFS log.

.NOTES
  Version:        1.0
  Author:         Luke Murray (Luke.Geek.NZ)
  Creation Date:  20/03/17
  Purpose/Change: 
  20/03/17 - Initial script development
  11/06/18 - Updated script formatting

.EXAMPLE
  ./Start-DFS-Service.ps1
  
#>

#---------------------------------------------------------[Script Parameters]------------------------------------------------------

$ServiceName = 'DFS'
$ErrorActionPreference = 'Stop'

#-----------------------------------------------------------[Execution]------------------------------------------------------------

Try 
{
  Get-Service -Name RemoteRegistry | Set-Service -StartupType Automatic
}
Catch 
{
  Write-Verbose -Message 'There is an issue changing the Remote Registry Service to Automatic Startup Type' -Verbose
}
Try
{
  $ServiceDependency = Get-Service -Name $ServiceName -DependentServices
  $ServiceDependency | Set-Service -StartupType Automatic | Start-Service
  Write-Verbose -Message "$ServiceName dependencies have started. Will now try starting the $ServiceName service.." -Verbose
}
catch [Microsoft.PowerShell.Commands.ServiceCommandException]
{
  [Management.Automation.ErrorRecord]$e = $_

  $info = New-Object -TypeName PSObject -Property @{
    Exception = $e.Exception.Message
    Reason    = $e.CategoryInfo.Reason
    Target    = $e.CategoryInfo.TargetName
    Line      = $e.InvocationInfo.ScriptLineNumber
    Column    = $e.InvocationInfo.OffsetInLine
  }
  Write-Verbose -Message 'Opps! There was an error:' -Verbose
  $info
}
Catch 
{
  Write-Verbose -Message "There was an issue starting $ServiceName dependencies" -Verbose
}

try
{
  Try
  {
    Start-Service -Name $ServiceName
    Write-Verbose -Message "The $ServiceName service has started." -Verbose
  }
  Catch 
  {
    Get-WinEvent -LogName Microsoft-Windows-DFSN-Server/Operational | Select-Object -Last 10
  }
}

catch
{
  [Management.Automation.ErrorRecord]$e = $_

  $info = New-Object -TypeName PSObject -Property @{
    Exception = $e.Exception.Message
    Reason    = $e.CategoryInfo.Reason
    Target    = $e.CategoryInfo.TargetName
    Line      = $e.InvocationInfo.ScriptLineNumber
    Column    = $e.InvocationInfo.OffsetInLine
  }
  Write-Verbose -Message 'Opps! There was an error:' -Verbose
  $info
}
```

*Note: Script is also hosted on my Github repository. Feel free to
clone/recommend improvements or fork.*
