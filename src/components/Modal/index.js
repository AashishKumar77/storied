import React, { } from "react";
import Typography from "../Typography";
import Icon from "../Icon";

const Modal = ({ showmodal, handleMouseLeave }) => {
  return (
    <>
      {showmodal && (
        <div className="learn-modal">
          <div className="mb-1.5">
            <Typography size={12} text="secondary" tkey="family.stepper.modal.title" />
          </div>
          <div className="modal-close-icon">
            <div onClick={handleMouseLeave} >
              <Icon type="delete" size="small" />
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <ul>
                <li>
                  <Typography
                    size={12}
                    type="link"
                    target="_blank"
                    href="https://support.ancestry.com/s/article/Uploading-and-Downloading-Trees"
                    tkey="family.stepper.modal.links.ancestry"
                  />
                </li>
                <li>
                  <Typography
                    size={12}
                    type="link"
                    target="_blank"
                    href="https://support.mackiev.com/204772-Exporting-a-File-in-Family-Tree-Maker"
                    tkey="family.stepper.modal.links.familyTree"
                  />
                </li>
                <li>
                  <Typography
                    size={12}
                    type="link"
                    target="_blank"
                    href="https://support.rootsweb.com/s/article/How-to-create-a-GEDCOM-in-RootsMagic-1460088941399"
                    tkey="family.stepper.modal.links.roots"
                  />
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li>
                  <Typography
                    size={12}
                    type="link"
                    target="_blank"
                    href="https://legacyfamilytree.com/bigGedcomExport.asp"
                    tkey="family.stepper.modal.links.legacy"
                  />
                </li>
                <li>
                  <Typography
                    size={12}
                    type="link"
                    target="_blank"
                    href="https://www.familysearch.org/wiki/en/GEDCOM"
                    tkey="family.stepper.modal.links.familySearch"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
