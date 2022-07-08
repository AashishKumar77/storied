let errors = {};

export const getMessage = (key) => {
    if(key === "firstName") return "First name must contain letters.";
    else return "Last name must contain letters."
}

export const validateForm = (key, value) => {
    // eslint-disable-next-line
    let numbersRegx = /^\d*$/;
    // eslint-disable-next-line
    let specialCharsRegx = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if((key === "firstName" || key === "lastName") && value !== ""){
        if (value.match(numbersRegx) || value.match(specialCharsRegx)) {
            errors[key] = getMessage(key);
        }else{
            delete errors[key];
        }
    }
    return sortErrors(errors);
};

export const sortErrors = (err) => {
    let sortedErrors = {};
    if(err?.firstName) sortedErrors.firstName = err.firstName;
    if(err?.lastName) sortedErrors.lastName = err.lastName;
    if(err?.birth) sortedErrors.birth = err.birth;
    if(err?.birthPlace) sortedErrors.birthPlace = err.birthPlace;
    if(err?.death) sortedErrors.death = err.death;
    if(err?.deathPlace) sortedErrors.deathPlace = err.deathPlace;
    return sortedErrors;
}

export const emptyErrors = () => {
    errors = {}
}