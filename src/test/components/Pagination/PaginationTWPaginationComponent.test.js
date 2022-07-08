
import React from "react";
import { mount } from "enzyme";
import TWPaginationComponent from "../../../components/Pagination/TWPaginationComponent"
import { MemoryRouter } from 'react-router'
import { act } from 'react-dom/test-utils';
jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
      return {
        t: (str) => str,
      };
    },
}));
describe('Test TWPagination component with props 0 records', () => {
    let twPaginationComponent;
    const mockCallBack = jest.fn(()=> {});
    const mockCallBackChangeLimit = jest.fn(()=> {});
    beforeEach(() => {
        twPaginationComponent =  mount(<MemoryRouter><TWPaginationComponent
                  getList={mockCallBack}
                  currentPage={1}
                  totalRecords={0}
                  limitPerPage={10}
                  changeLimit={mockCallBackChangeLimit}
                  tableSize={450}
                /></MemoryRouter>)
    });
    it('match snapshot', () => {
        expect(twPaginationComponent).toMatchSnapshot();
    });
    afterEach(() => {
        twPaginationComponent.unmount()
    });
});
describe('Test TWPagination component with props', () => {
    let twPaginationComponent;
    const mockCallBack = jest.fn(()=> {});
    const mockCallBackChangeLimit = jest.fn(()=> {});
    beforeEach(() => {
        twPaginationComponent =  mount(<MemoryRouter><TWPaginationComponent
                  getList={mockCallBack}
                  currentPage={1}
                  totalRecords={10}
                  limitPerPage={10}
                  changeLimit={mockCallBackChangeLimit}
                  tableSize={450}
                /></MemoryRouter>)
    });
    it('match snapshot', () => {
        expect(twPaginationComponent).toMatchSnapshot();
    });
    afterEach(() => {
        twPaginationComponent.unmount()
    });
});
describe('Test TWPagination component with props with large screen', () => {
    let twPaginationComponent;
    const mockCallBack = jest.fn(()=> {});
    const mockCallBackChangeLimit = jest.fn(()=> {});
    beforeEach(() => {
        twPaginationComponent =  mount(<MemoryRouter><TWPaginationComponent
                  getList={mockCallBack}
                  currentPage={1}
                  totalRecords={100}
                  limitPerPage={10}
                  changeLimit={mockCallBackChangeLimit}
                  tableSize={750}
                /></MemoryRouter>)
    });
    it('match snapshot', () => {
        expect(twPaginationComponent).toMatchSnapshot();
    });
    afterEach(() => {
        twPaginationComponent.unmount()
    });
});
describe('Test TWPagination component with props with currentPage', () => {
    let twPaginationComponent;
    const mockCallBack = jest.fn(()=> {});
    const mockCallBackChangeLimit = jest.fn(()=> {});
    beforeEach(() => {
        twPaginationComponent =  mount(<MemoryRouter><TWPaginationComponent
                  getList={mockCallBack}
                  currentPage={6}
                  totalRecords={100}
                  limitPerPage={10}
                  changeLimit={mockCallBackChangeLimit}
                  tableSize={750}
                /></MemoryRouter>)
    });
    it('handle click event',   async() => {
        const anchorTag = twPaginationComponent.find("a");
        await act(async () => {
            anchorTag.forEach( (_tag)=>{
                _tag.simulate('click', {
                    stopPropagation: jest.fn()
                  });
                expect(anchorTag.length).not.toEqual(0);
            });
        })
    })
    it('handle select',   async() => {
        const selectTag = twPaginationComponent.find("select");
        await act(async () => {
            selectTag.simulate('change');
        });
        expect(selectTag.length).not.toEqual(0);
    });
    it('match snapshot', () => {
        expect(twPaginationComponent).toMatchSnapshot();
    });
    afterEach(() => {
        twPaginationComponent.unmount()
    });
});