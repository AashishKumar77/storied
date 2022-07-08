import { getResidence, getLevelCheck, strFirstlowerCase, getDate, getMaskDate } from "../../utils";
import * as API_URLS from "./../constants/apiUrl";
import { callApi } from "./index";
import { v4 as uuidv4 } from "uuid";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};
const levelCheck = getLevelCheck();
const residence = getResidence();
const getImageId = (item) => item?.image_id || item?.imageID;
const isMaskKey = (maskingFields, maskObj, field, key) => {
  const maskList = (maskingFields || []).map((name) => (name.substring(name.length - 3) == "_id" ? name.toLowerCase().slice(0, -3) : name.toLowerCase()));
  if (maskList.includes(key.toLowerCase())) {
    maskObj[field] = field;
  }
};
export const getLocationGUID = (_id) => {
  let url = `${API_URLS.PLACEAUTHIRITY}/${_id}`,
    staticHeader = createHeader();
  return callApi({}, "GET", url, null, false, staticHeader)
    .then((res) => {
      const data = res.data;
      let { options, optionsLevel } = getLevelLocation(data.level, _id, data.parent, {}, {});
      options["search.form.dropdown.broad"] = _id;
      optionsLevel["4"] = "search.form.dropdown.broad";
      return {
        residenceId: options,
        residenceLevel: optionsLevel,
      };
    })
    .catch(() => {
      return {
        residenceId: {},
        residenceLevel: {},
      };
    });
};
const getLevelLocation = (level, _id, parentData, options, optionsLevel) => {
  if (levelCheck[level]) {
    const type = levelCheck[level];
    if (residence[type] && !options[type]) {
      options[type] = _id;
      optionsLevel[residence[type]] = type;
    }
  }
  if (parentData) {
    return getLevelLocation(parentData.level, parentData.placeId, parentData.parent, options, optionsLevel);
  }
  return {
    options,
    optionsLevel,
  };
};
export const getDataList = (dataSource, placeIdsArr, places, rawObj) => {
  let res = [];
  res = dataSource.map((_d) => {
    const keys = Object.keys(_d);
    keys.forEach((_obj) => {
      if (placeIdsArr.includes(_d[_obj])) {
        if (places[_d[_obj]]) {
          _d[_obj] = places[_d[_obj]];
        } else {
          _d[_obj] = rawObj[_obj];
        }
      }
    });
    return _d;
  });
  return res;
};
export const getKeyName = (item) => {
  let _res = [],
    arrObj = item.cosmosDerivatives || [];
  arrObj.forEach((element) => {
    if (element === "_id" && item.fieldDictionaryResponse.outputFieldType === "GUID") {
      _res.unshift({
        key: `${strFirstlowerCase(item.fieldDictionaryResponse.fieldDictionaryName)}`,
        type: item.fieldDictionaryResponse.outputFieldType,
        indexSearchiness: item.fieldDictionaryResponse.indexSearchiness,
      });
    } else {
      _res.push({
        key: `${strFirstlowerCase(item.fieldDictionaryResponse.fieldDictionaryName)}${element}`,
        type: item.fieldDictionaryResponse.outputFieldType === "GUID" ? "Text" : item.fieldDictionaryResponse.outputFieldType,
        indexSearchiness: item.fieldDictionaryResponse.indexSearchiness,
      });
    }
  });
  return _res;
};
export const getHeadersCount = (contentCatalog, cKeys) => {
  contentCatalog?.columnBasedResultsDisplayOrder.forEach((item) => {
    if (item.fieldDictionaryResponse.columnBasedResultsColumnLabel) {
      cKeys[item.fieldDictionaryResponse.columnBasedResultsColumnLabel] = getKeyName(item);
    }
  });
};
export const getRecordHeadersCount = (contentCatalog, cKeys) => {
  contentCatalog?.recordViewerDisplayOrder.forEach((element) => {
    if (element.fieldDictionaryResponse.recordViewerDisplayLabel) {
      cKeys[element.fieldDictionaryResponse.recordViewerDisplayLabel] = getKeyName(element);
    }
  });
};
const isKeyFound = (columnKey, newObj) => {
  let found = false;
  columnKey.forEach((item, i) => {
    if (columnKey[i].name == newObj.name && columnKey[i].key === newObj.key && columnKey[i].type === newObj.type && columnKey[i].indexSearchiness === newObj.indexSearchiness) {
      found = true;
      return false;
    }
  });
  return found;
};
const getObjectKeys = (keys, items) => {
  let columnkey = [];
  Object.entries(keys).forEach((_obj) => {
    const _label = _obj[0];
    const _key = _obj[1];
    _key.forEach((element) => {
      items.forEach((item) => {
        for (const [key, value] of Object.entries(item)) {
          if (key === element.key && value !== null) {
            const newObj = { name: _label, ...element };
            if (!isKeyFound(columnkey, newObj)) {
              columnkey.push(newObj);
            }
          }
        }
      });
    });
  });
  return columnkey;
};
const getDateField = (obj, items, _key, _label, dataList) => {
  if (items[_key]?.rawDate) {
    obj[_label] = getDate(items[_key]);
  } else if (dataList?.maskingFields) {
    obj[_label] = getMaskDate(items[_key]);
  }
};
export const dataListRecords = (dataList, cKeys, dataSource) => {
  let maskObj = {};
  let newObjKey = getObjectKeys(cKeys, dataList?.documents);
  dataList?.documents.forEach((items) => {
    maskObj = {};
    let obj = {
      recordId: items?.recordId,
      partitionKey: items?.partitionKey,
      imageId: getImageId(items),
    };
    newObjKey.forEach((_obj) => {
      const _label = _obj.name,
        _key = _obj.key,
        _type = _obj.type,
        _indexSearchiness = _obj.indexSearchiness;
      if (!obj[_label]) {
        if (_type === "GUID" && _indexSearchiness === "Place") {
          obj[_label] = items[_key]?.fullChainName;
        } else if (_type === "Date") {
          getDateField(obj, items, _key, _label, dataList);
        } else {
          if (items[_key]?.value) {
            obj[_label] = items[_key].value;
          }
        }
        dataList?.maskingFields && isMaskKey(dataList.maskingFields, maskObj, _label, _key);
      }
    });
    dataSource.push(obj);
  });
  return Object.keys(maskObj);
};
