import React from "react";
import { shallow, mount } from "enzyme";
import Select from "../../../components/Select";

describe("Given Select component", () => {
  const component = shallow(<Select />);

  it("Test if Select component is properly rendered ", () => {
    expect(component).toMatchSnapshot();
  });

  it("check for menuItem", () => {
    const wrapper = mount(<Select />);
    expect(wrapper.find("[data-test='menuitem']")).toBeTruthy();
  });
});
