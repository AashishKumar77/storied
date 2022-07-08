import React from 'react';
import { shallow } from 'enzyme';
import DialogDropdown from '../../../components/Dropdown/DialogDropdown';

describe("Given dialogdropdown component", ()=>{
    test('Test if DialogDropdown component is properly rendered ', () => {
        const component = shallow(<DialogDropdown/>);
        expect(component).toMatchSnapshot();

    });
})