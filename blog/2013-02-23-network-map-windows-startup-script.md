---
title: How to Map a Network Drive at Windows Startup Using a Script
description: "Create a Windows startup script to automatically map a network drive on login using the net use command. Includes a ready-to-use batch script example."
authors: [Luke]
tags:
  - Windows
date: 2013-02-23 00:00:00 +1300
---

If you regularly access a shared folder on your network, you can create a simple batch script that runs at startup to automatically map the network drive. This saves you from having to manually reconnect the drive each time you log in.

## The script

Create a new text file with a `.bat` extension (for example, `MapDrive.bat`) and add the following:

```batch
@echo off
cls
net use z: /delete /y
net use z: "\\192.168.1.1\share" /y
```

### What the script does

- `@echo off` — Hides the command output from the console window.
- `cls` — Clears the screen.
- `net use z: /delete /y` — Disconnects drive letter Z if it is already in use, without prompting for confirmation.
- `net use z: "\\192.168.1.1\share" /y` — Maps the network share at `\\192.168.1.1\share` to drive letter **Z:**.

> **Note:** Z is the drive letter used in this example. You can change it to any available letter that is not already in use.

## How to run the script at startup

1. Press **Win + R**, type `shell:startup`, and press **Enter**. This opens the Windows Startup folder.
2. Copy your `.bat` file into this folder.
3. The script will now run automatically every time you log in.

Alternatively, you can set the script as a **Group Policy logon script** if you need to deploy it across multiple machines in a domain environment.
