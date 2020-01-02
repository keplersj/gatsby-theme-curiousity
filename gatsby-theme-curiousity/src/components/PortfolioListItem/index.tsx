import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import { Card } from "starstuff-components";
import styled from "@emotion/styled";
import { default as Image, FluidObject } from "gatsby-image";
import { JsonLd } from "react-schemaorg";
import { ImageObject } from "schema-dts";

interface Props {
  location: string;
  title: string;
  description: string;
  image?: FluidObject;
}

const Container = styled.article`
  display: flex;
  flex-direction: column;
  border: 1px solid;
  border-radius: 5px;
  width: 20em;
  margin: 0.5em;
  background-color: #fafafa;

  @media (max-width: 35em) {
    flex-grow: 1;
  }

  @media (prefers-color-scheme: dark) {
    background-color: #282c34;
  }

  @media screen and (min-width: 512px) {
    min-height: 192px;
  }
`;

const FeaturedImage = styled.figure`
  height: 100%;
  min-width: 256px;
  @media screen and (max-width: 321px) {
    display: none;
  }
`;

const Info = styled(Card)`
  margin: 1rem;
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
    <Container>
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
            <Image fluid={props.image} />
          </FeaturedImage>
        </Link>
      )}
      <Info
        title={props.title}
        location={props.location}
        customLinkComponent={(title, location): React.ReactElement => (
          <Link to={location}>
            <h2>{title}</h2>
          </Link>
        )}
        supporting={<div>{props.description}</div>}
      />
    </Container>
  );
};
