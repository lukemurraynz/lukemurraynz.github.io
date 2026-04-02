---
title: Fix Black Screen During Windows 8 Installation
description: "A black screen during Windows 8 installation is usually caused by the installer switching to UEFI mode on an incompatible motherboard, often triggered by multiple hard drives. Here is how to fix it."
date: 2012-12-13 00:00:00 +1300
authors: [Luke]
tags:
  - Windows
---

If you see a **black screen** during a Windows 8 installation, the installer has likely switched to **UEFI boot mode** on a motherboard that does not fully support it. This commonly happens when **multiple hard drives** are connected to the system during the installation process.

When multiple drives are present, the Windows installer may detect a GPT-formatted drive and attempt a UEFI install, even if the target drive or motherboard firmware does not support it. The result is a blank or black screen where the installation appears to hang.

## How to fix it

1. **Shut down** your computer and **unplug any secondary hard drives**. Leave only the drive you intend to install Windows on connected.
2. **Start the installation again.** With only one drive present, the installer should automatically fall back to **Master Boot Record (MBR)** mode instead of UEFI.
3. Once the installation completes, **shut down** the computer and **reconnect your other hard drives**.

## Additional tips

- If you need to install in UEFI mode, make sure your motherboard firmware is up to date and that the target drive is formatted as **GPT** (not MBR).
- You can check and change the boot mode in your **BIOS/UEFI firmware settings** (usually accessible by pressing **F2**, **Del**, or **Esc** during startup).
- If the black screen persists with only one drive connected, try using a different USB port for the installation media, or re-create the bootable USB drive using the [Windows Media Creation Tool](https://www.microsoft.com/software-download/).
