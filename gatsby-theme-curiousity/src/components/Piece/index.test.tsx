import * as React from "react";
import renderer from "react-test-renderer";
import { HelmetProvider } from "react-helmet-async";
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
    const helmetContext: { helmet?: object } = {};
    const tree = renderer
      .create(
        <HelmetProvider context={helmetContext}>
          <PortfolioPiece
            data={CuriousityPiecePageQuery}
            location={{ pathname: "/" }}
          />
        </HelmetProvider>
      )
      .toJSON();

    expect(helmetContext.helmet).toMatchSnapshot();
    expect(tree).toMatchSnapshot();
  });
});
