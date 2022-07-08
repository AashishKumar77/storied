import React from "react";
import { mount } from "enzyme";
import { Field, Formik } from "formik";
import FWSearchLocation from "../../../components/FWSearchLocation";
import {useDispatch, useSelector} from "react-redux";
import { act } from 'react-dom/test-utils';
jest.useFakeTimers();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: jest.fn(),
    useDispatch: ()=>jest.fn()
}));
jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
      return {
        t: (str) => str,
      };
    },
}));


describe('Test SearchPeoople component with props', () => {
    let searchPeroopleComponent;
    const mockCallBack = jest.fn(()=> true);
    beforeEach(() => {
        useSelector.mockImplementation(callback => {
            return callback({
                family: {
                    options: [],
                    optionLoaing: true
                }
            });
          });
         searchPeroopleComponent =  mount(<Formik
            initialValues={{ location: {}}}
            enableReinitialize={true}
          >
            <Field
              id="location"
              name="location"
              searchType = {true}
              relatedField= "l.l.s"
              component={FWSearchLocation}
              freeSolo={true}
            />
       </Formik>)
    })
    it('match snapshot', () => {
        expect(searchPeroopleComponent).toMatchSnapshot();
    });
   it('handle Input Change',  async () => {
        useSelector.mockImplementation(callback => {
            return callback({
                family: {
                    options: [
                        {
                            "id": "2a719cc0-6c01-4dea-90c3-5ede17ced68b",
                            "name": "Austria-Hungary (historical)"
                        }
                    ],
                    optionLoaing: false
                }
            })
        });
        const searchInput = searchPeroopleComponent.find("input");
        const autoComplete = searchPeroopleComponent.find('[role="combobox"]');
        await act(async () => {
            const event = { target: {name: "search", value: "Austria"}};
            searchInput.simulate('change', event);
        });
        await act(async () => {
            autoComplete.simulate('keyDown', { key: 'ArrowDown' });
        });
        await act(async () => {
            autoComplete.simulate('keyDown', { key: 'Enter' });
            expect(mockCallBack.mock.calls.length).toEqual(0);
        });
    });
    it('handle Input Change without id',  async () => {
        const searchInput = searchPeroopleComponent.find("Typeahead");
        await act(async () => {
            searchInput.prop('handleChange')({name: "Austria", id: ""});
        });
        await act(async () => {
            jest.runOnlyPendingTimers();
        });
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
    it('handle Input Change undefined',  async () => {
        const searchInput = searchPeroopleComponent.find("Typeahead");
        await act(async () => {
            searchInput.prop('handleChange')({name: "", id: ""});
        });
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
    it('handle Input Change with id',  async () => {
        const searchInput = searchPeroopleComponent.find("Typeahead");
        await act(async () => {
            searchInput.prop('handleChange')({
                "id": "2a719cc0-6c01-4dea-90c3-5ede17ced68b",
                "name": "Austria-Hungary (historical)"
            });
        });
        await act(async () => {
            jest.runOnlyPendingTimers();
        });
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
    it('handle Input Change without loadNextPage',  async () => {
        const searchInput = searchPeroopleComponent.find("Typeahead");
        await act(async () => {
            searchInput.prop('loadNextPage')(2);
        });
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
    
    afterEach(() => {
        useSelector.mockClear();
        searchPeroopleComponent.unmount()
    });
});
describe('Test SearchPeoople component with props Placeholder', () => {
    const mockCallBack = jest.fn(()=> true);
    let searchPeroopleComponent;
    beforeEach(() => {
        useSelector.mockImplementation(callback => {
            return callback({
                family: {
                    options: [
                        {
                            "id": "2a719cc0-6c01-4dea-90c3-5ede17ced68b",
                            "name": "Austria-Hungary (historical)"
                        }
                    ],
                    optionLoaing: false
                }
            })
        });
         searchPeroopleComponent =  mount(
        <Formik
            initialValues={{ location: null
            }}
            enableReinitialize={true}
          >
            <Field
              id="location"
              name="location"
              placeholder={"Location"}
              component={FWSearchLocation}
              freeSolo={false}
              closeIconDisable={true}
              highlight={true}
            />
       </Formik>)
    })
    it('match search Placeholder', () => {
        expect(searchPeroopleComponent.props().children.props.placeholder).toEqual("Location");
    });
    it('handle Input Change',  async () => {
        const searchInput = searchPeroopleComponent.find("input");
        await act(async () => {
            const event = { target: {name: "search", value: "Austria"}};
            searchInput.simulate('change', event);
        });
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
    it('handle Input Change with id and with searchType',  async () => {
        const searchInput = searchPeroopleComponent.find("Typeahead");
        await act(async () => {
            searchInput.prop('handleChange')({
                "id": "2a719cc0-6c01-4dea-90c3-5ede17ced681",
                "name": "Austria-Hungary (historical)"
            });
        });
        await act(async () => {
            jest.runOnlyPendingTimers();
        });
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
    afterEach(() => {
        useSelector.mockClear();
        searchPeroopleComponent.unmount()
      });
});