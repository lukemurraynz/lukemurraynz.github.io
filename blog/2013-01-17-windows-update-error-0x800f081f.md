---
title: Windows Update Error 0x800f081f
date: 2013-01-17 00:00:00 +1300
authors: [Luke]
tags:
  - Windows
---

This problem is generally caused by corrupted/damaged DNS Cache. Follow the instructions below to repair.

  1. Click Start
  2. Click All Programs/Programs
  3. Click Accessories
  4. Right click Command Prompt select Run as Administrator
  5. Type in:_ **ipconfig /flushdns**_
  6. Press Enter
  7. Restart your computer and attempt Windows Update.


If the above doesn’t work then you can bypass the problem by assigning your own DNS server , such as Google DNS.

  1. Click Start
  2. Click Control Panel
  3. Click Network/Network & Sharing Center
  4. Click Change Adapter Settings (on the left hand side)
  5. Right click Local Area Connection _(if you are using wired method of connecting – if not select Wireless Connection)_
  6. Select Properties
  7. Click Internet Protocol Version 4 (TCP/IPv4)
  8. Click Properties
  9. Select Use the following DNS server addresses
 10. Type in: 8.8.8.8 and on the second line 8.8.4.4
 11. Click Ok
 12. You are now routing your computers DNS through google’s servers instead of the service offered by your Internet Service Provider. _Depending on who and where you are – you might notice a slowdown in internet browsing or a speed up – this is normal._
 13. Restart your computer and attempt Windows Update.
