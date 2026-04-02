---
title: Fix Google Calendar Sync Error 1011 in Outlook
description: "Getting error 1011 when syncing Google Calendar with Microsoft Outlook? This is usually caused by the Google Calendar add-in being disabled. Here is how to re-enable it and restore sync."
slug: misc/google-cal-sync-error-1011
tags:
  - Misc
  - Windows
---

If you are using the Google Calendar Sync plugin with Microsoft Outlook and receiving **Error 1011**, the most common cause is that the Google Calendar add-in has been automatically disabled by Outlook. This can happen after an Outlook crash, an update, or if the add-in took too long to load.

## How to fix it

Re-enable the Google Calendar add-in in Outlook by following these steps:

1. Open **Outlook**.
2. Click **File**.
3. Click **Help**, then **Options**.
4. Click **Add-ins** in the left-hand menu.
5. At the bottom, click the **Manage** dropdown list and select **Disabled Items**.
6. Click **Go**.
7. Select **Addin: google** from the list.
8. Click **Enable**.
9. Click **Ok**.
10. Run a **Google Calendar Sync** to verify the error is resolved.

## Why does this happen?

Outlook monitors add-in performance and automatically disables add-ins that are slow to load or cause instability. The Google Calendar Sync add-in may be flagged if it experiences a timeout when communicating with Google's servers. Re-enabling it from the Disabled Items list tells Outlook to give it another chance.

If the error persists after re-enabling, try uninstalling and reinstalling the Google Calendar Sync plugin, or check that your Google account credentials are still valid.
