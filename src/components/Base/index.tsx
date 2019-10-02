import * as React from "react";
import { Helmet } from "react-helmet";
import { Global, css } from "@emotion/core";
import { useStaticQuery, graphql } from "gatsby";

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
    <>
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

      <Global
        styles={css`
          html {
            background-color: #fff;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            min-width: 300px;
            overflow-x: hidden;
            overflow-y: scroll;
            text-rendering: optimizeLegibility;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            text-size-adjust: 100%;
          }
          *,
          ::after,
          ::before {
            box-sizing: inherit;
          }
          blockquote,
          body,
          dd,
          dl,
          dt,
          fieldset,
          figure,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          hr,
          html,
          iframe,
          legend,
          /* li, */
          /* ul, */
          ol,
          /* p, */
          /* pre, */
          textarea {
            margin: 0;
            padding: 0;
          }
          body,
          button,
          input,
          select,
          textarea {
            font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              Helvetica, Arial, sans-serif;
          }
          body {
            color: #4a4a4a;
            font-size: 1em;
            font-weight: 400;
            line-height: 1.5;
          }
          a {
            color: #4a4a4a;
          }
          @media (prefers-color-scheme: dark) {
            html,
            body {
              background-color: #4a4a4a;
              color: white;
            }
            a {
              color: white;
            }
            /* For some reason Atom One Dark is setting this element to black, manual override. */
            span.mtk1 {
              color: white !important;
            }
          }
        `}
      />

      <main>{props.children}</main>
    </>
  );
};

export default BaseLayout;
