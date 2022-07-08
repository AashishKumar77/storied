export const CheckExactField = (setFieldValue, e) => {
   const value = parseInt(e.target.value);
   if (value !== 0) {
      setFieldValue("matchExact", false);
   }
};

export const getFirstAndLastName = () => {
   return {
      0: "search.form.dropdown.exact", //"Exact"
      1: "search.form.dropdown.similar", //"Similar"
      2: "search.form.dropdown.broad", //"Broad"
   };
};

export const handleSearchType = (
   e,
   handleChange,
   setFieldValue,
   name,
   match,
   values,
   defaultTypeSearch
) => {
   handleChange(e);
   if (!e.target.value) {
      setFieldValue(`${name}.s`, defaultTypeSearch[match] || "2");
   } else {
      if (values.matchExact) {
         setFieldValue(`${name}.s`, defaultTypeSearch[match] || "0");
      }
   }
};

export const getLastNode = (obj, path) => {
   var keys = path.split('.');
   var keyExists = function (newObj, keyList) {
      var cur = keyList.shift();
      if (newObj.hasOwnProperty(cur)) {
         if (keyList.length <= 0) {
            return newObj[cur];
         } else {
            return keyExists(newObj[cur], keyList);
         }
      } else {
         return {};
      }
   };

   if (obj && typeof obj == "object" && keys.length > 0) {
      return keyExists(obj, keys);
   } else {
      return {};

   }
}