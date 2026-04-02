---
title: Fix "Outlook Data File Cannot Be Accessed" Error
description: "Getting an Outlook data file cannot be accessed error after upgrading from Outlook 2007 to 2010? This is caused by a broken folder mapping. Here is how to fix the inbox folder assignment."
authors: [Luke]
date: 2013-02-11 00:00:00 +1300
tags:
  - Misc
  - Windows
---

The **"Outlook data file cannot be accessed"** error commonly appears after **upgrading from Outlook 2007 to Outlook 2010**. The upgrade can break the folder mapping that tells Outlook where to deliver incoming emails, causing it to reference a data file path that no longer exists or has changed.

## How to fix it

1. Open **Outlook 2010**.
2. Click **File** (top left).
3. Click **Account Settings**, then click **Account Settings** again from the dropdown.
4. Select your email account and click **Change Folder**.
5. Click the **"+"** icon next to the folder name to expand and reveal subfolders.
6. Select **Inbox**.
7. Click **Ok**.
8. Close all open dialogs and **restart Outlook**.

This re-maps the email delivery location to the correct Inbox folder within your current data file.

## Why does this happen?

Outlook 2007 and 2010 handle PST (Personal Storage Table) files slightly differently. During the upgrade, the internal reference to the default delivery folder can become invalid, particularly if:

- The PST file was moved or renamed during the upgrade.
- Multiple email accounts were configured with different data files.
- The Outlook profile was partially migrated.

## If the error persists

- **Create a new Outlook profile:** Go to **Control Panel > Mail > Show Profiles > Add**. Set up your email account fresh in the new profile and set it as the default.
- **Repair the PST file:** Use Microsoft's **Inbox Repair Tool** (`scanpst.exe`) to scan and repair the data file. The tool is located in the Office installation directory.
- **Check file permissions:** Ensure your Windows user account has read/write access to the PST file location.
