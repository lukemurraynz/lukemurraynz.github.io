import React, {type ReactNode} from 'react';
import BlogPostPage from '@theme-original/BlogPostPage';
import type BlogPostPageType from '@theme/BlogPostPage';
import type {WrapperProps} from '@docusaurus/types';
import BlogSEO from '../../components/BlogSEO';

type Props = WrapperProps<typeof BlogPostPageType>;

export default function BlogPostPageWrapper(props: Props): ReactNode {
  // Extract blog post metadata for SEO
  const { content } = props;
  const { metadata, frontMatter } = content;
  
  return (
    <>
      <BlogSEO 
        title={metadata?.title}
        description={metadata?.description}
        frontMatter={frontMatter}
        permalink={metadata?.permalink}
        date={metadata?.date}
        tags={metadata?.tags}
        authors={metadata?.authors}
      />
      <BlogPostPage {...props} />
    </>
  );
}
