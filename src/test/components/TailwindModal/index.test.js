import React from "react";
import { mount } from "enzyme";
import TailwindModal from "../../../components/TailwindModal";
import { createShallow } from '@material-ui/core/test-utils';
describe('Test TailwindModal component with props', () => {
    const mockCallBack = jest.fn(()=> true);
    const mockCallBackStopProp = jest.fn(()=> true);
    let modal;
    beforeEach(() => {
      modal = mount(<TailwindModal showModal = {true}
        setShowModal = {mockCallBack}
        footer = {false}
        clickAwayClose = {false}
        title = {"Test TailwindModal"}
        content = {"Test TailwindModal Content"}/>);
    });
    it('match snapshot', () => {
      expect(modal).toMatchSnapshot();
    });
    it('match showModal props is true', () => {
      expect(modal.props().showModal).toEqual(true);
    });
    it('match subTitle props', () => {
      modal.setProps({ subTitle: "test Here" });
      expect(modal.props().subTitle).toEqual("test Here");
    });
    it('match showModal props is false', () => {
      modal.setProps({ showModal: false });
      expect(modal.props().showModal).toEqual(false);
    });
    it('match showClose props is false', () => {
      modal.setProps({ showClose: false });
      expect(modal.props().showClose).toEqual(false);
    });
    it('match for close button click', () => {
      modal.find('button.outline-none').simulate('click', {
        stopPropagation: jest.fn()
      });
      expect(mockCallBack.mock.calls.length).toEqual(1);
    })
    it('match for stop on modal click', () => {
      modal.find('#twModal').simulate('click', {
        stopPropagation: mockCallBackStopProp
      });
      expect(mockCallBackStopProp.mock.calls.length).toEqual(1);
    })
    afterEach(() => {
      modal.unmount()
    });
});
describe('Test TailwindModal component with props os Windows ', () => {
  const mockCallBack = jest.fn(()=> true);
  let modal;
  beforeEach(() => {
    window.navigator['__defineGetter__']('userAgent', function(){
      return 'windows' // Return whatever you want here
    });
    modal = mount(<TailwindModal showModal = {true}
      setShowModal = {mockCallBack}
      footer = {false}
      clickAwayClose = {false}
      title = {"Test TailwindModal"}
      content = {"Test TailwindModal Content"}/>);
  });
  it('match os class pr-17 added', () => {
    expect(modal.find('.pr-17')).toBeTruthy();
  });
  afterEach(() => {
    modal.unmount()
  });
});
describe('Test TailwindModal component with props os Linux ', () => {
  const mockCallBack = jest.fn(()=> true);
  let modal;
  beforeEach(() => {
    window.navigator['__defineGetter__']('userAgent', function(){
      return 'linux' // Return whatever you want here
    });
    modal = mount(<TailwindModal showModal = {true}
      setShowModal = {mockCallBack}
      footer = {false}
      clickAwayClose = {false}
      title = {"Test TailwindModal"}
      content = {"Test TailwindModal Content"}/>);
  });
  it('match os class pr-17 added', () => {
    expect(modal.find('.pr-17')).toBeTruthy();
  });
  afterEach(() => {
    modal.unmount()
  });
});
describe('Match for ClickOutside', () => {
  let shallowNew;
    shallowNew = createShallow(); 

  it('should call setShowModal when clicking outside', () => {
    const mockCallBack = jest.fn();
    const wrapper = shallowNew(<TailwindModal showModal = {true}
      setShowModal = {mockCallBack}
      footer = {false}
      title = {"Test TailwindModal"}
      content = {"Test TailwindModal Content"}/>);
      const mockedEvent = { target: document.body };
      wrapper
            .find('ClickAwayListener')
            .props()
            .onClickAway(mockedEvent);
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });
});