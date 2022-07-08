import React from "react";
import SelectButton from "../../../components/SelectButton";
import { shallow } from "enzyme";

const title = "Title";
const handleSelect = undefined;
describe("SelectButton Component", () => {
  it("selectButton component renders properly", () => {
    const wrapper = shallow(<SelectButton />);
    expect(wrapper).toMatchSnapshot();
  });

  it("accepts title props", () => {
    const wrapper = shallow(<SelectButton title={title} />);
    expect(wrapper.props().title).toEqual(title);
  });

  it("accepts handleSelect props", () => {
    const wrapper = shallow(<SelectButton handleSelect={handleSelect} />);
    expect(wrapper.props().handleSelect).toEqual(handleSelect);
  });
 
  it("select-button toBeTruthy", () => {
    const wrapper = shallow(<SelectButton/>);
    expect(wrapper.find("[data-test='select-button']")).toBeTruthy();
  });
});
