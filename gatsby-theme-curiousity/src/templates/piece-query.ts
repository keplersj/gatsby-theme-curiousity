import { graphql } from "gatsby";
import PostPage from "../components/Piece";

export default PostPage;

export const query = graphql`
  query CuriousityPiecePageQuery($id: String!) {
    portfolioItem(id: { eq: $id }) {
      ...CuriousityPiecePage
    }
  }
`;
