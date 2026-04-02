---
title: Fix "The Messaging Interface Has Returned an Unknown Error" in Outlook
description: "This Outlook error occurs when the PST or OST data file has reached its size limit. Learn how to fix it by upgrading to large tables and managing your mailbox size."
date: 2013-02-06T00:00:00.000Z
authors: [Luke]
tags:
  - Misc
  - Windows
---

If you see the error **"The messaging interface has returned an unknown error"** when using Microsoft Outlook, it typically means your Outlook data file (PST or OST) has reached its maximum file size limit. Older versions of Outlook (2003 and earlier) had a default limit of around 2 GB, while Outlook 2007 and later support up to 50 GB, but the table format may still need upgrading.

## How to fix it

1. Launch **Microsoft Outlook**.
2. In the left-hand pane, **right-click** the folder list (your mailbox name) and select **Properties**.
3. Click **Advanced**.
4. Check the box labelled **"Allow upgrade to large tables"**.
5. Click **Ok** twice to close the dialogs.
6. **Restart Outlook** for the change to take effect.

## What does "Allow upgrade to large tables" do?

Outlook data files use internal database tables to organise your emails, contacts, and calendar items. The "large tables" option upgrades the internal format to support a larger maximum file size and more items per folder. This one-time upgrade is non-reversible but is safe and recommended.

## Additional steps to prevent the error

- **Permanently delete old emails:** Select emails you no longer need and press **Shift + Delete** to bypass the Deleted Items folder and immediately free up space in the data file.
- **Empty the Deleted Items folder:** Right-click the Deleted Items folder and select **Empty Folder**.
- **Compact the data file:** Go to **File > Account Settings > Data Files**, select your data file, and click **Settings > Compact Now**. This reclaims space from deleted items.
- **Archive old mail:** Use **File > Cleanup Tools > Archive** to move older emails to a separate archive file, reducing the size of your primary data file.
