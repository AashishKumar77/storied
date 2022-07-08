import React from "react";
import { mount } from "enzyme";
import MySkeleton from '../../../components/Skeleton';

test("check for MySkeleton component", () => {
    const wrapper = mount(<MySkeleton />);
    expect(wrapper).toBeTruthy();
  });