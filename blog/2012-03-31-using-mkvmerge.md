---
title: How to Add Subtitles to a Video Using MKVMerge
description: "Learn how to use MKVMerge (MKVToolNix) to add SRT subtitle files to MKV video files. Step-by-step guide with the correct language and character set settings."
slug: win/using-mkvmerge
tags:
  - Windows
---

[MKVMerge](https://mkvtoolnix.download/) (part of the MKVToolNix suite) is a free tool that lets you combine video, audio, and subtitle tracks into a single **MKV** container file. This is useful when you have a separate **SRT subtitle file** and want to embed it permanently into the video.

## How to add subtitles with MKVMerge

1. Open **MKVMerge** (MKVToolNix GUI).
2. Click **Add** and select the **video file** you want to add subtitles to.
3. Click **Add** again and select the **SRT subtitle file**.
4. In the tracks list at the bottom, click on the **subtitle track** (it should be the last entry).
5. Set the **Language** to **English** (or the appropriate language for your subtitles).
6. Set the **Forced Track** flag to **Yes** if you want the subtitles to display automatically.
7. Under **Format Specific Options**, set the **Character set** to **UTF-8** (recommended) or **ISO-8859-2** if your subtitles use Eastern European characters.
8. Set the **output file name** at the bottom of the window.
9. Click **Start Muxing** (or **Mux**).

MKVMerge will combine the video and subtitle files into a new MKV file. The original files are left unchanged.

## Tips

- **UTF-8 is preferred** over ISO-8859 character sets for most modern subtitle files, as it supports a wider range of characters including accented letters and non-Latin scripts.
- You can add **multiple subtitle tracks** in different languages by repeating steps 3-7 for each SRT file.
- If the subtitles are out of sync, use the **Delay** option in the track settings to shift the timing forward or backward by a specified number of milliseconds.
- MKVMerge also supports other subtitle formats including **ASS**, **SSA**, and **VobSub**.
