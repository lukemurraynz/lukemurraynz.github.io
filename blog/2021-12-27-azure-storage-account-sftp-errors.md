---
title: Azure Storage Account SFTP errors
authors: [Luke]
tags:
  - Azure
date: 2021-12-27 00:00:00 +1300
toc: true
header:
  teaser: images/iazure-marketplace-banner.png
slug: azure/azure-storage-account-sftp-errors
---

As part of standing up and using an Azure Storage account as an SFTP service, I ran into a few issues. This blog post is merely intended to show my findings in case others run into similar issues.

#### PTY allocation request failed on channel 0

Even though you appear to have connected successfully, you may see the following errors:

* PTY allocation request failed on channel 0
* shell request failed on channel 0

You may laugh, but the solution for this was very simple, switch from SSH to **SFTP**!

If you were like me, I just flicked to SSH as a habit.

#### Home Directory is not accessible

Make sure that the Home directory _(Folder)_ is created in your container, SFTP won't create this for you.

Also make sure that the Home directory for the user, references Container/Folder, like the below:

![Azure Portal - Enable SFTP](/uploads/AzurePortal_SFTPLocalUsercreate.png "Azure Portal - Enable SFTP")

#### Wrong username, authentication failed

When attempting to connect to SFTP using a tool such as WinSCP, I got: 

* Using username "lukeftpuser".
* Authentication failed.

The username is actually comprised of:

STORAGEACCOUNTNAME+FTPNAME, ie: sftpstorageacc1337.lukeftpuser

![WinSCP Connection Azure SFTP](/uploads/sftp_winscptest.png "WinSCP Connection Azure SFTP")

#### Unable to find Azure Storage SSH Keys

This is not an error, but Azure Keyvault, does not currently support SSH keypairs, so once they are created by Azure, they are stored in a Microsoft.Compute.sshPublicKeys resource found here: [SSH Keys](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Compute%2FsshPublicKeys "SSH Keys")
