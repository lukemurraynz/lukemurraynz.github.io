---
title: 'Fix "Star Wars: The Old Republic Login Service Not Available" Error'
description: "If you see Login Service Not Available in Star Wars The Old Republic, it is usually caused by an incorrect system clock. Here is how to fix your date and time settings to resolve the issue."
slug: misc/star-wars-the-old-republic-login-service
tags:
  - Misc
  - Windows
---

If you are seeing the **"Login Service Not Available"** error when trying to log into **Star Wars: The Old Republic (SWTOR)**, the most common cause is that your computer's **date and time settings are incorrect**.

Online game launchers use SSL/TLS certificates to establish secure connections with the login servers. These certificates have validity periods, and if your system clock is significantly wrong, the certificate validation fails and the launcher cannot connect.

## How to fix it

1. **Close** the **Old Republic Launcher** completely.
2. Click **Start**.
3. Click **Control Panel**.
4. Click **Date and Time** (or **Clock, Language, and Region** depending on your Windows version).
5. Click **Change date and time**.
6. **Set the correct date and time**. It is also a good idea to click the **Internet Time** tab and click **Change settings** to sync with Microsoft's NTP time server (`time.windows.microsoft.com`).
7. Click **Ok** to save.
8. **Reopen** the **Old Republic Launcher** and try logging in again.

## Why does an incorrect clock cause login failures?

SSL/TLS certificates contain a "valid from" and "valid to" date range. When your system clock is outside this range, the operating system rejects the certificate as either expired or not yet valid. The game launcher reports this as a generic "Login Service Not Available" error rather than a certificate error.

Keeping your system clock synchronised with an internet time server prevents this issue from recurring. Windows can be configured to sync automatically under **Date and Time > Internet Time**.
