import React from "react";
import styled from "@emotion/styled";
import BaseLayout from "../Base";
import { Helmet } from "react-helmet";
import { MDXRenderer } from "gatsby-plugin-mdx";

const Content = styled.div`
  max-width: 55em;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 55em) {
    margin-left: 2em;
    margin-right: 2em;
  }
`;

interface Props {
  data: {
    portfolioItem: {
      id: string;
      excerpt: string;
      body: any;
      slug: string;
      title: string;
      tags: string[];
      keywords: string[];
    };
  };
}

const ProjectPageTemplate = ({
  data: { portfolioItem: piece }
}: Props): React.ReactElement<Props> => (
  <>
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "http://www.schema.org",
          "@type": "WebPage",
          name: `${piece.title} | Kepler Sticka-Jones`,
          description: piece.excerpt,
          url: piece.slug,
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@id": "https://keplersj.com/",
                  name: "Kepler Sticka-Jones"
                }
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@id": "https://keplersj.com/projects/",
                  name: "Projects"
                }
              },
              {
                "@type": "ListItem",
                position: 3,
                item: {
                  "@id": `https://keplersj.com${piece.slug}`,
                  name: piece.title
                }
              }
            ]
          }
        })}
      </script>
    </Helmet>

    <BaseLayout title={piece.title} description={piece.excerpt}>
      <Content>
        <h1>{piece.title}</h1>
        {/* <br /> */}
        <section>
          <MDXRenderer>{piece.body}</MDXRenderer>
        </section>
      </Content>
    </BaseLayout>
  </>
);

export default ProjectPageTemplate;
