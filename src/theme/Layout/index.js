import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import Head from '@docusaurus/Head';

export default function Layout(props) {
  return (
    <>
      <Head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* Critical CSS for faster initial render */}
        <style>
          {`
            /* Critical CSS for above-the-fold content */
            html {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.65;
            }
            .navbar {
              background-color: var(--ifm-navbar-background-color);
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
            }
            [data-theme='dark'] .navbar {
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
            }
            /* Prevent layout shift */
            .navbar__brand {
              min-height: 2rem;
            }
            /* Optimize image loading and prevent layout shift */
            img {
              height: auto;
              max-width: 100%;
            }
            /* Critical blog post styling */
            .markdown h1 {
              font-size: 2.5rem;
              font-weight: 600;
              line-height: 1.2;
              margin-bottom: 1rem;
            }
            .markdown h2 {
              font-size: 2rem;
              font-weight: 600;
              line-height: 1.3;
              margin-top: 2rem;
              margin-bottom: 1rem;
            }
          `}
        </style>
      </Head>
      <OriginalLayout {...props} />
    </>
  );
}