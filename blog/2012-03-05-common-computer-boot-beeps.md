---
title: Common Computer Boot Beep Codes and What They Mean
description: "When your computer beeps during startup, it is telling you something through POST beep codes. Here is a guide to the most common BIOS beep patterns and what hardware problems they indicate."
slug: misc/common-computer-boot-beeps
tags:
  - Misc
---

When you turn on a computer, the **BIOS** runs a **Power-On Self-Test (POST)** that checks critical hardware components before loading the operating system. If the POST detects a problem, the computer communicates the error through a series of **beep codes** since the display may not be functional yet.

The number and pattern of beeps indicate which component has failed. Below are the most common beep codes for **Award** and **AMI BIOS** systems.

## Common beep codes

| Beep Pattern                    | Description                                            |
| ------------------------------- | ------------------------------------------------------ |
| **No beeps**                    | No power, bad CPU or motherboard, or loose peripherals |
| **One short beep**              | Everything is normal — POST completed successfully     |
| **Two short beeps**             | POST or CMOS error — check BIOS settings               |
| **One long, one short beep**    | Motherboard problem                                    |
| **One long, two short beeps**   | Video card or display adapter problem                  |
| **One long, three short beeps** | Video card or display adapter problem                  |
| **Three long beeps**            | Keyboard error — check keyboard connection             |
| **Repeated long beeps**         | Memory (RAM) error — reseat or replace RAM             |
| **Continuous high-low beeps**   | CPU overheating — check CPU fan and thermal paste      |

## What to do when you hear beep codes

1. **Count the beeps carefully** — note the pattern (short vs long beeps, and how many of each).
2. **Power off** the computer and unplug it.
3. **Reseat components** — open the case and push RAM sticks, the video card, and cable connections firmly back into their slots. Loose components are the most common cause of POST failures.
4. **Test with minimal hardware** — disconnect all non-essential devices (extra RAM sticks, USB devices, additional drives) and try booting with just the basics: one stick of RAM, the CPU, and the video card.
5. **Consult your motherboard manual** — beep codes can vary between BIOS manufacturers (Award, AMI, Phoenix). Your motherboard manual will have the definitive list for your hardware.

If reseating components does not resolve the issue, the beep code usually points to the specific component that needs to be replaced.
