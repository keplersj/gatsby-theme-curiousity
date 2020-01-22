import * as React from "react";
import renderer from "react-test-renderer";
import { useStaticQuery } from "gatsby";
import PortfolioTemplate from "./portfolio-query";
import deepMerge from "deepmerge";
import {
  CuriousityBaseLayoutData,
  CuriousityPortfolioPageQuery
} from "../__mockData__";

describe("Portfolio Page Template", () => {
  beforeEach(() => {
    (useStaticQuery as jest.Mock).mockImplementation((): object =>
      deepMerge.all([CuriousityBaseLayoutData])
    );
  });

  it("renders as expected", () => {
    const tree = renderer
      .create(<PortfolioTemplate data={CuriousityPortfolioPageQuery} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
