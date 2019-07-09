
export const isEmail = (value) => {
    if(typeof value !== 'string' || value.length < 1) return false;
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
}

export const isPhone = (value) => {
    let re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
    return re.test(value);
}

export const isValidPassword = (value) => {
    return typeof value === 'string' && value.length > 6
}

export const isPostalCode = value => {
    let re = "^\d{5}([\-]?\d{4})?$";
    return re.test(value);
}

export const isValidCreditCard = value => {
    let re = "/(\d{4}[-. ]?){4}|\d{4}[-. ]?\d{6}[-. ]?\d{5}/g";
    return re.test(value);
}

export const isString = value => {
    return typeof value === 'string';
}

export const exceedLength = (value, len) => {
    return value.length > len;
}