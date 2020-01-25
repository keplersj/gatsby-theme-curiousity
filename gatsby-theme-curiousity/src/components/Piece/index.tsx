import React from "react";
import styled from "@emotion/styled";
import BaseLayout from "../Base";
import { graphql, useStaticQuery, PageRendererProps } from "gatsby";
import { remarkForm, DeleteAction } from "gatsby-tinacms-remark";
import Image, { FluidObject } from "gatsby-image";
import { JsonLd } from "react-schemaorg";
import { ImageObject, CreativeWork } from "schema-dts";
import { readableColor as readablecolor } from "polished";

const Content = styled.article`
  max-width: 55em;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 55em) {
    margin-left: 2em;
    margin-right: 2em;
  }
`;

const SupportingDetails = styled.div`
  margin: 0.5em 0;

  @media screen and (min-width: 1024px) {
    margin: 0.5em;
  }
`;

interface SupportingDetailProps {
  backgroundColor?: string;
}

const SupportingDetail = styled.span<SupportingDetailProps>`
  text-transform: uppercase;
  margin-bottom: 1em;

  @media screen and (max-width: 1023px) {
    :not(:last-child) {
      ::after {
        content: " · ";
      }
    }
  }

  /* The parallelogram effect is really cool, but I can't get it to consistently work at anything less than a laptop-class display. Will get it to work one day. */
  @media screen and (min-width: 1024px) {
    position: relative;
    padding: 0.3em 0.45em;

    color: ${({ backgroundColor }) =>
      backgroundColor && readablecolor(backgroundColor)};

    a {
      color: ${({ backgroundColor }) =>
        backgroundColor && readablecolor(backgroundColor)};
    }

    ::before,
    ::after {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: skew(20deg);
      background-color: ${({ backgroundColor }) => backgroundColor};
      z-index: -1;
      content: "";
      position: absolute;
      white-space: nowrap;
    }
  }
`;

interface SupportingListProps extends SupportingDetailProps {
  type: string;
  list?: string[];
}

const SupportingList = (props: SupportingListProps) =>
  props.list && (
    <SupportingDetail {...props}>
      {props.type}: {props.list.join(", ")}
      {"​\u200B"}
    </SupportingDetail>
  );

interface SupportingLinkProps extends SupportingDetailProps {
  name: string;
  destination?: string;
}

const SupportingLink = (props: SupportingLinkProps) =>
  props.destination && (
    <SupportingDetail {...props}>
      <a href={props.destination}>{props.name}</a>
      {"​\u200B"}
    </SupportingDetail>
  );

export interface PostQuery {
  site: {
    siteMetadata: {
      siteUrl: string;
    };
  };
}

export interface PiecePage {
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
  // Needed for TinaCMS
  // id: string;
  fileRelativePath: string;
  rawFrontmatter: string;
  rawMarkdownBody: string;
  frontmatter: {
    featured_image?: {
      childImageSharp: {
        fluid: {
          src;
        };
      };
    };
  };
}

interface Props extends PageRendererProps {
  data: {
    portfolioItem: PiecePage;
  };
}

const ProjectPageTemplate = ({
  data: { portfolioItem: piece },
  location
}: Props): React.ReactElement<Props> => {
  const staticQuery = useStaticQuery<PostQuery>(graphql`
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
          <SupportingDetails>
            <SupportingList
              type="Type"
              list={piece.metadata.type}
              backgroundColor="slategray"
            />
            <SupportingList
              type="Status"
              list={piece.metadata.status}
              backgroundColor="darkolivegreen"
            />
            <SupportingList
              type="Role"
              list={piece.metadata.role}
              backgroundColor="maroon"
            />
            <SupportingLink
              name="Homepage"
              destination={piece.metadata.homepage}
              backgroundColor="#3d7e9a"
            />
            <SupportingLink
              name="GitHub"
              destination={
                piece.metadata.githubRepo &&
                `https://www.github.com/${piece.metadata.githubRepo}`
              }
              backgroundColor="#24292e"
            />
            <SupportingLink
              name="npm"
              destination={
                piece.metadata.npmPackageName &&
                `https://www.npmjs.com/package/${piece.metadata.npmPackageName}`
              }
              backgroundColor="#C12127"
            />
            <SupportingLink
              name="RubyGems"
              destination={
                piece.metadata.rubygemsGemName &&
                `https://rubygems.org/gems/${piece.metadata.rubygemsGemName}`
              }
              backgroundColor="#e9573f"
            />
          </SupportingDetails>
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
