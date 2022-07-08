import React from "react";

// Components
import Typography from "../../components/Typography";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

const Step0 = ({ handleNextStep, showmodal, handleLearnMore }) => {

    return (
        <>
            <div className="mt-0">
                <Typography
                    size={24}
                    weight="medium"
                    text="secondary"
                    tkey="family.stepper.initial.title"
                />
            </div>
            <div className="mt-2">
                <Typography
                    size={14}
                    weight="light"
                    text="secondary"
                    tkey="family.stepper.initial.desc"
                />
            </div>

            <div className="mt-10">
                <div className="mt-0">
                    <Button
                        type="stepper"
                        size="medium"
                        icon="plant"
                        tkey="family.stepper.initial.btn1"
                        handleClick={() => handleNextStep(1)}
                    />
                </div>
                <div className="mt-3">
                    <Button
                        type="stepper"
                        size="medium"
                        icon="upload"
                        tkey="family.stepper.initial.btn2"
                        handleClick={()=>handleNextStep(2)}
                    />
                </div>
            </div>

            <Modal showmodal={showmodal} handleMouseLeave={handleLearnMore} />

            {
                !showmodal &&
                <div className="learn-more">
                    <Typography
                        size={12}
                        tkey="family.stepper.initial.footer"
                    />
                    &nbsp;
                    <span onClick={handleLearnMore}>
                        <Typography
                            size={12}
                            type="link"
                            href="#"
                            text="primary"
                            tkey="family.stepper.initial.learnMore"
                        />
                    </span>
                </div>
            }
        </>
    );
}

export default Step0;