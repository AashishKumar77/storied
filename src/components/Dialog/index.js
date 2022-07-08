import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Components 
import Button from "../Button";
import Icon from "../Icon";
import Typography from '../Typography';

const styles = () => ({
    root:{
        overflow: "hidden"
    },
    spaceBetween: {
        display: "flex",
        justifyContent: "space-between"
    },
    paperDialog: {
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.25)",
        borderRadius: '12px',
    },
    smallPaperDialog: {
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.25)",
        borderRadius: '12px',
        width: 410
    },
    heroDialog: {
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.25)",
        borderRadius: '12px',
        maxWidth: 830
    },
    xsmallPaperDialog: {
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.25)",
        borderRadius: '12px',
        width: 352,
        height: 402,
        overflow: 'hidden'
    },
    xxsmallPaperDialog: {
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.25)",
        borderRadius: '12px',
        width: 352,
        height: 378,
        overflow: 'hidden'
    },
    tinyDialog : {
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.25)",
        borderRadius: '12px',
        width: 355,        
    },
    rootActions: {
        padding: "16px 24px"
    }
})

const MyDialog = ({
    classes,
    size,
    open,
    header,
    content,
    handleClose,
    actions,
    cancelButton,
    handleCancel,
    saveButton,
    handleSave,
    loading,
    disabled,
    hideCancelButton,
    hideDividers,
    saveButtonType
}) => {

    const getPaperClass = () => {
        switch (size) {
            case "small":
                return classes.smallPaperDialog;
            case "x-small":
                return classes.xsmallPaperDialog;
            case "xx-small":
                return classes.xxsmallPaperDialog;
            case "tiny-dialog":
                return classes.tinyDialog;
            case "hero-dialog":
                return classes.heroDialog;
            default:
                return classes.paperDialog;
        }
    }
    return (
        <div>
            <Dialog
                classes={{
                    paper: getPaperClass()
                }}
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                scroll="body"
            >
                <DialogTitle id="form-dialog-title" classes={{ root: classes.rootTitle }}>
                    <div className={classes.spaceBetween}>
                        <div>
                            <Typography
                                size={24}
                                weight="bold"
                                text="secondary"
                            >
                                {header}
                            </Typography>
                        </div>
                        <div className="mt-2">
                            <Icon
                                type="delete"
                                handleClick={handleClose}
                            />
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent dividers={false} classes={{ root: classes.root }}>
                    {content}
                </DialogContent>
                {
                    actions &&
                    <DialogActions
                        classes={{
                            root: classes.rootActions
                        }}
                    >
                        {!hideCancelButton && <Button
                            type="default"
                            size="large"
                            tkey={cancelButton}
                            handleClick={handleCancel}
                        />}
                        <Button
                            type={saveButtonType}
                            size="large"
                            disabled={disabled}
                            tkey={saveButton}
                            handleClick={handleSave}
                            loading={loading}
                        />
                    </DialogActions>
                }
            </Dialog>
        </div>
    );
}

MyDialog.propTypes = {
    size: PropTypes.oneOf(["xx-small", "x-small", "small", "medium", "large", "hero-dialog"]),
    open: PropTypes.bool,
    header: PropTypes.string,
    content: PropTypes.element,
    handleClose: PropTypes.func,
    actions: PropTypes.bool,
    cancelButton: PropTypes.string,
    handleCancel: PropTypes.func,
    saveButton: PropTypes.string,
    handleSave: PropTypes.func,
    loading: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    disabled: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    hideCancelButton: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
};

MyDialog.defaultProps = {
    size: "medium",
    open: false,
    header: "Header",
    content: <div>Component</div>,
    handleClose: undefined,
    actions: true,
    cancelButton: "pedigree.dialog.form.btn.cancel",
    handleCancel: undefined,
    saveButton: "pedigree.dialog.form.btn.save",
    handleSave: undefined,
    loading: false,
    disabled: false,
    hideCancelButton: false,
    saveButtonType: 'primary'
}

export default withStyles(styles)(MyDialog);