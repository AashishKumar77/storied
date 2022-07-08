import React from "react";
import { shallow } from "enzyme";
import Modal from "../../../components/Modal";

describe("Given Modal component", () => {
  const component = shallow(<Modal />);

  it("Test if Modal component is properly rendered ", () => {
    expect(component).toMatchSnapshot();
  });
});
