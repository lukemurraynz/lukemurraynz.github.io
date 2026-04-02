---
title: Fix Windows Update Error 0x800f081f
description: "Getting error 0x800f081f when running Windows Update? This is commonly caused by a corrupted DNS cache preventing Windows from reaching the update servers. Here are two methods to fix it."
date: 2013-01-17 00:00:00 +1300
authors: [Luke]
tags:
  - Windows
---

The **Windows Update error 0x800f081f** typically occurs when Windows cannot reach the update servers. A common cause is a **corrupted or stale DNS cache** that prevents name resolution for Microsoft's update endpoints.

## Method 1: Flush the DNS cache

1. Click **Start > All Programs > Accessories**.
2. Right-click **Command Prompt** and select **Run as Administrator**.
3. Type the following command and press **Enter**:

   ```cmd
   ipconfig /flushdns
   ```

4. **Restart** your computer and try Windows Update again.

Flushing the DNS cache clears any stale or corrupted DNS entries, forcing Windows to perform fresh lookups when connecting to the update servers.

## Method 2: Use Google DNS

If flushing the DNS cache does not resolve the issue, your ISP's DNS servers may be causing the problem. Switching to **Google's public DNS** servers can bypass this:

1. Click **Start > Control Panel**.
2. Click **Network and Sharing Center** (or **Network**).
3. Click **Change Adapter Settings** on the left.
4. Right-click **Local Area Connection** (or **Wireless Connection** if on Wi-Fi) and select **Properties**.
5. Select **Internet Protocol Version 4 (TCP/IPv4)** and click **Properties**.
6. Select **Use the following DNS server addresses**.
7. Enter:
   - Preferred DNS server: `8.8.8.8`
   - Alternate DNS server: `8.8.4.4`
8. Click **Ok** to save.
9. **Restart** your computer and try Windows Update again.

> **Note:** Changing your DNS server routes all DNS queries through Google's servers instead of your ISP's. Depending on your location and ISP, this may slightly affect browsing speed (faster or slower).

## Other causes of 0x800f081f

If neither method works, the error can also be caused by:

- **Corrupted system files** - Run `sfc /scannow` in an elevated Command Prompt to check and repair Windows system files.
- **Missing .NET Framework source files** - If the error occurs when installing .NET Framework features, you may need to specify an alternative source path using DISM.
