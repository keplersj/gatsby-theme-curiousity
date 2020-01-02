import React from "react";
import styled from "@emotion/styled";
import BaseLayout from "../Base";
import { PortfolioListItem as Piece } from "../PortfolioListItem";
import { graphql } from "gatsby";
import { withPlugin } from "tinacms";
import { CreatePiecePlugin } from "../../lib/tinacms-creator-plugin";
import { FluidObject } from "gatsby-image";

const Projects = styled.div`
  margin-left: 2em;
  margin-right: 2em;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`;

interface Props {
  data: {
    allPortfolioItem: {
      edges: {
        node: {
          id: string;
          excerpt: string;
          slug: string;
          title: string;
          featuredImage?: {
            childImageSharp: {
              fluid: FluidObject;
            };
          };
        };
      }[];
    };
  };
}

const ProjectsPage = ({ data }: Props): React.ReactElement<Props> => (
  <BaseLayout title="Projects">
    <Projects>
      <h1>Projects</h1>
      <ListContainer>
        {data.allPortfolioItem.edges.map(
          ({ node }): React.ReactElement => (
            <Piece
              key={node.id}
              location={node.slug}
              title={node.title}
              description={node.excerpt}
              image={node.featuredImage?.childImageSharp.fluid}
            />
          )
        )}
      </ListContainer>
    </Projects>
  </BaseLayout>
);

export default withPlugin(ProjectsPage, CreatePiecePlugin);

export const fragment = graphql`
  fragment CuriousityPortfolio on PortfolioItem {
    id
    excerpt
    slug
    title
    featuredImage {
      childImageSharp {
        # Generate Picture up to 8K 4:3 ratio, crop and cover as appropriate
        fluid(
          maxWidth: 7680
          maxHeight: 5760
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
  }
`;
