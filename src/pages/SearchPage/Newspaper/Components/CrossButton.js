const CrossButton = ({ buttonClass, handleClick}) => {
    return <button type="button" className={buttonClass} onClick={handleClick}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 13L13 1" stroke="#747578" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M13 13L1 1" stroke="#747578" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg></button>
}
CrossButton.defaultProps = {
    buttonClass: "p-3 ml-2 mr-2 md:relative absolute right-0 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 rounded-lg outline-none focus:outline-none",
}
export default CrossButton;