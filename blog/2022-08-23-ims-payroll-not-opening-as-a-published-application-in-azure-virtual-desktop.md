---
title: IMS Payroll not opening as a published application in Azure Virtual Desktop
authors: [Luke]
tags:
  - Azure
date: 2022-08-23 00:00:00 +1300
toc: false
header:
  teaser: /uploads/imspayroll_avdpublishedapp.png
slug: azure/ims-payroll-not-opening-as-a-published-application-in-azure-virtual-desktop
---

[Azure Virtual Desktop](https://azure.microsoft.com/en-us/services/virtual-desktop/?WT.mc_id=AZ-MVP-5004796 " Azure Virtual Desktop") allows you to access an entire desktop or a published application with shortcuts and an appearance like it was running locally; depending on the requirements; I prefer published applications where possible to keep the user experience on the endpoint device and keep the cost down.

One of the applications I published for a customer is [MYOB IMS Payroll](https://www.myob.com/nz/enterprise/ims-payroll " MYOB IMS Payroll ").

IMS Payroll worked well as a published application for months until one day; it didn't seem to open for the user, whether as a published application or in the Full Desktop.

The symptoms were that once the user clicked on the icon, it would appear to open _(visible on the Taskbar)_, but there was no window, and when you hovered over the preview thumbnail, it was blank. The cursor also appeared to be active with a circle, indicating it was trying to open.

Even if you don't have IMS Payroll, you may experience applications with a similar experience, and hopefully, this article will help point you in the right direction.

![Azure Virtual Desktop - Published Application](/uploads/imspayroll_avdpublishedapp.png)

One noticeable difference we found in our testing - was that it opened for us and other users using different accounts.

After some discovery, we discovered that the user had gone to another branch office site and used a different monitor setup, and IMS Payroll was out of drawing range. Usually, windows would be able to snap this back into view; however, after comparing the registry keys for our user vs the user who had the issue, we discovered that IMS Payroll sets the location in the user registry.

* Registry Key location: **\\HKEY_CURRENT_USER\\IMS Payroll Partner\\Layout**

In our case, the settings were as follows:

    Windows Registry Editor Version 5.00
    
    [HKEY_CURRENT_USER\IMS Payroll Partner\Layout]
    "Left"="684"
    "Top"="310"
    "Height"="713"
    "Width"="1127"
    "StatusBar"="1"
    "ActiveHelp"="0"
    "EmployeePage"="0"
    "PayrollPage"="5"
    "CompanyPage"="1"
    "SkipWelcome"="1"
    "SkinName"="lfUltraFlat"
    "LastPage"="6"

For the users who couldn't see IMS Payroll, their settings looked more like this:

    Windows Registry Editor Version 5.00
    
    [HKEY_CURRENT_USER\IMS Payroll Partner\Layout]
    "Left"="-1444"
    "Top"="310"
    "Height"="713"
    "Width"="1127"
    "StatusBar"="1"
    "ActiveHelp"="0"
    "EmployeePage"="0"
    "PayrollPage"="5"
    "CompanyPage"="1"
    "SkipWelcome"="1"
    "SkinName"="lfUltraFlat"
    "LastPage"="6"

The difference was that the Left entry had moved the Window too far, left out of view, so it could not be seen by the user when opening as a published app or on a Desktop.

After the **Left entry was changed from -1444 to 684**. IMS became visible again as a published application and on the Full Desktop.

Due to the hard-coded user registry entries, this specific issue would have occurred regardless of Azure Virtual Desktop, running in a Terminal Services environment, or even locally, when working with different monitor setups.

_Note: Some applications may have configuration files stored in the user's AppData folders instead of the registry; if in doubt, raise a support ticket with the application vendor._
