import React from "react";
import Snackbar from "../../../components/Snackbar";
import { mount } from "enzyme";
import {useDispatch, useSelector} from "react-redux";
import { createShallow } from '@material-ui/core/test-utils';
const timing = 1000
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: jest.fn(),
    useDispatch: ()=>jest.fn()
}));
let shallowNew = createShallow(); 
describe("Snackbar Component", () => {
    const mockCallBack = jest.fn(()=> true);
    let snackBarComponent;
    beforeEach(() => {
        useSelector.mockImplementation(callback => {
            return callback({
                toastr: {
                    message: [
                        {
                            key: new Date().getTime()+'1', 
                            icon: true,
                            content: "Test Message", 
                            type: 'success', 
                            canClose: false,
                            url: false,
                            cta: {text: "Undo", action: mockCallBack}
                        },
                        {
                            key: new Date().getTime()+'2', 
                            icon: false,
                            content: "Test Message 2", 
                            type: 'error', 
                            canClose: true,
                            url: false
                        },
                        {
                            key: new Date().getTime()+'3', 
                            icon: false,
                            content: "Test Message 2", 
                            type: 'error', 
                            canClose: true,
                            url: false,
                            cta: {action: mockCallBack}
                        },
                        {
                            key: new Date().getTime()+'4', 
                            icon: false,
                            content: "Test Message 2", 
                            type: 'warning', 
                            canClose: true,
                            url: "http://google.com",
                            cta: {action: mockCallBack}
                        },
                        {
                            key: new Date().getTime()+'5', 
                            icon: false,
                            content: "Test Message 2", 
                            type: 'info', 
                            canClose: true,
                            url: "http://google.com",
                            cta: {action: mockCallBack}
                        }
                    ]
                }
            });
          });
        snackBarComponent = mount(<Snackbar timing={timing}/>)
    });
    it('match add Message', () => {
        expect(snackBarComponent).toMatchSnapshot();
    });
    it('Snackbar event onClick span', ()=>{
        snackBarComponent.find('span.ml-6.cursor-pointer').at(0).simulate('click');
    })
    afterEach(() => {
        useSelector.mockClear();
    });
});