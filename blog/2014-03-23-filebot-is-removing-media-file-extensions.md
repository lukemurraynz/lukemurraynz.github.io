---
title: Fix Filebot Removing Media File Extensions
description: "If Filebot is stripping file extensions like .mkv or .mp4 when renaming your media files, the fix is simple. Change the Extensions setting from Override to Preserve in the Rename Options."
tags:
  - Windows
date: 2014-03-23 00:00:00 +1300
---

[Filebot](https://www.filebot.net/) is a popular media renaming tool that can automatically organise TV shows and movies by fetching metadata from online databases. However, you might notice that after renaming, your media files are missing their file extensions (such as `.mkv`, `.mp4`, or `.avi`).

This happens when the **Extensions** setting is set to **Override** instead of **Preserve**.

## How to fix it

1. In Filebot, navigate to **Rename Options** (the settings/gear icon near the rename panel).
2. Find the **Extensions** setting.
3. Change it from **Override** to **Preserve**.

Filebot will now keep the original file extension when renaming your media files.

## Why does this matter?

Without a file extension, your operating system and media players will not know how to open the file. You would need to manually add the extension back (for example, renaming `Movie Title` to `Movie Title.mkv`) for the file to be playable. Using the **Preserve** setting avoids this problem entirely.
