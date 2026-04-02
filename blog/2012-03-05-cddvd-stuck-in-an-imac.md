---
title: How to Eject a Stuck CD or DVD from an iMac
description: "CD or DVD stuck in your iMac with no eject button? Here are three methods to force eject a disc, from holding the mouse button at boot to using the Terminal drutil command."
tags:
  - Mac OSX
date: 2012-03-05 00:00:00 +1300
---

iMacs use a slot-loading disc drive with no physical eject button, so if a CD or DVD gets stuck, you need to use software or keyboard shortcuts to force it out. Here are three methods to try, in order of simplicity.

## Method 1: Hold the mouse button at boot

1. **Restart** your iMac (or shut it down and turn it back on).
2. Immediately **press and hold the mouse button** (or trackpad button) as the iMac starts up.
3. Keep holding until the disc ejects.

This tells the firmware to eject any disc in the drive before the operating system loads.

## Method 2: Hold the C key during reboot

If Method 1 does not work:

1. **Restart** your iMac.
2. Immediately **press and hold the C key** during startup.

The **C key** tells the iMac to boot from the optical disc. If the disc does not contain a bootable operating system, the iMac will reject it and eject the disc automatically.

## Method 3: Use the Terminal

If the first two methods fail, you can force an eject from within macOS:

1. Open **Terminal** (Applications > Utilities > Terminal).
2. Type the following command and press **Return**:

   ```bash
   drutil tray eject
   ```

3. The disc should eject.

## Other tips

- **Drag to Trash:** You can also drag the disc icon from the Desktop to the Trash (which changes to an Eject icon) to eject it through the Finder.
- **Keyboard shortcut:** If you have an Apple keyboard with an **Eject key** (top-right corner), press and hold it for a second to eject the disc.
- **Disk Utility:** Open **Disk Utility** (Applications > Utilities), select the disc in the sidebar, and click the **Eject** button in the toolbar.
