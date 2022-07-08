import React from "react";
import { shallow } from "enzyme";
import WindowDimensions from "../../../pages/SearchPage/WindowDimensions";

describe("Given WindowDimensions component", () => {
  const component = shallow(<WindowDimensions />);

  it("Test if WindowDimensions component is properly rendered ", () => {
    expect(component).toMatchSnapshot();
  });
});
