import React from "react";
import { shallow } from "enzyme";
import Table from "../../../pages/SearchPage/Table";

describe("Given Table component", () => {
  const component = shallow(<Table />);

  it("Test if Table component is properly rendered ", () => {
    expect(component).toMatchSnapshot();
  });
});

jest.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => ''),
      },
    };
  },
}));
