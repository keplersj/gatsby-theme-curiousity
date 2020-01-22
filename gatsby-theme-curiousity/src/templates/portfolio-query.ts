import { graphql } from "gatsby";
import PostsPage, { PortfolioListing } from "../components/Portfolio";

export default PostsPage;

export interface PortfolioPageQuery {
  allPortfolioItem: {
    edges: {
      node: PortfolioListing;
    }[];
  };
}

export const query = graphql`
  query CuriousityPortfolioPageQuery {
    allPortfolioItem(sort: { fields: [title] }, limit: 1000) {
      edges {
        node {
          ...CuriousityPortfolioListing
        }
      }
    }
  }
`;
