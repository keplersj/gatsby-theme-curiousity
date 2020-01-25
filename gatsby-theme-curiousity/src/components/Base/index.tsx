import * as React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

import "modern-normalize";
import "starstuff-style";

export interface BaseLayoutData {
  site: {
    siteMetadata: {
      title: string;
      siteUrl: string;
    };
  };
}

interface Props {
  title?: string;
  description?: string;
}

const BaseLayout = (
  properties: React.PropsWithChildren<Props>
): React.ReactElement<React.PropsWithChildren<Props>> => {
  const data = useStaticQuery<BaseLayoutData>(graphql`
    query CuriousityBaseLayoutData {
      site {
        siteMetadata {
          title
          siteUrl
        }
      }
    }
  `);

  return (
    <main>
      <Helmet
        titleTemplate={`%s | ${data.site.siteMetadata.title}`}
        defaultTitle={data.site.siteMetadata.title}
      >
        <html lang="en" />
        {properties.title && <title>{properties.title}</title>}
        {properties.description && (
          <meta name="description" content={properties.description} />
        )}
        <meta
          property="og:title"
          content={
            (properties.title &&
              `${properties.title} | ${data.site.siteMetadata.title}`) ||
            data.site.siteMetadata.title
          }
        />
        <meta property="og:url" content={data.site.siteMetadata.siteUrl} />
        {properties.description && (
          <meta property="og:description" content={properties.description} />
        )}
      </Helmet>

      {properties.children}
    </main>
  );
};

export default BaseLayout;
