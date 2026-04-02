---
title: How to Fix Scrivener Crashing on macOS
description: "If Scrivener crashes immediately when you try to open it on macOS, it is often caused by incorrect file permissions on the application bundle. Here is how to repair the permissions using Terminal."
date: 2012-08-31T10:58:32+00:00
authors: [Luke]
tags:
  - Mac OSX
---

If **Scrivener** crashes or closes immediately after launching on macOS, the issue is often related to **incorrect file permissions** on the application bundle. This can happen after a macOS update, a failed Scrivener update, or if the application was moved between user accounts.

## How to fix it

1. Open **Terminal** (found in **Applications > Utilities**).
2. Type the following command and press **Enter**:

   ```bash
   sudo chmod -R 0755 /Applications/Scrivener.app
   ```

3. Enter your administrator password when prompted.
4. Try opening **Scrivener** again.

### What this command does

- `sudo` — Runs the command with administrator privileges.
- `chmod -R 0755` — Recursively sets the file permissions so the owner can read, write, and execute, while other users can read and execute. This is the standard permission set for macOS applications.
- `/Applications/Scrivener.app` — The path to the Scrivener application bundle.

## Other applications

This fix works for other macOS applications that refuse to launch due to permission issues. Simply replace `/Applications/Scrivener.app` with the path to the affected application.

## If the problem persists

- Try **deleting Scrivener's preferences** by removing the file at `~/Library/Preferences/com.literatureandlatte.scrivener*.plist` and relaunching.
- **Reinstall Scrivener** by downloading a fresh copy from the [Literature and Latte website](https://www.literatureandlatte.com/scrivener/download).
- Check the **Console app** (Applications > Utilities > Console) for crash logs that may provide more detail about the failure.
