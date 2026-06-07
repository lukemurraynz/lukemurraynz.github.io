import React from 'react';
import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';

interface BlogSEOProps {
  title?: string;
  description?: string;
  frontMatter?: any;
  permalink?: string;
  date?: string;
  tags?: Array<{label: string}>;
  authors?: Array<{name: string}>;
}

export default function BlogSEO(props: BlogSEOProps) {
  const location = useLocation();
  const {
    title = '',
    description = '',
    frontMatter = {},
    permalink = location.pathname,
    date = '',
    tags = [],
    authors = []
  } = props;

  // Get first author for JSON-LD
  const author = authors?.[0];
  const fullUrl = `https://luke.geek.nz${permalink}`;
  
  // Use custom meta description or excerpt
  const metaDescription = frontMatter.metaDescription || frontMatter.description || description || title;
  
  // Generate keywords from tags and frontmatter
  const keywords = [
    ...(frontMatter.keywords || []),
    ...tags.map(tag => tag.label),
    'Azure', 'Microsoft', 'Cloud Computing', 'Technical Blog'
  ].join(', ');

  // Schema.org JSON-LD for BlogPosting
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": metaDescription,
    "url": fullUrl,
    "datePublished": date,
    "dateModified": frontMatter.lastmod || date,
    "author": {
      "@type": "Person",
      "name": author?.name || "Luke Murray",
      "url": "https://luke.geek.nz/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "luke.geek.nz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://luke.geek.nz/img/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "keywords": keywords,
    "articleSection": "Technology",
    "inLanguage": "en-US"
  };

  // Add image to JSON-LD if available
  if (frontMatter.image || frontMatter.header?.teaser) {
    const imageUrl = frontMatter.image || frontMatter.header?.teaser;
    jsonLd.image = {
      "@type": "ImageObject",
      "url": imageUrl.startsWith('http') ? imageUrl : `https://luke.geek.nz${imageUrl}`,
      "width": 1200,
      "height": 630
    };
  }

  // VideoObject JSON-LD for embedded videos
  const videoData = frontMatter.video;
  const videoJsonLd = videoData ? {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": videoData.title,
    "description": videoData.description,
    "thumbnailUrl": videoData.thumbnailUrl,
    "uploadDate": videoData.uploadDate,
    "contentUrl": videoData.url,
    "embedUrl": videoData.url?.replace('watch?v=', 'embed/'),
    "publisher": {
      "@type": "Organization",
      "name": "luke.geek.nz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://luke.geek.nz/img/logo.png"
      }
    }
  } : null;

  return (
    <Head>
      {/* Supplemental tags not emitted by Docusaurus natively */}
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author?.name || "Luke Murray"} />

      {/* twitter:image:alt is not added by Docusaurus */}
      {(frontMatter.image || frontMatter.header?.teaser) && (
        <meta name="twitter:image:alt" content={title} />
      )}

      {/* JSON-LD structured data — not provided by Docusaurus */}
      {date && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
      {videoJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(videoJsonLd)}
        </script>
      )}
    </Head>
  );
}