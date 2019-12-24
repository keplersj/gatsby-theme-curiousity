import * as React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

import "modern-normalize";
import "starstuff-style";

interface Props {
  title?: string;
  description?: string;
}

const BaseLayout = (
  props: React.PropsWithChildren<Props>
): React.ReactElement<React.PropsWithChildren<Props>> => {
  const data = useStaticQuery(graphql`
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
        {props.title && <title>{props.title}</title>}
        {props.description && (
          <meta name="description" content={props.description} />
        )}
        <meta
          property="og:title"
          content={
            (props.title &&
              `${props.title} | ${data.site.siteMetadata.title}`) ||
            data.site.siteMetadata.title
          }
        />
        <meta property="og:url" content={data.site.siteMetadata.siteUrl} />
        {props.description && (
          <meta property="og:description" content={props.description} />
        )}
      </Helmet>

      {props.children}
    </main>
  );
};

export default BaseLayout;
