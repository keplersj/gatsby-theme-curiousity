import React from "react";
import styled from "@emotion/styled";
import BaseLayout from "../Base";
import { PortfolioListItem as Project } from "../PortfolioListItem";
import { graphql } from "gatsby";

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
            <Project
              key={node.id}
              location={node.slug}
              title={node.title}
              description={node.excerpt}
            />
          )
        )}
      </ListContainer>
    </Projects>
  </BaseLayout>
);

export default ProjectsPage;

export const fragment = graphql`
  fragment CuriousityPortfolio on PortfolioItem {
    id
    excerpt
    slug
    title
  }
`;
