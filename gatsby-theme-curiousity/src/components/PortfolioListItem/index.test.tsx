import * as React from "react";
import renderer from "react-test-renderer";
import { useStaticQuery } from "gatsby";
import { PortfolioListItem } from "./";
import { CuriosityPortfolioPieceItemQuery } from "../../__mockData__";

describe("Portfolio List Item Component", () => {
  beforeEach(() => {
    (useStaticQuery as jest.Mock).mockImplementation(
      (): object => CuriosityPortfolioPieceItemQuery
    );
  });

  it("renders as expected", () => {
    const tree = renderer
      .create(
        <PortfolioListItem
          location="/item"
          title="Sample Portfolio Item"
          description="This is an example of a portfolio piece."
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
