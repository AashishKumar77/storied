import { shallow } from "enzyme"
import DateComponent from "../../../components/DateComponent";



describe("Given Date Component", () => {
    const component = shallow(<DateComponent />);

    it("Test if Date Component is Properly Rendered", () => {
        expect(component).toMatchSnapshot();
    })
})