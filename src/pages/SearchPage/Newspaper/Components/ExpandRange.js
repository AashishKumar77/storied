const ExpandRange = ({field, form, ...props}) => {
    return <select
    {...props}
    {...field}
    onChange = {(e)=> {
        field.onChange(e)
        props.onChange && props.onChange(e)
    }}
    className="appearance-none w-full pr-10 py-2 px-3 border border-gray-300 z-10 bg-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
    >
        <option value="0">±0 years</option>
        <option value="1">±1 years</option>
        <option value="3">±3 years</option>
        <option value="5">±5 years</option>
        <option value="10">±10 years</option>
        
</select>
}
export default ExpandRange;