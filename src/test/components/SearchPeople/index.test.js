import React from "react";
import { act } from 'react-dom/test-utils';
import { mount } from "enzyme";
import { Field, Formik } from "formik";
import SearchPeople from "../../../components/SearchPeople";
const options = [
         {
            "treeId": "ecb83dd5-0dc1-452c-b339-07a3fafed8ca",
            "id": "047ba012-93a1-4026-9f9a-90d80b3a012a",
            "givenName": {
                "nameAssertionId": "00000000-0000-0000-0000-000000000000",
                "givenName": "Test"
            },
            "surname": {
                "nameAssertionId": "00000000-0000-0000-0000-000000000000",
                "surname": "User"
            },
            "gender": {
                "treePersonId": "047ba012-93a1-4026-9f9a-90d80b3a012a",
                "assertionId": "00000000-0000-0000-0000-000000000000",
                "gender": "Female"
            },
            "isLiving": true,
            "birthDate": {
                "rawDate": "",
                "isApproximate": null,
                "isNormalized": null,
                "dayValue": null,
                "monthValue": null,
                "yearValue": null,
                "day": "",
                "month": "",
                "year": "",
                "normalizedDate": null,
                "qualifier": null
            },
            "birthPlace": null,
            "deathDate": {
                "rawDate": "",
                "isApproximate": null,
                "isNormalized": null,
                "dayValue": null,
                "monthValue": null,
                "yearValue": null,
                "day": "",
                "month": "",
                "year": "",
                "normalizedDate": null,
                "qualifier": null
            },
            "deathPlace": null,
            "profileImageUrl": "",
            "profileImageId": "00000000-0000-0000-0000-000000000000",
            "backgroundImageUrl": null,
            "backgroundImageId": "00000000-0000-0000-0000-000000000000"
    }
]
describe('Test SearchPeoople component with props', () => {
    const mockCallBack = jest.fn(()=> true);
    let searchPeroopleComponent;
    beforeEach(() => {
         searchPeroopleComponent =  mount(
        <Formik
            initialValues={{ search: {}
            }}
            enableReinitialize={true}
          >
            <Field
              id="search"
              name="search"
              component={SearchPeople}
              freeSolo={true}
              type="combobox"
              closeIconDisable={true}
              highlight={true}
              options={options}
              selectPeople={mockCallBack}
            />
       </Formik>)
    })
    it('match snapshot', () => {
        expect(searchPeroopleComponent).toMatchSnapshot();
    });
    it('handle Input Change',  async () => {
        const searchInput = searchPeroopleComponent.find("input");
        const autoComplete = searchPeroopleComponent.find('[role="combobox"]');
        await act(async () => {
            const event = { target: {name: "search", value: "Test"}};
            searchInput.simulate('change', event);
        });
        await act(async () => {
            autoComplete.simulate('keyDown', { key: 'ArrowDown' });
        });
        await act(async () => {
            autoComplete.simulate('keyDown', { key: 'Enter' });
            expect(mockCallBack.mock.calls.length).toEqual(2);
        });
    });
    it('handle Input Change with id',  async () => {
        const searchInput = searchPeroopleComponent.find("Typeahead");
        await act(async () => {
            searchInput.prop('handleChange')(options[0]);
        });
        expect(mockCallBack.mock.calls.length).toEqual(1);
    });
    afterEach(() => {
        searchPeroopleComponent.unmount()
    });
});
describe('Test SearchPeoople component with props Placeholder', () => {
    const mockCallBack = jest.fn(()=> true);
    let searchPeroopleComponent;
    beforeEach(() => {
         searchPeroopleComponent =  mount(
        <Formik
            initialValues={{ search: null
            }}
            enableReinitialize={true}
          >
            <Field
              id="search"
              name="search"
              placeholder={"Search"}
              component={SearchPeople}
              freeSolo={false}
              type="combobox"
              closeIconDisable={true}
              highlight={true}
              options={options}
              selectPeople={mockCallBack}
            />
       </Formik>)
    })
    it('match search Placeholder', () => {
        expect(searchPeroopleComponent.props().children.props.placeholder).toEqual("Search");
    });
    it('handle Input Change without id',  async () => {
        const searchInput = searchPeroopleComponent.find("Typeahead");
        await act(async () => {
            searchInput.prop('handleChange')({name: "Test", id: ""});
        });
        expect(mockCallBack.mock.calls.length).toEqual(1);
    });
    it('handle Input Change',  async () => {
        const searchInput = searchPeroopleComponent.find("input");
        await act(async () => {
            const event = { target: {name: "search", value: "Test"}};
            searchInput.simulate('change', event);
        });
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
    afterEach(() => {
        searchPeroopleComponent.unmount()
      });
});