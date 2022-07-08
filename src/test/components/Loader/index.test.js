import React from 'react';
import { shallow } from 'enzyme';
import Loader from '../../../components/Loader';


const color = "primary";
test('Test Loader component', () => {
    const component = shallow(<Loader/>);
    const loaderExists = component.find('Loader').exists();
    expect(loaderExists).toBe(true)
});

describe("Loader testing", () => {
    it("Loader component renders properly", () => {
        const wrapper = shallow(<Loader />);
        expect(wrapper).toMatchSnapshot();
      });

    it('check loader default color props', () => {
        const wrapper = shallow(<Loader color={color}/>);
        expect(wrapper.props().color).toEqual(color);
    })

})
  