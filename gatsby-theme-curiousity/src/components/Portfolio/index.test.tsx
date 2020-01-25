import * as React from "react";
import renderer from "react-test-renderer";
import { useStaticQuery } from "gatsby";
import Portfolio from ".";
import deepMerge from "deepmerge";
import {
  CuriousityBaseLayoutData,
  CuriousityPortfolioPageQuery
} from "../../__mockData__";

describe("Portfolio Page Component", () => {
  beforeEach(() => {
    (useStaticQuery as jest.Mock).mockImplementation((): object =>
      deepMerge.all([CuriousityBaseLayoutData])
    );
  });

  it("renders as expected", () => {
    const tree = renderer
      .create(<Portfolio data={CuriousityPortfolioPageQuery} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
