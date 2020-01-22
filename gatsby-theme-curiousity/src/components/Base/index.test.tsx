import * as React from "react";
import renderer from "react-test-renderer";
import { useStaticQuery } from "gatsby";
import Base from "./";
import { CuriousityBaseLayoutData } from "../../__mockData__";

describe("Base Layout", () => {
  beforeEach(() => {
    (useStaticQuery as jest.Mock).mockImplementation((): object => ({
      ...CuriousityBaseLayoutData
    }));
  });

  it("renders as expected", () => {
    const tree = renderer
      .create(
        <Base>
          <div>
            <span>Test Content</span>
          </div>
        </Base>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
