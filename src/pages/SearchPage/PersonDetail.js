import React, { useState } from "react";
import Typography from "./../../components/Typography";
const rowsData = 4;
const getMaskStr = (content, maskClass) => {
  let _html = [],
    index = content?.indexOf?.("||"),
    arr = [];
  if (index === 0) {
    arr = content.split(",") || [];
    arr.forEach((item, i) => {
      _html.push(
        <span key={i} className={item.trim().indexOf("||") == 0 ? maskClass : ""}>
          {item.replaceAll("||", "")}
        </span>
      );
    });
  } else {
    _html = <span className={maskClass}>{content}</span>;
  }
  return _html;
};
const getFieldValue = (values, mask) => {
  let maskContent = null,
    maskClass = "filter blur-sm",
    data = [];
  values.forEach((_value) => {
    data.push({ value: _value.text, mask: mask ? maskClass : "" });
  });
  maskContent = getMaskStr(data[0]?.value, data[0]?.mask);
  return maskContent;
};
const getKeyValueData = (field, i) => {
  return (
    <div key={i} className="grid grid-cols-10 mt-2">
      <div className="col-span-3 lg:col-span-2">
        <p className="label text-gray-500 text-sm">
          <Typography size={14}>{field.key}</Typography>
        </p>
      </div>
      <div className="col-span-7 lg:col-span-8">
        <p className="pl-1 sm:pl-0 md:pl-2">
          <span className={`text-sm defaultText secondary-color text-sm typo-font-regular`}>{getFieldValue(field.value, field.mask)}</span>
        </p>
      </div>
    </div>
  );
};
const PersonDetail = ({ item }) => {
  const [isMore, setMore] = useState(false);
  const data = isMore ? item.appenedFiles : item.appenedFiles.slice(0, rowsData);
  const handleIsMore = (e) => {
    e.stopPropagation();
    setMore(true);
  };
  return (
    <>
      <div className="person-detail">
        {data?.map((appendFiles, i) => {
          return getKeyValueData(appendFiles, i);
        })}
      </div>
      <div>
        {!isMore && item.appenedFiles.length > rowsData && (
          <span onClick={(e) => handleIsMore(e)} className="text-gray-500 text-sm mt-1 p-2 cursor-pointer relative -inset-x-2 hover:bg-blue-200 rounded-lg">
            + More
          </span>
        )}
      </div>
    </>
  );
};
export default PersonDetail;
