---
title: Fix Webpage Display Issues in Internet Explorer and Firefox
description: "Missing buttons and strange colours in Internet Explorer and Firefox are often caused by Windows High Contrast mode being enabled. Here is how to check and disable it."
date: 2012-08-24T13:59:53+00:00
authors: [Luke]
tags:
  - Windows
---

If web pages are displaying with missing buttons, broken layouts, or unusual colours in both **Internet Explorer** and **Firefox**, the issue is likely not with the browsers themselves. Instead, it is usually caused by **Windows High Contrast mode** being enabled.

High Contrast mode overrides the colours and styles used by websites to improve readability for users with visual impairments. However, it can make normal web browsing look broken — buttons may disappear, backgrounds may turn black, and text colours may change unexpectedly.

## How to disable High Contrast mode

1. Click **Start**.
2. Click **All Programs** (or **Programs**).
3. Click **Accessibility**.
4. Click **Display Settings**.
5. Look for the **High Contrast** setting and **disable** it.

Alternatively, you can toggle High Contrast mode quickly by pressing **Left Alt + Left Shift + Print Screen** on your keyboard. A dialog will appear asking if you want to turn High Contrast on or off.

## Why does this affect web pages?

When High Contrast mode is active, Windows tells browsers to ignore website-defined colours and styles, replacing them with the system's high contrast colour scheme. This is by design, but it means CSS-styled buttons, icons, and backgrounds may not render as the web developer intended. Disabling the mode restores normal rendering.
