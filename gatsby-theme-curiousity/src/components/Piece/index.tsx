import React from "react";
import styled from "@emotion/styled";
import BaseLayout from "../Base";
import { graphql, useStaticQuery, PageRendererProps } from "gatsby";
import { remarkForm, DeleteAction } from "gatsby-tinacms-remark";
import Image, { FluidObject } from "gatsby-image";
import { JsonLd } from "react-schemaorg";
import { ImageObject, CreativeWork } from "schema-dts";

const Content = styled.article`
  max-width: 55em;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 55em) {
    margin-left: 2em;
    margin-right: 2em;
  }
`;

const SupportingDetail = styled.span`
  :not(:last-of-type) {
    ::after {
      content: " · ";
    }
  }
`;

interface Props extends PageRendererProps {
  data: {
    portfolioItem: {
      id: string;
      excerpt: string;
      html: string;
      slug: string;
      title: string;
      tags: string[];
      keywords: string[];
      featuredImage?: {
        childImageSharp: {
          fluid: FluidObject;
        };
      };
      metadata: {
        type?: string[];
        status?: string[];
        role?: string[];
        homepage?: string;
        rubygemsGemName?: string;
        npmPackageName?: string;
        githubRepo?: string;
      };
    };
  };
}

const ProjectPageTemplate = ({
  data: { portfolioItem: piece },
  location
}: Props): React.ReactElement<Props> => {
  const staticQuery = useStaticQuery(graphql`
    query CuriosityPostQuery {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);

  return (
    <BaseLayout title={piece.title} description={piece.excerpt}>
      <Content>
        <JsonLd<CreativeWork>
          item={{
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "@id": `${staticQuery.site.siteMetadata.siteUrl}${location.pathname}`,
            url: `${staticQuery.site.siteMetadata.siteUrl}${location.pathname}`,
            headline: piece.title,
            name: piece.title,
            mainEntityOfPage: `${staticQuery.site.siteMetadata.siteUrl}${location.pathname}`,
            image: piece.featuredImage && {
              "@type": "ImageObject",
              "@id": `${staticQuery.site.siteMetadata.siteUrl}${piece.featuredImage.childImageSharp.fluid.src}`
            }
          }}
        />
        <header>
          <h1>{piece.title}</h1>
          <div>
            {piece.metadata.type && (
              <SupportingDetail>
                {"Type".toLocaleUpperCase()}:{" "}
                {piece.metadata.type
                  .map(type => type.toLocaleUpperCase())
                  .join(", ")}{" "}
              </SupportingDetail>
            )}
            {piece.metadata.status && (
              <SupportingDetail>
                {"Status".toLocaleUpperCase()}:{" "}
                {piece.metadata.status
                  .map(type => type.toLocaleUpperCase())
                  .join(", ")}{" "}
              </SupportingDetail>
            )}
            {piece.metadata.role && (
              <SupportingDetail>
                {"Role".toLocaleUpperCase()}:{" "}
                {piece.metadata.role
                  .map(role => role.toLocaleUpperCase())
                  .join(", ")}{" "}
              </SupportingDetail>
            )}
            {piece.metadata.homepage && (
              <SupportingDetail>
                <a href={piece.metadata.homepage}>
                  {"Homepage".toLocaleUpperCase()}
                </a>{" "}
              </SupportingDetail>
            )}
            {piece.metadata.githubRepo && (
              <SupportingDetail>
                <a href={`https://www.github.com/${piece.metadata.githubRepo}`}>
                  {"GitHub".toLocaleUpperCase()}
                </a>{" "}
              </SupportingDetail>
            )}
            {piece.metadata.npmPackageName && (
              <SupportingDetail>
                <a
                  href={`https://www.npmjs.com/package/${piece.metadata.npmPackageName}`}
                >
                  {"npm".toLocaleUpperCase()}
                </a>{" "}
              </SupportingDetail>
            )}
            {piece.metadata.rubygemsGemName && (
              <SupportingDetail>
                <a
                  href={`https://rubygems.org/gems/${piece.metadata.rubygemsGemName}`}
                >
                  {"RubyGems".toLocaleUpperCase()}
                </a>{" "}
              </SupportingDetail>
            )}
          </div>
          {piece.featuredImage && (
            <figure id="featured-image">
              <JsonLd<ImageObject>
                item={{
                  "@context": "https://schema.org",
                  "@type": "ImageObject",
                  "@id": `${staticQuery.site.siteMetadata.siteUrl}${piece.featuredImage.childImageSharp.fluid.src}`,
                  representativeOfPage: true,
                  contentUrl: piece.featuredImage.childImageSharp.fluid.src,
                  url: piece.featuredImage.childImageSharp.fluid.src
                }}
              />
              <Image fluid={piece.featuredImage.childImageSharp.fluid} />
            </figure>
          )}
        </header>
        <main dangerouslySetInnerHTML={{ __html: piece.html }} />
      </Content>
    </BaseLayout>
  );
};

export default remarkForm(ProjectPageTemplate, {
  queryName: "portfolioItem",
  label: "Portfolio Piece",
  actions: [DeleteAction],
  fields: [
    {
      label: "Title",
      name: "frontmatter.title",
      description: "Enter the title of the post here",
      component: "text"
    },
    {
      label: "Featured Image",
      name: "frontmatter.featured_image",
      component: "image",
      parse: filename => `../assets/${filename}`,
      uploadDir: piece => "/content/assets/",
      previewSrc: ({ frontmatter }) =>
        frontmatter.featured_image?.childImageSharp.fluid.src
    } as any,
    {
      name: "rawMarkdownBody",
      component: "markdown",
      label: "Piece Body",
      description: "Edit the body of the post here"
    }
  ]
});

export const fragment = graphql`
  fragment CuriousityPiecePage on PortfolioItem {
    id
    excerpt
    html
    slug
    title
    tags
    keywords
    featuredImage {
      childImageSharp {
        # Generate Picture up to 8K 16:9 ratio, crop and cover as appropriate
        fluid(
          maxWidth: 7680
          maxHeight: 4320
          cropFocus: CENTER
          fit: COVER
          srcSetBreakpoints: [
            256
            512
            768
            1024
            # 720p
            1280
            # 1080p
            1920
            # 4k
            3840
            # 5k
            5120
            # 8k
            7680
          ]
        ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    metadata {
      type
      status
      role
      homepage
      rubygemsGemName
      npmPackageName
      githubRepo
    }
    # Needed for TinaCMS
    id
    fileRelativePath
    rawFrontmatter
    rawMarkdownBody
    ... on RemarkPortfolioItem {
      frontmatter {
        featured_image {
          childImageSharp {
            fluid {
              src
            }
          }
        }
      }
    }
  }
`;
