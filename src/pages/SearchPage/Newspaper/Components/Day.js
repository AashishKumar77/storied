const dayData = {
    "1": 31,
    "2": 28,
    "3": 31,
    "4": 30,
    "5": 31,
    "6": 30,
    "7": 31,
    "8": 31,
    "9": 30,
    "10": 31,
    "11": 30,
    "12": 31
};
const getDay = (year, month) => {
    let number = 0
    if( month && year ) {
        number = dayData[month]
        if(year%4 === 0 && month=== 'feb') {
            number = number+1
        }
    }
    return number;
}
const Day = ({field, form, ...props}) => {
    const range = getDay(props.year, props.month)
    return <select
    {...props}
    {...field}
    onChange = {(e)=> {
        field.onChange(e)
        props.onChange && props.onChange(e)
    }}
    disabled = {range === 0}
    className={`appearance-none w-full pr-10 py-2 px-3 border-gray-300 z-10 bg-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${props.className}`}
    >
        <option value="">Day</option>
        {Array.from({length:range},(v,k)=>{
           return  k+1
        })
        .map(day=><option key= {day} value={day}>{day}</option>)}
</select>
}
export default Day;