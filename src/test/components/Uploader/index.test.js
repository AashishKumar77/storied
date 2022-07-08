import React from 'react';
import { shallow } from 'enzyme';
import Uploader from '../../../pages/PersonViewPage/uploader';

const wrapper = shallow(
    <Uploader
    onTargetClick={undefined}
    fileInputRef={undefined}
    setSelectedFile={undefined}
    selectedFile={undefined}
    imgSrc={""}
    anchorRef={undefined}
    open={undefined}
    showPopper={undefined}
    handleToggle={undefined}
    photoMenu={undefined}
    handleSelect={undefined}
    />
);

test('should test Uploader component with list of props', () => {  
    expect(wrapper).toMatchSnapshot();
});
