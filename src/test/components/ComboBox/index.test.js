import React from "react";
import { mount } from "enzyme";
import ComboBox from '../../../components/ComboBox/index';

describe("Combobox Enzyme mount() ", () => {
  const fieldProps = {
    placeholder: "A placeholder",
    options:[],
    onChange: jest.fn()
  };
  const Composition = () => {
    return <ComboBox {...fieldProps} />;
  };

  it("renders a <ComboBox/> component with expected props", () => {
    const wrapper = mount(<Composition />);
    expect(wrapper.childAt(0).props().placeholder).toEqual("A placeholder");
    expect(wrapper.childAt(0).props().onChange).toBeDefined();
  });
});