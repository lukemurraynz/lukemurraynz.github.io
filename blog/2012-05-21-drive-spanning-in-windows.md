---
title: How to Set Up Drive Spanning in Windows
description: "Drive spanning combines multiple physical disks into a single volume in Windows. Learn how to create a spanned volume using Disk Management, including requirements and warnings."
layout: post
slug: win/drive-spanning-in-windows
tags:
  - Windows
---

**Drive spanning** (also known as a **spanned volume**) allows you to combine unallocated space from multiple physical disks into a single logical volume. This is useful when you want a single large drive letter that spans across multiple disks, without the redundancy overhead of RAID.

> **Warning:** Make sure you have **no important data** on the partitions you plan to use, as creating a spanned volume will **erase everything** on them. Spanned volumes do **not** provide any fault tolerance — if one disk in the span fails, all data on the volume is lost.

## How to create a spanned volume

1. Open **Disk Management** (right-click the Start button or search for `diskmgmt.msc`).
2. Right-click on **unallocated space** on one of your disks.
3. Click **New Spanned Volume** (or **Create New Volume** on older Windows versions).
4. Click **Next**.
5. Select **Spanned Volume** and click **Next**.
6. Select the additional disks you want to include and click **Add**.
7. Adjust the size settings if needed, then click **Next**.
8. Assign a **drive letter** (for example, **G:**).
9. Choose your formatting options — **NTFS** is recommended for most use cases.
10. Click **Next**, then **Finish**.

Windows will create the spanned volume and it will appear as a single drive in File Explorer.

## When to use drive spanning

- You have multiple smaller disks and want to use them as one large volume.
- You need temporary storage and do not require redundancy.
- You are combining remaining free space across disks for a non-critical purpose.

## When not to use drive spanning

- For important data — use **mirrored volumes** (RAID 1) or a proper RAID array instead.
- In production server environments — use Windows **Storage Spaces** or hardware RAID for better reliability.
