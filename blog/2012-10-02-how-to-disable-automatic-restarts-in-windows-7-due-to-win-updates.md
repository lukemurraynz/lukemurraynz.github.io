---
title: How to disable automatic restarts in Windows 7 due to Windows Updates
date: 2012-10-02T03:47:38+00:00
authors: [Luke]
tags:
  - Windows
---
&nbsp;

<ol start="1">
  <li>
    Click <strong>Start</strong>
  </li>
  <li>
    In the search field <strong>type</strong>: <strong><em>regedit</em></strong>
  </li>
  <li>
    Click the <strong><em>regedit.exe</em></strong> result to open Registry Editor
  </li>
  <li>
    <strong>Navigate</strong> to: <strong><em>HKEY_LOCAL_MACHINE/SOFTWARE/Polices/Microsoft/Windows</em></strong>
  </li>
  <li>
    <strong>Right</strong> <strong>click</strong> an empty space in the right area and select <strong>New</strong>
  </li>
  <li>
    Click <strong>Key</strong>
  </li>
  <li>
    <strong>Name</strong> the new key: <strong><em>WindowsUpdate</em></strong>
  </li>
  <li>
    <strong>Right</strong> <strong>click</strong> the new WindowsUpdate <strong>key</strong>
  </li>
  <li>
    Select <strong>New</strong>
  </li>
  <li>
    Click <strong>Key</strong>
  </li>
  <li>
    <strong>Name</strong> the new <strong>key</strong>: <strong><em>AU</em></strong>
  </li>
  <li>
    <strong>Select</strong> the key key and <strong>right</strong> <strong>click</strong> and empty area
  </li>
  <li>
    Select <strong>New</strong>
  </li>
  <li>
    Click <strong>DWORD</strong> (32-bit) value
  </li>
  <li>
    <strong>Name</strong> the <strong>DWORD</strong>: <strong><em>NoAutoRebootWithLoggedOnUsers</em></strong>
  </li>
  <li>
    <strong>Right</strong> <strong>click</strong> <strong><em>NoAutoRebootWithLoggedOnUsers</em></strong>
  </li>
  <li>
    Select <strong>Modify</strong>
  </li>
  <li>
    Enter “<strong>1</strong>” in the value box
  </li>
  <li>
    Click <strong>Ok</strong>
  </li>
  <li>
    <strong>Close</strong> regedit
  </li>
</ol>

_Restart your computer and Windows should no longer restart due to automatic Windows Updates_