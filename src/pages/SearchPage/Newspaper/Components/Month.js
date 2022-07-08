const months = {
    "1": "January",
    "2": 'February',
    "3": 'March',
    "4": 'April',
    "5": 'May',
    "6": 'June',
    "7": 'July',
    "8": 'August',
    "9": 'September',
    "10": 'October',
    "11": 'November',
    "12": 'December'
}
const Month = ({field, form, ...props}) => {
    return <select
    {...props}
    {...field}
    onChange = {(e)=> {
        field.onChange(e)
        props.onChange && props.onChange(e)
    }}
    className={`appearance-none w-full pr-10 py-2 px-3 border-gray-300 z-10 bg-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${props.className}`}
    >
        <option value="">Month</option>
        {Object.entries(months).map((month)=>{
            return <option key={month[0]} value={month[0]}>{month[1]}</option>
        })}
</select>
}
export default Month;