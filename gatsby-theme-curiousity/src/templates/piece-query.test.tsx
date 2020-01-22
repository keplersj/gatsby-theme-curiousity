import * as React from "react";
import renderer from "react-test-renderer";
import { useStaticQuery } from "gatsby";
import PieceTemplate from "./piece-query";
import deepMerge from "deepmerge";
import {
  CuriousityBaseLayoutData,
  CuriosityPostQuery,
  CuriousityPiecePageQuery
} from "../__mockData__";

describe("Portfolio Piece Template", () => {
  beforeEach(() => {
    (useStaticQuery as jest.Mock).mockImplementation((): object =>
      deepMerge.all([CuriosityPostQuery, CuriousityBaseLayoutData])
    );
  });

  it("renders as expected", () => {
    const tree = renderer
      .create(
        <PieceTemplate
          data={CuriousityPiecePageQuery}
          location={{ pathname: "/" }}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
