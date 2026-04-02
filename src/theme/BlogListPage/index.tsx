import React, {type ReactNode} from 'react';
import BlogListPage from '@theme-original/BlogListPage';
import type BlogListPageType from '@theme/BlogListPage';
import type {WrapperProps} from '@docusaurus/types';
import Head from '@docusaurus/Head';

type Props = WrapperProps<typeof BlogListPageType>;

export default function BlogListPageWrapper(props: Props): ReactNode {
  const {metadata} = props;
  const isPaginated = metadata.page > 1;

  return (
    <>
      {isPaginated && (
        <Head>
          <meta name="robots" content="noindex, follow" />
        </Head>
      )}
      <BlogListPage {...props} />
    </>
  );
}
