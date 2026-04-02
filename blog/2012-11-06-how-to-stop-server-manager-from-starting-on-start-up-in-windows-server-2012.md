---
title: How to Stop Server Manager from Starting Automatically in Windows Server 2012
description: "Server Manager opens automatically every time you log into Windows Server 2012. Here is how to disable the automatic startup so it only opens when you need it."
date: 2012-11-06 00:00:00 +1300
authors: [Luke]
tags:
  - Windows
---

By default, **Server Manager** launches automatically every time you log into **Windows Server 2012** (and later versions, including 2012 R2). While Server Manager is useful for initial configuration, having it open on every login can be annoying on servers you manage frequently.

## How to disable Server Manager auto-start

1. Open **Server Manager** (if it is not already open).
2. Click **Manage** in the top-right corner of the toolbar.
3. Click **Server Manager Properties**.
4. Tick the checkbox **"Do not start Server Manager automatically at logon"**.
5. Click **Ok**.

The next time you log in, Server Manager will no longer appear automatically. You can still launch it manually from the taskbar, Start menu, or by running `servermanager.exe`.

## Alternative method using Group Policy

If you need to disable Server Manager auto-start across multiple servers in a domain, you can use **Group Policy**:

1. Open the **Group Policy Management Console**.
2. Create or edit a GPO linked to the OU containing your servers.
3. Navigate to **Computer Configuration > Policies > Administrative Templates > System > Server Manager**.
4. Set **"Do not display Server Manager automatically at logon"** to **Enabled**.

This applies the setting to all servers affected by the GPO, saving you from configuring each one individually.
