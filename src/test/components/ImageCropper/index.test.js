import React from 'react';
import { shallow } from 'enzyme';
import ImageCropper from '../../../components/ImageCropper';

test('should test Image Cropper component with list of props', () => {
    const wrapper = shallow(
        <ImageCropper
        selectedFile={undefined}
        imageFile={undefined}
        setImageFile={undefined}
        closeCropModal={undefined}
        setSelectedFile={undefined}
        setShowInvalidModal={undefined}
        showImageCropper={undefined}
        from="fromText"
        setAccountThumbnail={undefined}
        saveAccountThumbnail={undefined}
        handleSaveProfileImage={undefined}
        profileState={undefined}
      />
    );
    expect(wrapper).toMatchSnapshot();
});




