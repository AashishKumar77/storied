import React from 'react';
import { shallow } from 'enzyme';
import Card from "../../../components/TailwindCard"

describe("Given TailwindCard component" , () =>{
  const component = shallow(<Card/>);

  it("Test if Tailwind card modal is properly rendered", () => {
    expect(component).toMatchSnapshot();
  });
});