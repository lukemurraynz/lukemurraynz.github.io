// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "luke.geek.nz",
  tagline:
    "Microsoft MVP - Microsoft Azure ☁, Technical Consultant, Azure Solutions Architect Expert, Technologist and a drinker of coffee.detect",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://luke.geek.nz",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "lukemurraynz", // Usually your GitHub org/user name.
  projectName: "lukemurraynz", // Usually your repo name.
  deploymentBranch: "gh-pages",
  trailingSlash: true,
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  themes: ["@docusaurus/theme-mermaid"],
  markdown: {
    mermaid: true,
    format: "detect",
  },

  plugins: ["plugin-image-zoom"],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false, // Optional: disable the docs plugin
        blog: {
          routeBasePath: "/", // Serve the blog at the site's root
          showReadingTime: true,
          blogTitle: "Lukes Tech Blog - Unleashing the power of the cloud and other technologies!",
          blogDescription: "Embark on a tech journey with Luke, a Microsoft Azure MVP, as he delves into the cutting-edge realm of Microsoft and Azure Cloud technologies. Explore, learn, and stay ahead in the dynamic world of cloud computing!",
          postsPerPage: 5,
          onUntruncatedBlogPosts: 'ignore',
          blogSidebarTitle: "Recent posts",
          blogSidebarCount: 5,
          feedOptions: {
            type: "all",
            copyright: `Copyright © ${new Date().getFullYear()} luke.geek.nz.`,
          },
        },

        theme: {
          customCss: "./src/css/custom.css",
        },
        gtag: {
          trackingID: "G-0QDLBY7NNN",
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: "gfe-2", // Increment on change,
        backgroundColor: "#D3D3D3",
        content: `If you haven't already make sure you sign up for my Weekly Azure Newsletter, straight to your inbox! <a target="_blank" rel="noopener noreferrer" href="https://newsletter.azurefeeds.com/join">Subscribe now!</a>`,
        isCloseable: true,
      },

      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      // Replace with your project's social card
      image: "img/social-card.png",
      navbar: {
        title: "luke.geek.nz",
        logo: {
          alt: "luke.geek.nz",
          src: "img/logo.png",
        },
        hideOnScroll: false,
        items: [
          {
            label: "Tags",
            href: "/Tags/",
            position: "left",
          },
          {
            label: "Blog",
            href: "/Archive/",
            position: "left",
          },
          {
            label: "About",
            href: "/about/",
            position: "left",
          },
          {
            href: "https://www.youtube.com/channel/UCUG3TKDTAZz4UXshGrjBBoQ",
            position: "right",
            className: "navbar-icon",
            "aria-label": "YouTube",
            html: `
              <svg width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M23.498,6.186c-0.273-1.186-1.143-2.144-2.332-2.417C18.389,3.153,12,3.153,12,3.153s-6.389,0-9.166,0.616
                  c-1.19,0.273-2.06,1.23-2.332,2.417C0,8.07,0,12,0,12s0,3.93,0.502,5.814c0.272,1.187,1.142,2.062,2.332,2.335
                  C5.611,20.847,12,20.847,12,20.847s6.389,0,9.166-0.698c1.189-0.273,2.059-1.148,2.332-2.335C24,15.93,24,12,24,12
                  S24,8.07,23.498,6.186z M9.545,15.568V8.432l6.545,3.568L9.545,15.568z"/>
              </svg>
            `,
          },
          {
            href: "https://aus.social/@lukemurray",
            position: "right",
            className: "navbar-icon",
            "aria-label": "Mastodon",
            html: `
              <svg height="20" width="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M21.327 8.566c0-4.339-2.843-5.61-2.843-5.61-1.433-.658-3.894-.935-6.451-.956h-.063c-2.557.021-5.016.298-6.45.956 0 0-2.843 1.272-2.843 5.61 0 .993-.019 2.181.012 3.441.103 4.243.778 8.425 4.701 9.463 1.809.479 3.362.579 4.612.510 2.268-.126 3.541-.809 3.541-.809l-.075-1.646s-1.621.511-3.441.449c-1.804-.062-3.707-.194-3.999-2.409a4.523 4.523 0 0 1-.04-.621s1.77.433 4.014.536c1.372.063 2.658-.08 3.965-.236 2.506-.299 4.688-1.843 4.962-3.254.434-2.223.398-5.424.398-5.424zm-3.353 5.59h-2.081V9.057c0-1.075-.452-1.62-1.357-1.62-1 0-1.501.647-1.501 1.927v2.791h-2.069V9.364c0-1.28-.501-1.927-1.502-1.927-.905 0-1.357.546-1.357 1.62v5.099H6.026V8.903c0-1.074.273-1.927.823-2.558.566-.631 1.307-.955 2.228-.955 1.065 0 1.872.409 2.405 1.228l.518.869.519-.869c.533-.819 1.34-1.228 2.405-1.228.92 0 1.662.324 2.228.955.549.631.822 1.484.822 2.558v5.253z"></path>
                </g>
              </svg>
            `,
          },
          {
            href: "https://bsky.app/profile/lukemurraynz.bsky.social",
            position: "right",
            className: "navbar-icon",
            "aria-label": "Bluesky",
            html: `
              <svg class="octicon" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 16 16" height="20" width="20" fill="currentColor">
                <title>Bluesky</title>
                <path d="M8 7.2c-.72-1.4-2.7-4.04-4.53-5.33C1.7.63 1.04.84.6 1.04.1 1.27 0 2.05 0 2.51c0 .46.25 3.77.42 4.32.54 1.82 2.47 2.45 4.25 2.25-2.6.38-4.92 1.33-1.88 4.71 3.33 3.46 4.57-.74 5.21-2.87.64 2.13 1.37 6.18 5.16 2.87 2.84-2.87.78-4.33-1.83-4.71 1.78.2 3.71-.43 4.25-2.25.17-.55.42-3.86.42-4.32 0-.46-.09-1.24-.6-1.47-.44-.2-1.11-.42-2.87.83A17.87 17.87 0 0 0 8 7.2Z"></path>
              </svg>
            `,
          },
          {
            href: "https://twitter.com/lukemurraynz",
            position: "right",
            className: "navbar-icon",
            "aria-label": "X",
            html: `<svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414L10 8.586z" clip-rule="evenodd" />
          </svg>`,
          },
        
          {
            href: "https://www.linkedin.com/in/ljmurray/",
            position: "right",
            className: "navbar-icon",
            "aria-label": "LinkedIn",
            html: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"></path></svg>`,
          },
      {
          href: "https://luke.geek.nz/rss",
          position: "right",
          className: "header-rss-link", // custom logo in custom.css
          "aria-label": "RSS",
        },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} luke.geek.nz. Powered by coffee, clouds and hamsters on wheels!`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: [
          "powershell",
          "bash",
          "python",
          "bicep",
          "yaml",
          "log",
          "hcl",
          "json",
        ],
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5,
      },
    algolia: {
      // The application ID provided by Algolia
      appId: 'ZBH2T1WJQD',

      // Public API key: it is safe to commit it
      apiKey: '62f58247ec020d11cd9d655e22b5fc6d',

      indexName: 'luke-geek',
  contextualSearch: false,
      searchPagePath: false,
    },
    }),
};

export default config;
