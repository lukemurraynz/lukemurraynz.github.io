---
title: Fix "You Do Not Have Enough Permission" on eeePC Xandros
description: "Getting a 'You do not have enough permission' error on an ASUS eeePC running Xandros Linux? This usually happens when the /media directory is missing after enabling the full desktop. Here is how to fix it."
date: 2012-09-19T09:49:26+00:00
authors: [Luke]
tags:
  - Linux
---

If you see the error **"You do not have enough permission"** on an **ASUS eeePC** running **Xandros Linux**, it is typically caused by the `/media` directory not existing. This commonly happens after enabling the **full KDE desktop** mode, which can alter the default directory structure.

The `/media` directory is where Linux mounts removable storage devices such as USB drives and SD cards. Without it, the system cannot mount external media and throws a permission error.

## How to fix it

1. Open a **Terminal**.
2. Run the following command to create the missing directory:

   ```bash
   sudo mkdir /media
   ```

3. Press **Enter** and provide your password if prompted.

After creating the directory, try accessing your removable storage again. The error should be resolved.

## Why does this happen?

The Xandros Linux distribution used on early ASUS eeePC netbooks had a simplified "Easy Mode" interface by default. When users switched to the full KDE desktop, certain system directories were occasionally removed or not created properly during the transition. The `/media` mount point is essential for the operating system to handle removable devices.
