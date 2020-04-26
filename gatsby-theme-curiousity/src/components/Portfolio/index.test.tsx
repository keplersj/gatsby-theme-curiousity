import * as React from "react";
import renderer from "react-test-renderer";
import { HelmetProvider } from "react-helmet-async";
import { useStaticQuery } from "gatsby";
import Portfolio from ".";
import deepMerge from "deepmerge";
import {
  CuriousityBaseLayoutData,
  CuriousityPortfolioPageQuery,
} from "../../__mockData__";

describe("Portfolio Page Component", () => {
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
          <Portfolio data={CuriousityPortfolioPageQuery} />
        </HelmetProvider>
      )
      .toJSON();

    expect(helmetContext.helmet).toMatchSnapshot();
    expect(tree).toMatchSnapshot();
  });
});
