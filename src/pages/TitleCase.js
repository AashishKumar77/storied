import React,{useState} from "react"
import Input from "../components/Input";

  const TitleCase = () => {
    const [textareavalue, settextareavalue] = useState("");
    const handleChange = (e) => {
      settextareavalue(e.target.value) 
    }

    return (
      <div className="flex justify-center w-full">
        <div className="mt-24 w-80">
            <Input placeholder="Start typing..." name="titlecase" handleChange= {handleChange} value={textareavalue} />
        </div>
      </div>
    )}
    export default TitleCase; 