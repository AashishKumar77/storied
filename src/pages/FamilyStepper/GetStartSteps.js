import React from "react";

// Components
import Typography from "../../components/Typography";
import Loader from "../../components/Loader";
import Step0 from "./Step0"
import Step1 from "./Step1"

const GetStartSteps = ({ 
    step, 
    handleNextStep, 
    handleBackStep, 
    userForm, 
    handleInputChange,
    showmodal, 
    handleLearnMore,
    checkDisabled,
    handleStartNewTree
}) => {
    switch (step) {
        case 0:
            return (
                <Step0 
                    handleNextStep={handleNextStep} 
                    showmodal={showmodal} 
                    handleLearnMore={handleLearnMore} 
                />
            );

        case 1:
            return (
                <Step1 
                    handleNextStep={handleNextStep}
                    handleBackStep={handleBackStep}
                    userForm={userForm}
                    handleInputChange={handleInputChange}
                    checkDisabled={checkDisabled}
                    handleStartNewTree={handleStartNewTree}
                />
            );

        case 2:
            return (
                <div className="flex flex-col al items-center">                             
                    <div className="mt-20">
                        <Loader color="danger"/>
                    </div>

                    <div className="mt-8 content-center">
                        <Typography
                            size={24}
                            weight="medium"
                            text="secondary"
                            tkey="family.stepper.startTree.step2.title"
                        />
                    </div>
                    <div className="mt-6 w-80 mx-auto">
                        <Typography
                            size={14}
                            text="secondary"
                            tkey="family.stepper.startTree.step2.desc"
                        />
                    </div>
                </div>
            );

        default:
            return null;
    }

}

export default GetStartSteps;