import React, {useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import './index.css';
import Typography from "./../../components/Typography"
import Icon from "./../../components/Icon"
import PaymentShowcase from './../../../src/assets/images/paymentShowcase.jpg'
import PaymentForm from './PaymentForm';
import PaymentSuccess from './PaymentSuccess';
import svg from "./paymentIcon";

const getSvg = (title, icon) =>  <div className="relative mb-5 pb-0.5">
<span className="icon absolute top-0.5 left-0">
  {svg[icon]}
</span>
<div className="pl-6">
    <Typography size={14} weight="bold" text="secondary"><span className="block">{title}</span></Typography>
</div>
</div>

const Payment = () => {

  const history = useHistory();
  const { isPaySuccess } = useSelector((state) => state.payment);

  useEffect(()=>{
     document.querySelector(".shadow-md.header").style.display = "none";
     return _ => {
      document.querySelector(".shadow-md.header").style.display = "";
    }
   }, []);

    return <>
        <div className="flex w-full">
            <div className='absolute top-6 right-6'>
                <Icon
                    background
                    handleClick={() => history.goBack()}
                    id="&quot;icon-&quot; + crypt"
                    type="delete"
                />
            </div>
            <div className='w-2/4 bg-gray-200 overflow-hidden relative hidden lg:flex'>
                <div className='relative w-full h-full'>
                    <img className='absolute left-0 top-0 w-full h-full object-cover' src={PaymentShowcase} alt="" />
                    <div className='absolute bg-black w-full h-full z-10 top-0 left-0 opacity-50'></div>
                    <div className='w-full max-w-sm absolute left-2/4 top-2/4 transform -translate-x-2/4 -translate-y-2/4 z-50 px-3'>
                        <div className='bg-white w-full rounded-xlg p-12'>
                            <div className='mb-6'>
                                <div className='logo mb-4'>
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M31.9949 0H16.7896V32H31.9949V0ZM7.05566 3.35107V28.6632H14.8019V3.35107H7.05566ZM0 6.82019H5.07076V25.1762H0V6.82019Z" fill="#FC4040" />
                                    </svg>
                                </div>
                                <h2 className='mb-3'><Typography size={20} text='secondary' weight="bold">Storied Plus</Typography></h2>
                                <div>
                                    <p><Typography size={12} weight="medium"><span className="block relative -bottom-0.5">Early Access Pricing</span></Typography></p>
                                    <p className="flex">
                                        <Typography size={16} weight="medium"><span className="inline-flex mt-1">$</span></Typography>
                                        <Typography size={32} text="secondary" weight="bold"><span className="pr-0.5">4.99</span></Typography>
                                        <Typography size={16} weight="medium"><span className="mt-3 pt-0.5 inline-flex">/mo</span></Typography>
                                    </p>
                                </div>
                            </div>
                            <div className="w-full max-w-xs pt-1 smd:pr-2">
                                {getSvg("400 million+ records.", "records")}
                                {getSvg("Automated Clues.", "clues")}
                                {getSvg("Unlimited access to stories.", "access")}
                                <div className="relative">
                                    <span className="icon absolute top-0.5 left-0">
                                      {svg["history"]}
                                    </span>
                                    <div className="pl-6">
                                        <Typography size={14} weight="bold" text="secondary"><span className='block'>Affordable family history.</span></Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full lg:w-2/4 flex'>
              { isPaySuccess ? <PaymentSuccess />  :
                <div className='w-full max-w-sm px-6 smd:px-3 m-auto pt-18 pb-10 md:py-10'>
                    <div className='mb-7'>
                        <div className='flex items-center lg:hidden mb-7'>
                            <div className='logo mr-4'>
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M31.9949 0H16.7896V32H31.9949V0ZM7.05566 3.35107V28.6632H14.8019V3.35107H7.05566ZM0 6.82019H5.07076V25.1762H0V6.82019Z" fill="#FC4040" />
                                </svg>
                            </div>
                            <h2><Typography size={20} text='secondary' weight="bold">Storied Plus</Typography></h2>
                        </div>
                        <div className="lg:hidden mb-9">
                            <p><Typography size={12} weight="medium"><span className="block relative -bottom-0.5">Early Access Pricing</span></Typography></p>
                            <p className="flex">
                                <Typography size={16} weight="medium"><span className="inline-flex mt-1">$</span></Typography>
                                <Typography size={32} text="secondary" weight="bold"><span className="pr-0.5">4.99</span></Typography>
                                <Typography size={16} weight="medium"><span className="mt-3 pt-0.5 inline-flex">/mo</span></Typography>
                            </p>
                        </div>
                          <h2 className='lg:hidden'><Typography size={16} text="secondary" weight="bold">Payment Details</Typography></h2>
                          <h1 className='hidden lg:inline-block'><Typography size={24} text="secondary" weight="bold">Payment Details</Typography></h1>
                    </div>
                    <PaymentForm />
                </div>
              }
            </div>
        </div>
    </>
}

export default Payment
