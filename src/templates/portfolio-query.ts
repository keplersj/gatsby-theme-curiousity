import { graphql } from "gatsby";
import PostsPage from "../components/Portfolio";

export default PostsPage;

export const query = graphql`
  query CuriousityPortfolioPageQuery {
    allPortfolioItem(sort: { fields: [title] }, limit: 1000) {
      edges {
        node {
          id
          excerpt
          slug
          title
        }
      }
    }
  }
`;
