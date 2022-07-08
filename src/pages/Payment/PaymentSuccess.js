import React from 'react';
import { useHistory } from "react-router-dom";
import Typography from "../../components/Typography"
import Button from "../../components/Button"
import paymentSuccessVector from './../../../src/assets/images/paymentSuccessVector.svg'
import './index.css';

const PaymentSuccess = () => {
  const history = useHistory();
    return <>
      <div className='w-full max-w-sm px-6 smd:px-3 m-auto pt-18 pb-10 md:py-10'>
          <div className='mb-9 flex justify-center'>
              <img src={paymentSuccessVector} alt="" />
          </div>
          <div className='mb-8 text-center'>
              <h2 className='mb-1'><Typography size={20} weight="bold" text="secondary">Payment Successful!</Typography></h2>
              <Typography size={14}>You now have upgraded access to Storied Plus.</Typography>
          </div>
          <div className='btn-wrap'>
              <Button handleClick={() => history.goBack()} size="large" title="Continue" />
          </div>
      </div>
    </>
}

export default PaymentSuccess
