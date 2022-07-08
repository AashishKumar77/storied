import React, { useRef, useEffect, useCallback } from 'react';
import Typeahead from '../Typeahead';
import { tr } from "../../components/utils";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
// Actions
import { getAutoCompleteTest } from "../../redux/actions/family";
import { getLocationGUID } from "../../redux/actions/ww1";
import { getApiCancelToken } from "../../redux/requests";
import { getRelatedValue } from "./../../utils"
var timer;
const getSearchText = (val) => (val) ? val : ""

const getLocationGUIDCall = async (id, name, form, props, field) => {
    form.setFieldValue(`${field.name}`, { id: id, name: name })
    if (props.searchType) {
        const data = await getLocationGUID(id);
        if (data) {
            form.setFieldValue(`${field.name}`, { id: id, name: name, "levelData": data })
            if (props.relatedField) {
                const relatedValue = getRelatedValue(form.values.matchExact, data.residenceLevel ? Object.keys(data.residenceLevel)[0] : "")
                form.setFieldValue(`${props.relatedField}`, relatedValue);
            }
        }
    }
}
const cancelPreviousToken = (source) => {
    if (source.current) {
        source.current.cancel();
    }
}
const SearchLocation = ({ field, form, ...props }) => {
    const { t } = useTranslation();
    const { options, optionLoading } = useSelector(state => {
        return state.family
    });
    const source = useRef(null);
    const periousName = useRef(null);
    let requestId = useRef(null);
    const dispatch = useDispatch();
    const callbackApi = useCallback((val) => {
        requestId.current = uuidv4();
        if (timer) {
            clearTimeout(timer);
        }
        const searchText = getSearchText(val)
        timer = setTimeout(() => {
            if (periousName.current !== searchText) {
                periousName.current = searchText
                cancelPreviousToken(source)
                const sourceToken = getApiCancelToken();
                source.current = sourceToken;
                dispatch({ type: "AUTOCOMPLETE_REQUEST" })
                dispatch(getAutoCompleteTest(searchText, sourceToken, requestId.current));
            }
        }, 250)
    }, [dispatch])
    useEffect(() => {
        if (!periousName.current) {
            callbackApi(field?.value?.name || "")
        }
    }, [callbackApi, periousName])
    const loadNextPage = (page) => {
        const sourceToken = getApiCancelToken();
        source.current = sourceToken;
        dispatch({ type: "AUTOCOMPLETE_PAGINATION_REQUEST" })
        dispatch(getAutoCompleteTest(periousName.current, sourceToken, requestId.current, page));
    }
    const handleChange = (val, page) => {
        if (val?.id) {
            getLocationGUIDCall(val.id, val.name, form, props, field)
        } else {
            form.setFieldValue(`${field.name}`, { "id": "", name: val?.name || "" });
        }
    }
    const value = field.value;
    return (
        <div className="flex w-full mt-0">
            <Typeahead
                id={props.id}
                options={options}
                optionLoading={optionLoading}
                handleChange={handleChange}
                pagination={true}
                {...props}
                callbackApi={callbackApi}
                loadNextPage={loadNextPage}
                highlight={props.highlight}
                placeholder={props.placeholder ? props.placeholder : tr(t, "search.unisearchform.autocomplete")}
                getOptionLabel={(option) => {
                    return option.name || ""
                }}
                value={value}
                loading={optionLoading}
            />
        </div>
    );
}

SearchLocation.defaultProps = {
    searchType: false,
    highlight: false
}

export default SearchLocation;