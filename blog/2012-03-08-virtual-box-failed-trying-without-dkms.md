---
title: Fix VirtualBox "Failed, trying without DKMS" Error on Linux
description: "If VirtualBox displays a 'Failed, trying without DKMS' error on Linux, it means the DKMS (Dynamic Kernel Module Support) package is missing. Here is how to install it on Ubuntu and Fedora."
slug: linux/virtual-box-failed-trying-without-dkms
tags:
  - Linux
---

When you install or start [VirtualBox](https://www.virtualbox.org/) on a Linux distribution, you may encounter the error message **"Failed, trying without DKMS"**. This error indicates that the **DKMS (Dynamic Kernel Module Support)** package is not installed on your system.

## What is DKMS?

DKMS is a framework that allows kernel modules to be dynamically rebuilt when a new kernel is installed. VirtualBox relies on kernel modules (such as `vboxdrv`) to interface with your hardware. Without DKMS, these modules will not be rebuilt automatically after kernel updates, causing VirtualBox to fail.

## How to fix it

### Ubuntu / Debian

1. Open a **Terminal**.
2. Run the following command:

   ```bash
   sudo apt-get install dkms
   ```

3. Wait for the package to **download and install**.
4. Try opening **VirtualBox** again.

### Fedora / RHEL

1. Open a **Terminal**.
2. Run the following command:

   ```bash
   sudo yum install dkms
   ```

3. Wait for the package to **download and install**.
4. Try opening **VirtualBox** again.

## Still not working?

If VirtualBox still fails after installing DKMS, you may also need to install the kernel headers for your running kernel. On Ubuntu, run:

```bash
sudo apt-get install linux-headers-$(uname -r)
```

On Fedora:

```bash
sudo yum install kernel-devel-$(uname -r)
```

After installing the headers, reconfigure VirtualBox with:

```bash
sudo /sbin/vboxconfig
```

This should rebuild the VirtualBox kernel modules and resolve the issue.
