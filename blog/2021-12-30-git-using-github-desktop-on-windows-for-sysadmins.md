---
title: Git using Github Desktop on Windows for SysAdmins
authors: [Luke]
tags:
  - Windows
date: 2021-12-30 00:00:00 +1300
toc: true
header:
  teaser: /uploads/githubdesktop-overview.png
---

[Git](https://en.wikipedia.org/wiki/Git) (_Git is software for tracking changes in any set of files, usually used for coordinating work among programmers collaboratively developing source code during software development, allowing versioning, source control and enablement of continuous Integration and deployment)_has been around for years_(development and the first release began in 2005 by Linus Torvolds)_.

Although primary driven and consumed by software developers – it is now a staple of everyday life for an IT professional of many disciplines _(i.e. Operations, Delivery),_ even if a git repository is used to store your PowerShell scripts _(hint – it should!)_.

You don't have to know every single git command line syntax to use Git.

Tools such as Visual Studio Code allows you to utilize git source control efficiently, and of course, you can use Git directly from the command line; however, sometimes you want an easy way to leverage Git through a point and click interface, there a lot of tools out there to give you easy access to Git, but today I will concentrate on Github Desktop.

If you are looking at something a bit more powerful _(especially if you are wanting to do submodules)_, then I suggest [Atlassian Sourcetree](https://www.atlassian.com/software/sourcetree "Atlassian Sourcetree").

Introducing Github Desktop... _"Focus on what matters instead of fighting with Git. Whether you're new to Git or a seasoned user, GitHub Desktop simplifies your development workflow."_

![Github Desktop - Overview](/uploads/githubdesktop-overview.png "Github Desktop - Overview")

Github Desktop gives you a clean, light and easy to use tool to work with git repositories that is constantly [kept up to date](https://github.com/desktop/desktop "Github Desktop - Github") and improved upon!

Although Github Desktop is published by Github – this doesn't mean you cannot use a git repository hosted by another provider, such as Azure DevOps.

This article assumes that you have a Git repository initialized already; you can create free repositories from [Azure DevOps](https://azure.microsoft.com/en-us/services/devops/?nav=min&WT.mc_id=AZ-MVP-5004796 "Azure DevOps") or [Github](https://github.com/ "GitHub"). Microsoft owns Azure DevOps and Github; personally, I have moved from Azure DevOps to Github for my git repositories but utilize AzureDevOps pipelines.

![Git High level workflow](/images/posts/HLGit_Workflow.png "Git High level workflow")

### Install Github Desktop

Installation of Github Desktop is pretty simple, but assuming you have rights to install the software:

1. In your web browser, navigate to [Github Desktop](https://desktop.github.com/) homepage and click on: **Download**
2. ![Github Desktop - Download](/uploads/githubdesktop-download.png "Github Desktop - Download")
3. Once it's downloaded, you should have a file such as GitHubDesktopSetup-x64.exe _(it should only take a few seconds, the file is about 109 MB at the time this article was written),_ then **run** it to **install**.
4. ![Github Desktop - Installing](/uploads/githubdesktop-installing.png "Github Desktop - Installing")

Congratulations, you have now installed Github Desktop!

### Add your Azure DevOps repository

If you have an Azure DevOps git repository, then follow the steps below – if you have chosen to go: Github, then feel free to skip this section for the next.

 1. Sign in to [**Azure DevOps**](https://azure.microsoft.com/en-us/services/devops/?nav=min&WT.mc_id=AZ-MVP-5004796 "Azure DevOps")
 2. **Navigate** to the **project** you want to add to Github Desktop
 3. Click on **Repos**, **Files**
 4. ![Azure DevOps - Repo](/uploads/azuredevops-repos.png "Azure DevOps - Repo")
 5. In the address bar, you will see your **URL**, and it should look like this: [https://dev.azure.com/%username%/_git/%projectname%](https://dev.azure.com/%username%/_git/%projectname% "https://dev.azure.com/%username%/_git/%projectname%")
 6. **Copy** the **URL** and **open Github Desktop**
 7. Click on **File** and **Clone a repository**
 8. Click on **URL**
 9. ![Github Desktop - Clone a Repository](/uploads/githubdesktop-clonearepo.png "Github Desktop - Clone a Repository")
10. **Paste** in the **repository URL** you copied earlier.
11. **Select** the Local **path** of where you want the Git **repository to be saved** locally on your device
12. Now we need to **generate** git **credentials** to clone your repository, navigate back to Azure DevOps.
13. ![Azure DevOps - Clone](/uploads/azuredevops-clonerepo.png "Azure DevOps - Clone")
14. Click on **Generate** Git **Credentials**
15. Azure DevOps will now generate the username and password that will be used by Github Desktop to authenticate with your git repository.
16. **Navigate** back to **Github Desktop**
17. Click **Clone**
18. **Enter** in the **username** and **password** that you received from the git credentials, generated by Azure DevOps and click **Clone**.
19. Github Desktop should now **clone** your **repository locally**.

Congratulations, you have set up an Azure DevOps git repository using Github Desktop.

### Add your Github repository.

If you have an Azure DevOps git repository, follow the steps above – otherwise, follow these steps to add your Github repository into Github Desktop.

1. Open **Github Desktop**
2. Click **File**
3. Click **Clone repository….**
4. ![Github Desktop - Clone repository](/uploads/githubdesktop-cloneareposnap.png "Github Desktop - Clone repository")
5. On the **Github.com tab**, **enter** your Github **credentials**
6. **Select** the Local **path** of where you want the Git **repository** to be **saved** locally on your device
7. Click **Clone**

Congratulations, you have now set up a Github git repository using Github Desktop.

### Using Github Desktop

Now that you have a git repository cloned locally, it's time to use it.

#### Initial Commit

Once you have a file created and saved into the folder of your git repository, i.e. a PowerShell script, you will want to commit it to the git repository.

 1. Open **Github Desktop**
 2. Click on: **Current repository** to make sure your repository is selected.
 3. ![Github Desktop - Initial Commit](/uploads/githubdesktop-initialhelloworld.png "Github Desktop - Initial Commit")
 4. In my example, I have created a new file called: HelloWorld.ps1 in my PowerShell repository.
 5. What you can see in the screenshot below is the various components that make up the Github Desktop; you can see the changed file _(i.e. the new file)_, the contents of the file and what will be added, the commit title and the all-important commit description.
 6. ![Github Desktop - Overview](/uploads/githubdesktop-productoverview.png "Github Desktop - Overview")
 7. You can **change** the **title** to something more appropriate if you want, but with your commit **description**, this is what you will use for versioning and seeing what changes you made in the future from a quick glance – make sure it's an appropriate description and click **Commit** to master.
 8. Committing it to master does not push it to its 'Origin'. I.e. the actual remote git repository _(stored in Github or Azure DevOps)_ will commit to the local git repository. This allows you to work on code locally without requiring every change to be uploaded to a local repository. In order to commit to the Origin and remote repository, click on: **Push Origin**.
 9. ![Github Desktop - Header](/uploads/githubdesktop-header.png "Github Desktop - Header")
10. Once it has been committed, you should be able to see the file on the origin git repository, and you can Push multiple local git changes at once.
11. If you click on: **History** should now **see your commit** with your file and description _(as you can see, I was using an old PowerShell repository that I had merged into other repositories since then but thought it was worth using it for this article)._
12. ![Github Desktop - Initial commit](/uploads/githubdesktop-initialhelloworldcommit.png "Github Desktop - Initial commit")

Congratulations, you now committed your first file into Git! It wasn't that difficult!

#### Restore file from the previous version

One of the benefits of using Git is version control and restoring a file if something stops working, or someone had an 'Oops!' moment! With Github Desktop, restoring a previous version is straightforward.

1. Open **Github Desktop**
2. Click on: **Current repository** to make sure your repository is selected
3. Click on **History** _(you may need to click Fetch Origin if files have been updated remotely)_
4. As you can see, someone _(i.e. Luke Murray)_ has **made a** **change** to my' HelloWorld. ps1'' file, to be: "I like Unicorn" and changed the background and foreground colour to be both Yellow'.
5. I can **right-click** that **file** and select **Revert changes** in the commit using Github Desktop.
6. ![Github Desktop - Revert changes](/uploads/githubdesktop-revertchanges.png "Github Desktop - Revert changes")
7. You will now have a new entry in the History that will revert the commit, and you can quickly **push it** back to **Origin** again.

Congratulations, you have successfully reverted a commit to a previous version using Github Desktop.

#### Working with branches

A significant function of Git is the ability to create and use branches. Branches allow you to work on features without touching the main or master branch _(where you can have your production or thoroughly tested resources, for example)_.

 1. Open **Github Desktop**
 2. Click on: **Current repository** to make sure your repository is selected
 3. To **create** a branch, click on the **Current branch** and select **New branch** and give it a name, _i.e. Dev_
 4. **Make** a **change** to the **file** like you typically would and **save**
 5. Github Desktop has automatically added your changes, and you can **commit** them to the **dev branch** without touching master.
 6. ![Github Desktop - Branch commit](/uploads/githubdesktop-branchcommit.png "Github Desktop - Branch commit")
 7. If you navigate to the master branch, you can see that the file has remained untouched. All the control and versioning is done by Git!
 8. When you are **ready** to **merge** the dev branch into master, click the **current branch**.
 9. Select: **Choose a branch** to **merge** into master
10. **Select** your **branch**, _i.e. Dev_
11. ![Github Desktop - Merge branch](/uploads/githubdesktop-branchmerge.png "Github Desktop - Merge branch")
12. Click on **create a merge commit**.
13. You should see a message in Github notifying that the merge was successful, and you can **push** your **changes** to the **origin** repository.
14. Github Desktop should redirect you to the master branch, and you can **now see** your **changes**:
15. ![Github Desktop ](/uploads/githubdesktop-branchcommited.png)
16. You can go back to using Dev to develop additional features, testing etc. and repeat the same process.

Using a master branch allows others to get production-ready scripts or code, or avoid automation around continuous deployment to production resources, while you may be still working on functionality that you don't quite want to be released yet.

Hopefully, this article gives you an excellent base to start your git journey! 

There is a lot more functionality built into Github Desktop, especially around branching, but for day to day use, the above should give you all you need! 

It is also worth reading this article on the .[gitignore](https://www.atlassian.com/git/tutorials/saving-changes/gitignore " .gitignore ") file, to make sure your git repositories don't end up bloated by unwanted files and you are only committing the files you need to be.
