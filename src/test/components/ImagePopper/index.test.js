import React from "react";
import { shallow } from "enzyme";
import ImagePopper from '../../../components/ImagePopper/index';

describe("Given ImagePopper component", () => {
it('should test ImagePopper component with list of props', () => {
    const wrapper = shallow(
        <ImagePopper 
        type={undefined}
        avatarName={undefined}
        imgSrc={undefined}
        menu={undefined}
        handleMenu={undefined}
      />
    );
    expect(wrapper).toMatchSnapshot();
});
});
