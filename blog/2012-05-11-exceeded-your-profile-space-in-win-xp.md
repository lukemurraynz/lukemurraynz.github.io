---
title: Fix "You Have Exceeded Your Profile Space" in Windows XP
description: "Getting a profile quota exceeded error in Windows XP? This is caused by a Group Policy setting that limits profile size. Here is how to remove the restriction using a registry fix."
slug: win/exceeded-your-profile-space-in-win-xp
tags:
  - Windows
---

The **"You have exceeded your profile space"** error in Windows XP appears when a **Group Policy** or local policy has set a maximum size for your user profile. Once your profile (which includes your Desktop, Documents, application settings, and registry hive) exceeds the limit, Windows displays this warning and may prevent you from logging in or saving changes.

The fix involves removing the registry keys that enforce the profile quota.

## How to fix it

1. Click **Start > Programs > Accessories** and open **Notepad**.
2. Copy and paste the following into Notepad:

   ```reg
   Windows Registry Editor Version 5.00

   [HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\System]
   "EnableProfileQuota"=-
   "ProfileQuotaMessage"=-
   "MaxProfileSize"=-
   "IncludeRegInProQuota"=-
   "WarnUser"=-
   "WarnUserTimeout"=-
   ```

3. Click **File > Save As**.
4. Save the file as **fix.reg** (make sure to select "All Files" as the file type so it does not save as a `.txt` file).
5. **Double-click** the saved `fix.reg` file and confirm the prompt to merge it into the registry.
6. **Restart** your computer.

## What this does

The registry entries under `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\System` control the profile quota settings. The `-` value after each entry tells the registry editor to **delete** that key, effectively removing the profile size restriction.

| Registry Value        | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `EnableProfileQuota`  | Enables or disables profile size enforcement     |
| `MaxProfileSize`      | Sets the maximum profile size in KB              |
| `ProfileQuotaMessage` | Custom message shown when the quota is exceeded  |
| `WarnUser`            | Whether to warn users as they approach the limit |
| `WarnUserTimeout`     | How long the warning is displayed                |

## Preventing the issue

If this error keeps recurring, it is likely being enforced by a **domain Group Policy**. Contact your system administrator to either increase the profile quota or exclude your account from the policy. For standalone machines, ensure no local policy is setting a profile size limit under **Local Group Policy Editor > User Configuration > Administrative Templates > System > User Profiles**.
