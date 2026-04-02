---
title: Fix Unable to Remote Desktop into a Computer
description: "Cannot connect using Remote Desktop? The issue may be caused by disabled Remote Desktop services or the Windows Firewall blocking the connection. Here is how to enable the required services remotely."
tags:
  - Windows
date: 2014-04-27 00:00:00 +1300
---

There are several reasons why a **Remote Desktop** connection might fail. Common causes include:

- The target computer does not have the required Remote Desktop services running.
- The Windows Firewall is blocking the RDP port (TCP 3389).
- The user is not a member of the **Remote Desktop Users** group on the target machine.

The steps below walk through checking and enabling the necessary services on a remote computer using the Services console.

## How to enable Remote Desktop services remotely

1. Press **Win + R** to open the **Run** dialog.
2. Type `services.msc` and press **Enter**.
3. In the Services window, click **Action > Connect to another computer**.
4. Type the **hostname** or **IP address** of the target computer and press **Enter**.
5. In the services list, locate the following services. For each one, double-click to open its properties, set the **Startup type** to **Automatic**, and click **Start**:
   - **Remote Access Auto Connection Manager**
   - **Remote Access Connection Manager**
   - **Routing and Remote Access**
6. Next, locate the **Windows Firewall/Internet Connection Sharing (ICS)** service. If it is blocking RDP connections, you may need to create a firewall rule to allow inbound connections on **TCP port 3389**.

> **Note:** Disabling the Windows Firewall entirely is not recommended for production environments. Instead, create a specific firewall rule to allow RDP traffic.

## Additional checks

- **Enable Remote Desktop on the target machine:** Right-click **My Computer/This PC > Properties > Remote Settings** and ensure **"Allow remote connections to this computer"** is selected.
- **Add users to the Remote Desktop Users group:** Click **Select Users** on the same dialog and add any users who need RDP access.
- **Network Level Authentication (NLA):** If the connecting client is running an older version of Windows, you may need to uncheck **"Allow connections only from computers running Remote Desktop with Network Level Authentication"** on the target machine.
- **Check network connectivity:** Verify you can ping the target computer and that no network firewalls are blocking port 3389 between the two machines.
