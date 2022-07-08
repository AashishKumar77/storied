import React from 'react';
import { shallow } from 'enzyme';
import HeroImageUploader from '../../../components/HeroImageUploader';

test('should test HeroImageUploader component with list of props', () => {
    const wrapper = shallow(
        <HeroImageUploader
        saveImageFile={undefined}
        selectedHeroFile={undefined}
        setSelectedHeroFile={undefined}
        onTargetClick={undefined}
        heroImageRef={undefined}
        imageLoading={undefined}
        selectShowImage={undefined}
        className={undefined}
        setCropState={undefined}
      />
    );
    expect(wrapper).toMatchSnapshot();
});


test('should test Input type in Hero Image Uploader component', () => {
    const wrapper = shallow(<HeroImageUploader/>);
    const input = wrapper.find('input');
    expect(input).toHaveLength(1);
});

test('should test FileDrop in Hero Image Uploader component', () => {
    const wrapper = shallow(<HeroImageUploader/>);
    const fileDrop = wrapper.find('FileDrop');
    expect(fileDrop).toHaveLength(1);
});

test('should test Div in Hero Image Uploader component', () => {
    const wrapper = shallow(<HeroImageUploader/>);
    const div = wrapper.find('div');
    expect(div).toHaveLength(3);
});

test('should test Icon in Hero Image Uploader component', () => {
    const wrapper = shallow(<HeroImageUploader/>);
    const icon = wrapper.find('Icon');
    expect(icon).toHaveLength(1);
});