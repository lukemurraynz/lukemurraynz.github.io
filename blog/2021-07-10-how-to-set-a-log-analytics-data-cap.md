---
title: How to set a Log Analytics Daily Data Cap
authors: [Luke]
tags:
  - Azure
date: 2021-07-10 00:00:00 +1300
toc: false
header:
  teaser: /uploads/azportal_loganalyticscap.png
---

This is just an additional configuration that may help with sizing and pricing Log Analytics, you can set a 'Daily cap' for the amount of Data you ingest **_per day_**, to help restrict cost.

The downside of this is if you reach the cap, you will no longer collect any data, until the following day, meaning you may miss key events or issues.

This is something that I would recommend ONLY to do if you run into any financial constraints, giving you more time time to work through, of course, situation depending.

This is a pretty quick 'How To' so let's get straight into it:

1. Log in to the **Azure Portal**
2. Search for your Log Analytics Workspace
3. Select **Usage and estimated costs**
4. Click on **Daily Cap**
5. **Set** your **cap** in **GB** _(I put 0.166 as my thinking was 5GB per free each month, so 166MB a day, should cap my Log Analytics workspace, although useful for this demo/lab, it's not a number I would recommend for Production)_
6. Click **Ok**

![Log Analytics - Set Daily Cap](/uploads/azportal_loganalyticscap.png "Log Analytics - Set Daily Cap")
