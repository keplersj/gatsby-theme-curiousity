import * as React from "react";
import renderer from "react-test-renderer";
import { HelmetProvider } from "react-helmet-async";
import { useStaticQuery } from "gatsby";
import Base from ".";
import { CuriousityBaseLayoutData } from "../../__mockData__";

describe("Base Layout", () => {
  beforeEach(() => {
    (useStaticQuery as jest.Mock).mockImplementation((): object => ({
      ...CuriousityBaseLayoutData,
    }));
  });

  it("renders as expected", () => {
    const helmetContext: { helmet?: object } = {};
    const tree = renderer
      .create(
        <HelmetProvider context={helmetContext}>
          <Base>
            <div>
              <span>Test Content</span>
            </div>
          </Base>
        </HelmetProvider>
      )
      .toJSON();

    expect(helmetContext.helmet).toMatchSnapshot();
    expect(tree).toMatchSnapshot();
  });
});
