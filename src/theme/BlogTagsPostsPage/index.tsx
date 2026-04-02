import React, {type ReactNode} from 'react';
import BlogTagsPostsPage from '@theme-original/BlogTagsPostsPage';
import type BlogTagsPostsPageType from '@theme/BlogTagsPostsPage';
import type {WrapperProps} from '@docusaurus/types';
import Head from '@docusaurus/Head';

type Props = WrapperProps<typeof BlogTagsPostsPageType>;

export default function BlogTagsPostsPageWrapper(props: Props): ReactNode {
  const {listMetadata} = props;
  const isPaginated = listMetadata.page > 1;

  return (
    <>
      {isPaginated && (
        <Head>
          <meta name="robots" content="noindex, follow" />
        </Head>
      )}
      <BlogTagsPostsPage {...props} />
    </>
  );
}
