import React from 'react';
import { shallow } from 'enzyme';
import HeroImagePopover from '../../../components/HeroImagePopover';

const wrapper = shallow(
    <HeroImagePopover
        type="image"
        imgSrc={undefined}
        menu={undefined}
        handleMenu={undefined}
        getMousePosition={undefined}
        mousePosition={{ x: 0, y: 0}}
        setCompState={undefined}
        setMousePosition={undefined}
    />
);

test('should test HeroImagePopover component with list of props', () => {  
    expect(wrapper).toMatchSnapshot();
});


test('should test Image type in Hero Image popover component', () => {
    const img = wrapper.find('img');
    expect(img).toHaveLength(1);
});

test('should test div type in Hero Image popover component', () => {
    const div = wrapper.find('div');
    expect(div).toHaveLength(3);
});



