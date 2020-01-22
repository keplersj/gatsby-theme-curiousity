import { graphql } from "gatsby";
import PostPage, { PiecePage } from "../components/Piece";

export default PostPage;

export interface PiecePageQuery {
  portfolioItem: PiecePage;
}

export const query = graphql`
  query CuriousityPiecePageQuery($id: String!) {
    portfolioItem(id: { eq: $id }) {
      ...CuriousityPiecePage
    }
  }
`;
