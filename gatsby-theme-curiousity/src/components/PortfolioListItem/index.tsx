import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import { Card } from "starstuff-components";
import styled from "@emotion/styled";
import { default as Image, FluidObject } from "gatsby-image";
import { JsonLd } from "react-schemaorg";
import { ImageObject, CreativeWork } from "schema-dts";

interface Props {
  location: string;
  title: string;
  description: string;
  image?: FluidObject;
}

export interface PortfolioPieceItemQuery {
  site: {
    siteMetadata: {
      siteUrl: string;
    };
  };
}

const StyledCard = styled(Card)`
  @media screen and (min-width: 1024px) {
    min-height: 192px;
  }

  @media screen and (max-width: 512px) {
    max-width: 100vw;
  }

  @media screen and (min-width: 768px) {
    max-width: 33vw;
  }

  @media screen and (min-width: 1024px) {
    max-width: 25vw;
  }
`;

const Container = styled.article`
  display: flex;
  flex-direction: column;
`;

const FeaturedImage = styled.figure`
  height: 100%;
  width: 100%;

  @media screen and (max-width: 321px) {
    display: none;
  }
`;

const StyledImage = styled(Image)`
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const Info = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const PortfolioListItem = (
  properties: Props
): React.ReactElement<Props> => {
  const data = useStaticQuery<PortfolioPieceItemQuery>(graphql`
    query CuriosityPortfolioPieceItemQuery {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);

  return (
    <StyledCard>
      <Container>
        <JsonLd<CreativeWork>
          item={{
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "@id": `${data.site.siteMetadata.siteUrl}${properties.location}`,
            url: `${data.site.siteMetadata.siteUrl}${properties.location}`,
            headline: properties.title,
            name: properties.title,
            mainEntityOfPage: `${data.site.siteMetadata.siteUrl}${properties.location}`,
            image: properties.image && {
              "@type": "ImageObject",
              "@id": `${data.site.siteMetadata.siteUrl}${properties.image.src}`
            }
          }}
        />
        {properties.image && (
          <Link to={properties.location}>
            <FeaturedImage>
              <JsonLd<ImageObject>
                item={{
                  "@context": "https://schema.org",
                  "@type": "ImageObject",
                  "@id": `${data.site.siteMetadata.siteUrl}${properties.image.src}`,
                  representativeOfPage: false,
                  contentUrl: properties.image.src,
                  url: properties.image.src
                }}
              />
              <StyledImage fluid={properties.image} />
            </FeaturedImage>
          </Link>
        )}
        <Info>
          <Link to={properties.location}>
            <h2>{properties.title}</h2>
          </Link>
          <p>{properties.description}</p>
        </Info>
      </Container>
    </StyledCard>
  );
};
