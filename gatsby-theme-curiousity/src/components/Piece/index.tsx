import React from "react";
import styled from "@emotion/styled";
import BaseLayout from "../Base";
import { graphql } from "gatsby";

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
      html: string;
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
  <BaseLayout title={piece.title} description={piece.excerpt}>
    <Content>
      <h1>{piece.title}</h1>
      <section dangerouslySetInnerHTML={{ __html: piece.html }} />
    </Content>
  </BaseLayout>
);

export default ProjectPageTemplate;

export const fragment = graphql`
  fragment CuriousityPiecePage on PortfolioItem {
    id
    excerpt
    html
    slug
    title
    tags
    keywords
  }
`;
