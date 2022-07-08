export const getFieldName = (code) => {
	switch(code){
        case "givennameonlynumbers":
            return "firstName";

        case "surnameonlynumbers":
            return "lastName";
        
        case "invalidbirthdate":
        case "futurebirthdate":
            return "birth";

        case "birthplaceonlynumbers":
            return "birthPlace";
        
        case "invaliddeathdate":
        case "futuredeathdate":
        case "motherdeathdateisbeforechildbirthdate":
            return "death";

        case "deathplaceonlynumbers":
            return "deathPlace";
        
        default:
            return null;
    }
}

export const getTreeErrors = (errors) => {
    if(errors && errors.length > 0){
        let listOfErrors = errors.reduce((res, ele) => {
            res.push({ [getFieldName(ele.code)]: ele.description })
        return res;
        },[]);
        if(listOfErrors.length > 0) return listOfErrors[0];
        else return null;
    }else return null;
}