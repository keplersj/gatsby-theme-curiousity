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

export const PortfolioListItem = (props: Props): React.ReactElement<Props> => {
  const data = useStaticQuery(graphql`
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
            "@id": `${data.site.siteMetadata.siteUrl}${props.location}`,
            url: `${data.site.siteMetadata.siteUrl}${props.location}`,
            headline: props.title,
            name: props.title,
            mainEntityOfPage: `${data.site.siteMetadata.siteUrl}${props.location}`,
            image: props.image && {
              "@type": "ImageObject",
              "@id": `${data.site.siteMetadata.siteUrl}${props.image.src}`
            }
          }}
        />
        {props.image && (
          <Link to={props.location}>
            <FeaturedImage>
              <JsonLd<ImageObject>
                item={{
                  "@context": "https://schema.org",
                  "@type": "ImageObject",
                  "@id": `${data.site.siteMetadata.siteUrl}${props.image.src}`,
                  representativeOfPage: false,
                  contentUrl: props.image.src,
                  url: props.image.src
                }}
              />
              <StyledImage fluid={props.image} />
            </FeaturedImage>
          </Link>
        )}
        <Info>
          <Link to={props.location}>
            <h2>{props.title}</h2>
          </Link>
          <p>{props.description}</p>
        </Info>
      </Container>
    </StyledCard>
  );
};
