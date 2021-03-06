---
title: A couple of useful DISM commands for WIM management for the IT Pro
permalink: /win/a-couple-of-useful-dism-commands-for-wim-management-for-the-it-pro-2/
categories:
  - Windows
---
As part of being an IT Engineer at my place of employment &#8211; I work with operating system deployment and management &#8211; part of this is using the Windows DISM toolset for adding packages or drivers directly into a Windows OS WIM or boot WIM.

Here are a few useful DISM commands I have gathered and use on a monthly basis with WIM management and updates.

<!--more-->


# <span id="Using_DISM_to_mount_a_WIM">Using DISM to mount a WIM</span>

When using DISM to mount a WIM – it mounts the WIM to a folder – similar to creating a virtual drive. So before you open up that Command Prompt – create a temporary mount directory first – _for example c:\temp\mnt_
  
_as I am using in my example.
  
_ 

  1. Open an elevated Command Prompt
  2. Type in: **dism.exe /Mount-WIM /WimFile:&#8221;C:\Temp\_OS.wim_&#8221; /index:1 /MountDir:&#8221;C:\Temp\mnt&#8221;** _(Replace – OS.wim with the name of your WIM image)_
  3. Your WIM should now successfully mounted in c:\temp\mnt

# <span id="Using_DISM_to_un-mount_a_WIM">Using DISM to un-mount a WIM</span>

Once you have finished modifying your WIM. You will need to unmount it, when unmounting the WIM with DISM you have 2 options, to unmount and discard any changes or to unmount and commit any changes you have made into the WIM.

## <span id="To_commit_your_changes">To commit your changes:</span>

  1. Open an elevated Command Prompt
  2. Type in: **dism.exe /Unmount-Image /MountDir:&#8221;C:\temp\mnt&#8221; /commit**

## <span id="To_discard_your_changes">To discard your changes:</span>

  1. Open an elevated Command Prompt
  2. Type in: **dism.exe /Unmount-Image /MountDir:&#8221;C:\temp\mnt&#8221; /discard**

# <span id="Using_DISM_to_add_drivers_recursively_to_a_WIM">Using DISM to add drivers recursively to a WIM</span>

Adding drivers into a WIM – either a boot image or OS WIM can be painful – however using DISM I can easily recursively add drivers that are in folders – even several levels deeper recursively and automatic. This allows me to add a full set or set of Windows drivers into a WIM.

  1. Open an elevated Command Prompt
  2. Type in: **dism.exe /image:&#8221;c:\temp\mnt&#8221; /Add-Driver /Driver:&#8221;C:\temp\driversfolder&#8221; /Recurse**

# <span id="Using_DISM_to_add_packages_to_a_WIM">Using DISM to add packages to a WIM</span>

Adding Windows packages (MSU/CAB files) into a boot or OS WIM is easy with DISM. I used this method to add the IE11 MSU into the Windows 7 x64 WIM – _as is the example I am using here:_

  1. Open an elevated Command Prompt
  2. Type in: **dism.exe /image:&#8221;C:\temp\mnt&#8221; /Add-Package /PackagePath:&#8221;C:\temp\IE11&#8243;**

# <span id="Using_DISM_to_remove_superseded_Windows_Updates_and_unused_system_files_from_Windows_online_for_Windows_8_and_Windows_Server_2012">Using DISM to remove superseded Windows Updates and unused system files from Windows online for Windows 8 and Windows Server 2012</span>

One of the useful features of Windows – is a feature called Disk Cleanup – this utility allows you to remove superseded Windows Updates and Windows update installer and system file remnants. Windows servers usually do not have this installed – you can do this using DISM.

  1. Open an elevated Command Prompt
  2. Type in: **dism.exe /Online /Cleanup-Image /StartComponentCleanup**

# <span id="Using_DISM_to_remove_superseded_Windows_Updates_and_unused_system_files_from_a_Windows_WIM_offline">Using DISM to remove superseded Windows Updates and unused system files from a Windows WIM offline</span>

Removing superseded Windows Updates and unused/invalid system files from a WIM helps reducing the OS deployment time by cleaning up the file size of the WIM and helps create a clean OS environment for new machines.

  1. Open an elevated Command Prompt
  2. Type in: **dism.exe /Image: &#8220;C:\temp\mnt&#8221; /Cleanup-Image /StartComponentCleanup**

# <span id="Using_DISM_to_install_NET_Framework_35_on_Windows_Server_20122012_R2">Using DISM to install .NET Framework 3.5 on Windows Server 2012/2012 R2</span>

Some applications require .NET 3.5 which is not installed on Windows Server 2012 by default. You can install this feature using DISM and the Windows server DVD/ISO online. Please note that &#8220;D:&#8221; is the CD/DVD drive letter in this example and may need to be changed if this does not match your environment.

  1. Open an elevated Command Prompt
  2. Type in: **dism.exe /online /enable-feature /featurename:NetFX3 /all /Source:d:\sources\sxs /LimitAccess**

# <span id="Managing_DISM_from_a_GUI_frontend">Managing DISM from a GUI frontend</span>

Thankfully – for all those fans of point and click (_even I prefer to use this on occasion)_ – a few people have written a GUI frontend for DISM. Allowing you to do all the things mentioned above from a point and click interface.

  1. The file can be downloaded from: <https://dismgui.codeplex.com/> and is free of charge. This is a standalone application that doesn&#8217;t require an install and has a small footprint _(current file size as of this article is 122KB)_.

# <span id="MoreDISMresources">More DISM resources</span>

  1. <a href="https://technet.microsoft.com/en-us/library/hh825099.aspx" target="_blank">https://technet.microsoft.com/en-us/library/hh825099</a>
  2. <a href="https://msdn.microsoft.com/en-us/library/jj980032" target="_blank">https://msdn.microsoft.com/en-us/library/jj980032</a>
