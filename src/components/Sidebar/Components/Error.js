import errIcon from '../../../assets/images/err-icon.svg';

const Error = ({ modalState, msg="Record Failed To Save",btnText,desc,imgs }) => {
    return <div>
        <div className="text-center relative -top-9">
            <img src={imgs?imgs:errIcon} className="inline-block" alt="icon" />
        </div>
        <div className="err-text text-center relative -top-5">
            <h3 className="font-bold text-2xl mb-3">{msg}</h3>
<p className="text-sm">{desc?desc:'Something went wrong on our end. Please try again later.'}</p>
        </div>
        <div className="text-center pt-2 pb-5">
<button className="rounded-lg px-5 py-2 bg-maroon-400 text-base font-medium text-white hover:bg-maroon-500" type="button" onClick={() => modalState(false)}>{btnText}</button>
        </div>
    </div>
}
export default Error;