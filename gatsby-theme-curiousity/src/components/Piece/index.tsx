import React from "react";
import styled from "@emotion/styled";
import BaseLayout from "../Base";
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
  <BaseLayout title={piece.title} description={piece.excerpt}>
    <Content>
      <h1>{piece.title}</h1>
      {/* <br /> */}
      <section>
        <MDXRenderer>{piece.body}</MDXRenderer>
      </section>
    </Content>
  </BaseLayout>
);

export default ProjectPageTemplate;
