import React from 'react';
import { shallow } from 'enzyme';
import Dialog from '../../../components/Dialog';

test('should test Dialog component with list of props', () => {
    const wrapper = shallow(
        <Dialog 
            open={true}
            header='Dialog Header'
            content={
                <div>
                    Dialog Content
                </div>
            }
            handleClose={undefined}
            actions={true}
            cancelButton="Cancel"
            handleCancel={undefined}
            saveButton="Save"
            handleSave={undefined}
            loading={false}
            disabled={false}
            hideCancelButton={false}
        /> 
    );
    expect(wrapper).toMatchSnapshot();
});

  