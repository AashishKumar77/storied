import React from "react";
import { useHistory } from 'react-router-dom';
import TailwindModal from "../../components/TailwindModal";
import Typography from "./../../components/Typography"
import Button from "./../../components/Button"
import SubsriptionShowcase from "./../../../src/assets/images/unlock-access-showcase.png";
import './paymentmodal.css';
import svg from "./paymentIcon";

const getSvgDes = (title, icon, description) =>  <div className="relative mb-5 pb-0.5">
<span className="icon absolute top-0.5 left-0">
  {svg[icon]}
</span>
<div className="pl-6">
  <Typography size={14}><span className="block"><span className="secondary-color typo-font-bold">{title}</span>{description}</span></Typography>
</div>
</div>

const PaymentsModal = ({ showPaymentModal, setPaymentModal }) => {
  const history = useHistory();

  return (
    <TailwindModal
      title="Unlock access"
      subTitle="Try Storied Plus and unlock access for just $4.99/mo."
      showClose={true}
      innerClasses="modal-md getPlus-modal"
      content={
        <div className="w-full pb-9 px-2.5">
          <div className="flex justify-between mt-3 smd:mt-4 mb-11 smd:mb-14">
            <div className="w-full max-w-xs pt-1 smd:pr-4">
              {getSvgDes("400 million+ records.", "records" ,"Birth, marriage, death, census, military, and more.")}
              {getSvgDes("Automated Clues.", "clues" ,"Be notified each time we find possible record matches for you.")}
              {getSvgDes("Unlimited access to stories.", "access" ,"Search, browse, and collect all of your family’s most meaningful storiesu.")}
              <div className="relative">
                <span className="icon absolute top-0.5 left-0">
                {svg["history"]}
                </span>
                <div className="pl-6">
                  <Typography size={14}><span className="block"><span className="secondary-color typo-font-bold">
                    Affordable family history.</span> All the power at a fraction of the cost of other websites.</span></Typography>
                </div>
              </div>
            </div>
            <div className="hidden smd:flex">
              <div className="my-auto"><img src={SubsriptionShowcase} alt="unlock access" className="" /></div>
            </div>
          </div>
          <div className="bg-gray-200 flex justify-between items-center absolute left-0 w-full bottom py-4 px-10 rounded-b-lg">
            <div className="pr-1">
              <p><Typography size={12} weight="medium"><span className="text-gray-600 block relative -bottom-0.5">Early Access Pricing</span></Typography></p>
              <p className="flex">
                <Typography size={12} weight="medium"><span className="text-gray-600 inline-flex mt-1 mr-0.5">$</span></Typography>
                <Typography size={24} text="secondary" weight="bold"><span className="pr-0.5">4.99</span></Typography>
                <Typography size={12} weight="medium"><span className="text-gray-600 mt-2.5 inline-flex">/mo</span></Typography>
              </p>
            </div>
            <div className="whitespace-nowrap">
              <Button
                handleClick={()=>history.push('/payment')}
                size="large"
                title="Get Storied Plus"
              />
            </div>
          </div>
        </div>}
      showModal={showPaymentModal}
      setShowModal={setPaymentModal}
    />
  );
};
export default PaymentsModal;
