import { Field } from "formik";
import { tr } from "../../../../components/utils";
import { useTranslation } from "react-i18next";
import {
    getKeywordsArr
} from "./../../../../utils";
import CrossButton from "./CrossButton"
import { useEffect } from "react";
import {
    getFieldClass
} from "shared-logics";

const getCrossButton = (values, index) => {
    return  (values[index].m && values[index].t)
}
 
const Keywords = ({ push,
    remove,
    form: { values, touched, errors, setFieldValue } }) => {
    const { t } = useTranslation();
    const getKeywordsArray = getKeywordsArr(tr, t);
    useEffect(() => {
        let selectArr = [];
        values.k.forEach((val, index) => {
            if (!(val.m && val.t)) {
                selectArr.push(index)
            }
        })
        if (selectArr.length === 0 && values.k.length< 4) {
            push({m:"",t:""})
        } else if( selectArr.length > 1) {
            selectArr.forEach((removeIndex, index)=> {
                if(index !== 0 ) {
                    remove(removeIndex)
                }
            })
        }
    }, [values.k]);
    return (<>
        <div className="Keywordfields">
            {(values.k || []).map((item, index) => {
                return (<>
                     <div className={`flex items-start flex-wrap md:flex-nowrap relative -mx-2 md:mb-0 mb-4 ${!getCrossButton(values.k, index) ? 'no-cross': 'cross-exist'}`}>
                            <div className="cross-field md:w-8/12 flex items-center relative mx-2 mb-4">
                                <Field as="select" name={`k.${index}.m`}>
                                    {(props) => {
                                        const { field } = props;
                                        return (
                                            <select
                                                {...field}
                                                className={`appearance-none w-full pr-10 py-2 px-3 border border-gray-300 z-10 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${(getFieldClass(touched?.k?.[index]?.m, errors?.k?.[index].m) || getFieldClass(touched.k?.[index]?.t, errors.k?.[index].t))?"border-transparent ring-2 ring-maroon-400 focus:ring-maroon-400":"border  focus:ring-blue-400"} ${values.k?.[index]?.m?"select-value": "empty-value"}`}
                                            >
                                            <option value = "" disabled >Add Another Rule</option>
                                            {Object.entries(getKeywordsArray).map(
                                                (keysItem) => {
                                                    let selectedArr = values.k.map(
                                                        (y) =>y.m
                                                    ),
                                                    cond = selectedArr.includes(keysItem[0])
                                                        return (
                                                            <option
                                                                key={keysItem[0]}
                                                                value={keysItem[0]}
                                                                disabled={cond || (keysItem[0] === "" && values.k[index].m) }
                                                            >
                                                                {keysItem[1]}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                                </select>
                                            );
                                    }}
                                    </Field>
                                    <div className="absolute right-0 mr-1 h-10 w-10 flex items-center justify-center rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                            <path d="M1.375 1.40562L6.735 6.76512C6.76978 6.79995 6.81109 6.82759 6.85656 6.84644C6.90203 6.8653 6.95078 6.875 7 6.875C7.04922 6.875 7.09797 6.8653 7.14344 6.84644C7.18891 6.82759 7.23022 6.79995 7.265 6.76512L12.625 1.40562" stroke="#555658" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                            </div> 

                            <div className="w-full mx-2 md:mb-4">
                                <div className="flex">
                                    <Field className="w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" type="text"
                                        name={`k.${index}.t`}
                                    />
                                </div>
                            </div>
                            {getCrossButton(values.k, index) && <CrossButton handleClick={() => remove(index)} />}
                        </div>
                 </>
                )
            })}
        </div>
            </>)
}                 
                        
export default Keywords;