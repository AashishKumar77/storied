import React from 'react';
import { shallow } from 'enzyme';
import Button from '../../../components/Button';


test('should test Button component with list of props', () => {
    const wrapper = shallow(
     <Button type='primary' 
     title= "Learn more" 
     size= "small" 
     icon= ""
     disabled= {false}
     handleClick= {undefined}
     />
     
    );
    expect(wrapper).toMatchSnapshot();
   });


   describe('Test Button component', () => {
    it('Test click event', () => {
      const mockCallBack = jest.fn();
  
      const button = shallow((<Button handleClick={mockCallBack}>Ok!</Button>));
      button.find('button').simulate('click');
      expect(mockCallBack.mock.calls.length).toEqual(1);
    });
  });

  