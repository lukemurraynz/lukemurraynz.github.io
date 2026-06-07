import React from 'react';
import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';

interface BlogSEOProps {
  title?: string;
  description?: string;
  frontMatter?: BlogFrontMatter;
  permalink?: string;
  date?: string;
  tags?: Array<{label: string}>;
  authors?: Array<{name: string}>;
}

interface BlogFrontMatter {
  description?: string;
  header?: {
    teaser?: unknown;
  };
  image?: unknown;
  keywords?: unknown;
  lastmod?: string;
  metaDescription?: string;
  metaTitle?: string;
  title_meta?: string;
  video?: BlogVideoFrontMatter;
}

interface BlogVideoFrontMatter {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  url?: string;
}

interface BlogPostingJsonLd {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: {
    "@type": "Person";
    name: string;
    url: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
  keywords: string;
  articleSection: string;
  inLanguage: string;
  image?: {
    "@type": "ImageObject";
    url: string;
    width: number;
    height: number;
  };
}

function getFrontMatterImage(frontMatter: BlogFrontMatter): string | undefined {
  const image = frontMatter.image || frontMatter.header?.teaser;

  return typeof image === 'string' && image ? image : undefined;
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
  const metaTitle = frontMatter.title_meta || frontMatter.metaTitle;
  
  // Use custom meta description or excerpt
  const metaDescription = frontMatter.metaDescription || frontMatter.description || description || title;
  const imageUrl = getFrontMatterImage(frontMatter);
  const absoluteImageUrl = imageUrl?.startsWith('http') ? imageUrl : imageUrl ? `https://luke.geek.nz${imageUrl}` : undefined;
  
  // Generate keywords from tags and frontmatter
  const frontMatterKeywords = Array.isArray(frontMatter.keywords)
    ? frontMatter.keywords.filter((keyword): keyword is string => typeof keyword === 'string')
    : [];
  const keywords = [
    ...frontMatterKeywords,
    ...tags.map(tag => tag.label),
    'Azure', 'Microsoft', 'Cloud Computing', 'Technical Blog'
  ].join(', ');

  const jsonLd: BlogPostingJsonLd | undefined = date ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": metaTitle || title,
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
    "inLanguage": "en-US",
    ...(absoluteImageUrl ? {
      "image": {
        "@type": "ImageObject",
        "url": absoluteImageUrl,
        "width": 1200,
        "height": 630
      }
    } : {})
  } : undefined;

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
      {/* author is already set globally in headTags; only override here when the post has a named author */}
      {author?.name && <meta name="author" content={author.name} />}
      {metaTitle && <meta property="og:title" content={metaTitle} />}

      {/* Override description/og:description when frontMatter.metaDescription is explicitly set */}
      {frontMatter.metaDescription && (
        <>
          <meta name="description" content={frontMatter.metaDescription} />
          <meta property="og:description" content={frontMatter.metaDescription} />
        </>
      )}

      {/* twitter:image:alt is not added by Docusaurus */}
      {imageUrl && (
        <meta name="twitter:image:alt" content={title} />
      )}

      {/* JSON-LD structured data — not provided by Docusaurus */}
      {jsonLd && (
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
