---
date: 2021-05-08T12:00:00.000Z
title: Run PowerShell App Deployment Toolkit in Datto RMM
description: "The PowerShell App Deployment Toolkit \\\"PowerShell App Deployment Toolkit\\\" provides a set of functions to perform common ..."
authors: [Luke]
tags:
  - PowerShell
toc: false
header:
  teaser: images/powershell-blog-feature-banner.png

---
The [PowerShell App Deployment Toolkit](https://psappdeploytoolkit.com/ "PowerShell App Deployment Toolkit") provides a set of functions to perform common application deployment tasks and to interact with the user during deployment. It simplifies the complex scripting challenges of deploying applications in the enterprise, provides a consistent deployment experience and improves installation success rates.

![PowerShell App Deployment Toolkit](/uploads/powershell_app_deploymenttoolkit.png "PowerShell App Deployment Toolkit")

Although the PowerShell App Deployment Toolkit, makes application installation a lot more visible and gives your users more control over how and when the Application is installed,  due to some technical limitations, you can't run the PowerShell App Deployment Toolkit, directly from the Datto RMM package store.

This is a brief article, intended to help other people who may be using the App Deployment Toolkit with Datto RMM.

```powershell title="DattoRMMpowerShellAppDeploymentToolkitCommand.ps1"

#This is the name of the zip file in the component. Make sure that the PowerShell App Deployment Toolkit is zipped.
$ZipFile = "DesktopSOE.zip"
#This will create a folder called: C:\Temp (these folders can be changed to suit your requirements)
Mkdir c:\Temp -Force
#This will create a folder called: C:\Temp\DesktopSOE\ (these folders can be changed to suit your requirements)
Mkdir C:\Temp\DesktopSOE\ -Force
#This will then copy your PowerShellAppDeployment Toolkit to a folder, outside of the CentraStage Packagestore location. 
Copy-Item -Path "$ZipFile" -Destination "C:\Temp\$ZipFile" -Recurse
$DestinationFolder = $ZipFile.Split(".")[0]
#This will then extract your PowerShell App Deployment Toolkit and run it.
Expand-Archive -Path "c:\temp\$ZipFile" -DestinationPath "C:\Temp\DesktopSOE\" -Force
Invoke-Command { c:\temp\DesktopSOE\Deploy-Application.exe }

```

Note: You may also need to navigate to: AppDeployToolkitConfig.xml, and change the: <Toolkit_RequireAdmin> attribute to False, to avoid issues with UAC (User Access Control).

I also ran my component as:

* Only Run when the user is logged in
* Only run if User has Administrator rights
