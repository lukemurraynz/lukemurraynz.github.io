import React from 'react';
import {PageMetadata} from '@docusaurus/theme-common';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';

function resolveHeaderImage(header: unknown): string | undefined {
  if (typeof header === 'string') return header;
  if (header && typeof header === 'object' && typeof (header as {teaser?: unknown}).teaser === 'string') {
    return (header as {teaser: string}).teaser;
  }
  return undefined;
}

// Bare co-located filenames (no "/", not a URL) are post assets that only
// resolve once webpack hashes them via an inline markdown/MDX reference —
// there's no way to derive that hashed path from a plain frontmatter string,
// so guessing here would produce a broken image link. Only trust values that
// are already a static-root-relative path or a full URL.
function isSafeImagePath(value: string): boolean {
  return value.includes('/') || value.startsWith('http');
}

export default function BlogPostPageMetadata(): JSX.Element {
  const {assets, metadata} = useBlogPost();
  const {title, description, date, tags, authors, frontMatter} = metadata;
  const {keywords} = frontMatter;

  const headerImage = resolveHeaderImage((frontMatter as Record<string, unknown>).header);
  const safeHeaderImage = headerImage && isSafeImagePath(headerImage) ? headerImage : undefined;

  // Legacy Jekyll frontmatter (`header` / `header.teaser`) predates the native
  // `image` field docusaurus reads here, so it's a fallback, not an override.
  const image = assets.image ?? frontMatter.image ?? safeHeaderImage;

  return (
    <PageMetadata
      title={frontMatter.title_meta ?? title}
      description={description}
      keywords={keywords}
      image={image}>
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={date} />
      {authors.some((author) => author.url) && (
        <meta
          property="article:author"
          content={authors
            .map((author) => author.url)
            .filter(Boolean)
            .join(',')}
        />
      )}
      {tags.length > 0 && (
        <meta
          property="article:tag"
          content={tags.map((tag) => tag.label).join(',')}
        />
      )}
    </PageMetadata>
  );
}
