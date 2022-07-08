import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import Typography from "./../../components/Typography"
import Button from "./../../components/Button"
import { submitCardDetails } from "../../redux/actions/payments";
import {
  getCardNames,
  getDateStrings
} from "./../../utils/index";
import NumberFormat from 'react-number-format';
function validateCurrentDate(expDate) {
  let returnVal=false;
  const currentYear = new Date().getFullYear().toString().substring(2);
  let month=new Date().getMonth()
  const monthYear = expDate.split("/");
  if (Number(monthYear[1]) === Number(currentYear)) {
    if (Number(monthYear[0]) <= month) {
      returnVal = true;
    }
  } else if (Number(monthYear[1]) <= Number(currentYear)) {
    returnVal = true;
  }
  return returnVal
}

function getMonth(val) {
  if (val.length === 1 && val[0] > 1) {
    val = '0' + val;
  }

  if (val.length === 2) {
    if (Number(val) === 0 || (Number(val[0]) !== 0 && Number(val[1]) > 2)) {
      let extra = val[1]
      val = '01';
      return { val, extra }
    }
  }

  return val;
}
const getMonString = (month, year,status, exDate) => {
  let str = `${month}`
  if (year.length) {
    str += '/' + year
  } else {
    if (month.length > 1 && status !='backspace') {
      str += '/'
    } else if (exDate.substr(-1) === '/' && status ==='backspace') {
      str = exDate?.substring(0, exDate.length - 2);
    } else if (exDate.substr(-2, 1) === '/' && status ==='backspace') {
      str = exDate?.substring(0, exDate.length - 1)
    }
  }
  return str
}
function cardExpiry(val, form) {
  const status = form.status
  const exDate = form.values.expiryDate
  let month = getMonth(val.substring(0, 2));
  let year = val.substring(3, 5);
  if (typeof month === 'string') {
    return getMonString(month, year, status, exDate);
  } else {
    return `${month.val}/${month.extra}${year.length ? year[0] : ''}`;
  }
}
const carNumberVaildate =(initialValues,setErrField)=>{
  if (!initialValues.cardNumber) {
    setErrField(prev=>({...prev,cardNumber:'This is required.'}))
  } else if ((initialValues.cardNumber.substring(0, 2) == 34 || initialValues.cardNumber.substring(0, 2) == 37) && initialValues.cardNumber.replaceAll(/\s/g,'').length < 15) {
    setErrField(prev=>({...prev,cardNumber:'Check your card number.'}))

  } else if (initialValues.cardNumber && initialValues.cardNumber.substring(0, 2) != 34 && initialValues.cardNumber.substring(0, 2) != 37 && initialValues.cardNumber.replaceAll(/\s/g,'').length < 16){
    setErrField(prev=>({...prev,cardNumber:'Check your card number.'}))

  }else{
    setErrField(prev=>({...prev,cardNumber:''}))

  }
}
const expiryDateVaildate =(initialValues,setErrField)=>{
  if (!initialValues.expiryDate) {
    setErrField(prev=>({...prev,expiryDate:'This is required.'}))
  } else if(initialValues.expiryDate.length < 5) {
    setErrField(prev=>({...prev,expiryDate:'Check your expiration date.'}))
  } else if(validateCurrentDate(initialValues.expiryDate)) {
    setErrField(prev=>({...prev,expiryDate:'Check your expiration date.'}))
  }else{
    setErrField(prev=>({...prev,expiryDate:''}))
  }
}
const cvcVaildate =(initialValues,setErrField)=>{

  if (!initialValues.cvc) {
    setErrField(prev=>({...prev,cvc:'This is required.'}))
  } else if((initialValues.cardNumber.substring(0, 2) == 34 || initialValues.cardNumber.substring(0, 2) == 37) ){
    if((initialValues.cvc.replaceAll(/\s/g,'')).length<4){
      setErrField(prev=>({...prev,cvc:'check your CVV'}))
    }else{
      setErrField(prev=>({...prev,cvc:''}))
    }
  }else{
    if((initialValues.cvc.replaceAll(/\s/g,'')).length<3){
      setErrField(prev=>({...prev,cvc:'check your CVV'}))
    }else{
      setErrField(prev=>({...prev,cvc:''}))
    }
  }
}
const handleDateKeyPress=e=>{
  if(!(e.which>46 && e.which<58)){
    e.preventDefault();
  }

}
const handleInputChangeEx = (expiryDate,setInitialValues) => {
  setInitialValues(prevState => ({
    ...prevState,
    ["expiryDate"]: expiryDate
  }));
}
const handleDateChange=(e,props,setInitialValues)=>{
  let exValue = e.target.value;
  if(exValue === "1/") {
    exValue = `0${exValue}`;
  }
  let dateArr = exValue.split('');
  let finalArr = dateArr.filter((char, index)=> !(char === '/' && index !== 2));
  finalArr = finalArr.join("");
  let setVal=finalArr?.slice(0,5);
  setVal=cardExpiry(setVal,props.form)
  handleInputChangeEx(setVal,setInitialValues);
  props.form.setFieldValue('expiryDate',setVal)
}
const handleDatekeydown=(e,props)=>{
  var key = e.keyCode || e.charCode;
  if( key === 8 || key === 46 ){
    props.form.setStatus('backspace')
  }else{
    props.form.setStatus('')
  }
}
const PaymentForm = () => {

  const [initialValues, setInitialValues] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvc: "",
    postalCode: "",
    checkTerms: false,
  })
  const [disabled, setDisabled] = useState(true);

  const { userAccount } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.payment);
  const [touchedField,setTouched]=useState({})
  const [errField,setErrField]=useState({})

  const dispatch = useDispatch();
  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    if (name === "checkTerms") {
      setInitialValues(prevState => ({
        ...prevState,
        [name]: target.checked
      }));
    } else {
      setInitialValues(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  useEffect(() => {
    if (
      initialValues?.cardName === "" ||
      initialValues?.cardNumber === "" ||
      initialValues?.expiryDate === "" ||
      initialValues?.cvc === "" ||
      initialValues?.postalCode === "" ||
      initialValues?.checkTerms === false
    ) {
      
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [initialValues]);

  useEffect(() => {
    if (userAccount?.firstName && userAccount?.lastName) {
      document.querySelector(".cardNumber").focus();
      setInitialValues(prevState => ({
        ...prevState,
        cardName: userAccount?.firstName + ' ' + userAccount?.lastName
      }));
    } else {
      document.querySelector(".cardHolder").focus();
    }
  }, [userAccount]);

  useEffect(() => {
    localStorage.setItem("temp_email", "some_random@email.com");
  }, []);

  

  const handleSubmitAction = (values) => {
    if (isLoading || disabled) {
      setErrField(prev=>({cardName:"This is required.",cardNumber:"This is required.",expiryDate:"This is required.",cvc:"This is required.",postalCode:"This is required.",...prev}))
      setTouched(prev=>({cardName:true,cardNumber:true,expiryDate:true,cvc:true,postalCode:true,...prev}))
      return;
    }
    const { firstName, lastName } = getCardNames(initialValues?.cardName);
    const { month, year } = getDateStrings(initialValues?.expiryDate);
    const formData = {
      "UserInformation": {
        "Firstname": firstName || userAccount?.firstName,
        "Lastname": lastName || userAccount?.lastName,
        "EmailAddress": localStorage.getItem("temp_email") || userAccount?.email,
        "PlanId": 19578
      },
      "BillingInformation": {
        "Address": "",
        "Phone": "",
        "State": "",
        "Country": "",
        "CityName": "",
        "Zipcode": initialValues?.postalCode,
      },
      "CreditCardInformation": {
        "CreditCardNumber": initialValues?.cardNumber,
        "Cvv2Number": initialValues.cvc,
        "ExpirationMonth": month,
        "ExpirationYear": year,
      }
    }
    dispatch(submitCardDetails(formData));
  };

  const validateForm = values => {
    const errors = {};
    if (!initialValues.cardName) {
      setErrField(prev=>({...prev,cardName:'This is required.'}))
    }else{
      setErrField(prev=>({...prev,cardName:''}))
    }

   carNumberVaildate(initialValues,setErrField)
   expiryDateVaildate(initialValues,setErrField)
   cvcVaildate(initialValues,setErrField)

   

    if (!initialValues.postalCode) {
      setErrField(prev=>({...prev,postalCode:'This is required.'}))
      
      errors.postalCode = 'This is required.';
    } else if(initialValues.postalCode.length < 5) {
      setErrField(prev=>({...prev,postalCode:'Check your Zip or Postal code.'}))      
    }else{
      setErrField(prev=>({...prev,postalCode:''}))

    }

    return {};
};

const handleBlur=(e,formik)=>{
  formik.handleBlur(e);
  setTouched(prev=>({...prev,[e.target.name]:true}))
}
  return (
    <div key="Payment" className='form paymentdetail-form'>
      <Formik
      initialValues={initialValues}
        validateOnChange={false}
        validateOnBlur
        enableReinitialize={true}
        validate={validateForm}
        onSubmit={handleSubmitAction}
      >
        {(formik) => {
          return (
        <Form>
          <div className='mb-6'>
            <Typography size={14}><span className='text-gray-600 mb-0.5 block'>Name on card</span></Typography>
            <Field
              type="text"
              name="cardName"
            >
              {() => (
                <div>
                  <input onBlur={(e)=>handleBlur(e,formik)}  onChange={e => { handleInputChange(e) }} className={`cardHolder tw-input-text ${touchedField.cardName && errField.cardName && 'tw-error' }`} type="text" placeholder="" name="cardName" value={initialValues?.cardName} />
                </div>
              )}
            </Field>
            {touchedField.cardName && errField.cardName && (<Typography text="danger" weight="regular" size={12}><span className='block mt-1'>{errField.cardName}</span></Typography>)}

          </div>
          <div className='mb-3'>
            <div className='mb-2.5'>
              <Typography size={14}><span className='text-gray-600 mb-0.5 block'>Card information</span></Typography>
              <Field
                name="cardNumber"
                id="cardNumber"
              >
                {() => (
                  <div>
                    <NumberFormat onBlur={(e)=>handleBlur(e,formik)}  onChangeText={formik.handleReset} name="cardNumber" value={initialValues?.cardNumber}  className={`cardNumber tw-input-text ${touchedField.cardNumber && errField.cardNumber && 'tw-error' }`} placeholder="1234 1234 1234 1234" format={
                      initialValues?.cardNumber.slice(0, 2) === '37' || initialValues?.cardNumber.slice(0, 2) === '34' ? '#### ###### #####' : '#### #### #### ####'
                    } onChange={handleInputChange} />
                  </div>
                )}
              </Field>
              {touchedField.cardNumber && errField.cardNumber && (<Typography text="danger" weight="regular" size={12}>
              <span className='block mt-1'>{errField.cardNumber}</span></Typography>) }
            </div>
            <div className='flex flex-wrap -mx-1.5'>
              <div className='w-1/2 px-1.5 mb-3'>
                <Field
                  name="expiryDate"
                >
                  {(props) => {
                    
                    return (
                      <div>
                        <input name="expiryDate" placeholder="MM/YY"  onBlur={(e)=>handleBlur(e,formik)} className={`tw-input-text ${errField.expiryDate && touchedField.expiryDate && 'tw-error' }`} value={props.meta?.value} onKeyDown={(e)=>handleDatekeydown(e,props)} onKeyPress={(e)=>handleDateKeyPress(e)} onChange={(e)=>handleDateChange(e,props,setInitialValues)} />
                      </div>
                    )
                  }}
                </Field>
                {errField.expiryDate && touchedField.expiryDate && <Typography text="danger" weight="regular" size={12}><span className='block mt-1'>{errField.expiryDate}</span></Typography> }
              </div>
              <div className='w-1/2 px-1.5 mb-3'>
                <Field
                  name="cvc"
                >
                  {() => (
                    <div>
                      <NumberFormat name="cvc" placeholder="CVV" onBlur={(e)=>handleBlur(e,formik)} className={`tw-input-text ${errField.cvc && touchedField.cvc && 'tw-error' }`} value={initialValues?.cvc} format={'####'} onChange={handleInputChange} />
                    </div>
                  )}
                </Field>
                {errField.cvc && touchedField.cvc && <Typography text="danger" weight="regular" size={12}><span className='block mt-1'>{errField.cvc}</span></Typography> }
              </div>
            </div>
          </div>
          <div className='w-1/2 md:w-48 mb-7'>
            <Typography size={14}><span className='text-gray-600 whitespace-nowrap mb-0.5 block'>Billing Zip or Postal Code</span></Typography>
            <Field
              name="postalCode"
            >
              {() => (
                <div>
                  <input type="tel" name="postalCode" onBlur={(e)=>handleBlur(e,formik)} className={`tw-input-text ${errField.postalCode && touchedField.postalCode && 'tw-error' }`} placeholder="84604" onChange={handleInputChange} value={initialValues?.postalCode} />
                </div>
              )}
            </Field>
            {errField.postalCode && touchedField.postalCode && <Typography text="danger" weight="regular" size={12}><span className='block mt-1'>{errField.postalCode}</span></Typography> }
          </div>
          <div className='terms relative mb-8'>
            <div className='absolute left-0 -top-0.5 w-4'>
              <Field type="checkbox" name="checkTerms" checked={initialValues?.checkTerms} onChange={handleInputChange} />
            </div>
            <div className='pl-6'><Typography size={10} text='secondary'><span className='block'>I have read and agree to the <span className='text-blue-400 underline cursor-pointer'> Terms and Conditions</span> and <span className='text-blue-400 underline cursor-pointer'>Privacy Policy</span>. I consent to provide my billing information and email address for the purposes of creating and maintaining my account.</span>
            </Typography></div>
          </div>
          <div className='btn-wrap' >
            <Button
              buttonType="submit"
              size="large"
              title={isLoading ? "Processing..." : "Start Storied Plus"}
              disabled={disabled || isLoading}
              loading={isLoading}
            />
            <div className='flex mt-4 pt-0.5 justify-center items-center'>
              <Typography size={12}><span className='text-gray-600'>Powered by</span></Typography>
              <span className='mt-0.5 mx-1'>
                <svg width="34" height="14" viewBox="0 0 34 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_128_1192)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M34.045 7.23345C34.045 4.84094 32.8724 2.95312 30.6311 2.95312C28.3803 2.95312 27.0186 4.84094 27.0186 7.21476C27.0186 10.0278 28.6262 11.4483 30.9337 11.4483C32.0591 11.4483 32.9102 11.1959 33.5532 10.8408V8.97169C32.9102 9.28949 32.1725 9.4857 31.2363 9.4857C30.319 9.4857 29.5057 9.16797 29.4017 8.06519H34.0261C34.0261 7.94367 34.045 7.45773 34.045 7.23345ZM29.3733 6.34558C29.3733 5.28953 30.0258 4.85029 30.6216 4.85029C31.1984 4.85029 31.8132 5.28953 31.8132 6.34558H29.3733Z" fill="#747578" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M23.3685 2.95312C22.4417 2.95312 21.8459 3.38302 21.515 3.68208L21.392 3.10265H19.3115V13.9997L21.6757 13.5043L21.6852 10.8595C22.0256 11.1025 22.5269 11.4483 23.3591 11.4483C25.0519 11.4483 26.5933 10.1025 26.5933 7.14C26.5838 4.42973 25.0235 2.95312 23.3685 2.95312ZM22.8011 9.39225C22.2432 9.39225 21.9122 9.19597 21.6852 8.953L21.6757 5.48579C21.9216 5.21477 22.2621 5.02785 22.8011 5.02785C23.6617 5.02785 24.2575 5.98111 24.2575 7.20538C24.2575 8.45768 23.6712 9.39225 22.8011 9.39225Z" fill="#747578" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0576 2.40183L18.4313 1.89716V0L16.0576 0.495319V2.40183Z" fill="#747578" />
                    <path d="M18.4313 3.11169H16.0576V11.2891H18.4313V3.11169Z" fill="#747578" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5143 3.8035L13.363 3.11192H11.3203V11.2894H13.6845V5.74739C14.2425 5.02777 15.1882 5.15862 15.4813 5.26142V3.11192C15.1787 2.99977 14.0723 2.79417 13.5143 3.8035Z" fill="#747578" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.78572 1.08417L6.47821 1.57014L6.46875 9.05596C6.46875 10.4392 7.51844 11.4578 8.91811 11.4578C9.69352 11.4578 10.261 11.3177 10.5731 11.1494V9.25224C10.2705 9.37376 8.77623 9.80363 8.77623 8.4205V5.10279H10.5731V3.11217H8.77623L8.78572 1.08417Z" fill="#747578" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.39259 5.4858C2.39259 5.12131 2.69522 4.98113 3.19642 4.98113C3.91515 4.98113 4.82301 5.19608 5.54174 5.57924V3.38302C4.75681 3.07462 3.98135 2.95312 3.19642 2.95312C1.27668 2.95312 0 3.94376 0 5.59794C0 8.17733 3.59362 7.76615 3.59362 8.87824C3.59362 9.30818 3.21534 9.44832 2.68576 9.44832C1.90083 9.44832 0.898407 9.13059 0.104026 8.70072V10.925C0.983514 11.2988 1.87247 11.4577 2.68576 11.4577C4.65279 11.4577 6.00512 10.495 6.00512 8.82217C5.99567 6.03718 2.39259 6.53251 2.39259 5.4858Z" fill="#747578" />
                  </g>
                  <defs>
                    <clipPath id="clip0_128_1192">
                      <rect width="34" height="14" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </div>
          </div>
        </Form>
          )}
        }
        </Formik>
    </div>
  )
}

export default PaymentForm
