import * as React from "react";
import renderer from "react-test-renderer";
import { useStaticQuery } from "gatsby";
import PortfolioPiece from ".";
import deepMerge from "deepmerge";
import {
  CuriousityBaseLayoutData,
  CuriosityPostQuery,
  CuriousityPiecePageQuery
} from "../../__mockData__";

describe("Piece Page Component", () => {
  beforeEach(() => {
    (useStaticQuery as jest.Mock).mockImplementation((): object =>
      deepMerge.all([CuriosityPostQuery, CuriousityBaseLayoutData])
    );
  });

  it("renders as expected", () => {
    const tree = renderer
      .create(
        <PortfolioPiece
          data={CuriousityPiecePageQuery}
          location={{ pathname: "/" }}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
