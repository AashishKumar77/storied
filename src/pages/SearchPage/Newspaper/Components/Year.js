const Year = ({field, form, ...props}) => {
    const currentYear  = new Date().getFullYear();
    const range = currentYear - 1607 + 1;
    return <select
    {...props}
    {...field}
    onChange = {(e)=> {
        field.onChange(e)
        props.onChange && props.onChange(e)
    }}
    className={`appearance-none w-full pr-10 py-2 px-3 border-gray-300 z-10 bg-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${props.className}`}
    >
        <option value="">Year</option>
        {Array.from({length:range},(v,k)=>{
           return  currentYear-k
        })
        .map(year=><option key= {year} value={year}>{year}</option>)}
</select>
}
export default Year;