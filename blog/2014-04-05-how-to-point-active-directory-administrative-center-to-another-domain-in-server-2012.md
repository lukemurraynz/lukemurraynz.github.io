---
title: How to point Active Directory Administrative Center to another domain in Server 2012
tags:
  - Windows
date: 2014-04-05 00:00:00 +1300
---

  1. Click **Start**
  2. Click **Administrative Tools**
  3. Click **Active Directory Administrative Center**
  4. Click on **Add Navigation Node**
  5. Click **Connect to other domains..** _(on the lower right of the window)
  6. Type the **domain name** you want to connect to and click **ok**.

Note: This is only valid for trusted federated domains; this method of connecting uses your local credentials and in order to run as separate credentials you will need to launch the Administrative Center using Runas.
