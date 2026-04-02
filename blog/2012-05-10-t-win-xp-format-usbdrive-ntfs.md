---
title: How to Format a USB Flash Drive as NTFS in Windows XP
description: "By default, Windows XP formats USB drives as FAT32. Here is how to enable NTFS formatting for USB flash drives by changing the device policy to Optimize for Performance."
slug: win/t-win-xp-format-usbdrive-ntfs
tags:
  - Windows
---

By default, **Windows XP** only offers **FAT** and **FAT32** as formatting options for USB flash drives. If you need to format a USB drive as **NTFS** (for example, to store files larger than 4 GB or to use NTFS permissions), you need to change the device's policy to **Optimize for Performance** first.

## How to enable NTFS formatting

1. Right-click **My Computer** and click **Properties**.
2. Click the **Hardware** tab.
3. Click **Device Manager**.
4. Expand **Disk Drives** and right-click your USB device.
5. Click **Properties**.
6. Click the **Policies** tab.
7. Select **Optimize for performance**.
8. Click **Apply**, then **Ok**.
9. **Restart** your computer.

After restarting, right-click the USB drive in **My Computer** and select **Format**. You will now see **NTFS** as an available file system option.

## Important considerations

- **Safe removal required:** When the policy is set to "Optimize for performance", Windows enables write caching on the drive. You **must** use the "Safely Remove Hardware" tray icon before unplugging the USB drive, or you risk data corruption.
- **Compatibility:** NTFS is a Windows file system. If you need to use the USB drive with macOS or Linux, consider **exFAT** instead (supported natively on modern operating systems and has no 4 GB file size limit).
- **FAT32 vs NTFS:** FAT32 has a maximum file size of 4 GB and does not support file permissions. NTFS removes the file size limit and supports permissions, encryption, and compression.
