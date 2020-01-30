import * as React from "react";
import renderer from "react-test-renderer";
import { HelmetProvider } from "react-helmet-async";
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
    const helmetContext: { helmet?: object } = {};
    const tree = renderer
      .create(
        <HelmetProvider context={helmetContext}>
          <PortfolioTemplate data={CuriousityPortfolioPageQuery} />
        </HelmetProvider>
      )
      .toJSON();

    expect(helmetContext).toMatchSnapshot();
    expect(tree).toMatchSnapshot();
  });
});
