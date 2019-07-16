import currencyValues from "./currency";

const emailRegEx = /\S+@\S+\.\S+/;

const checkFormData = data => !data || !data.trim();
const checkEmailField = data => !data || !data.trim() || !emailRegEx.test(data);
const checkId = data => !data || !Number(data);
const checkAmount = data => !data || !Number(data) || data % 1 !== 0;
const checkCurrency = data =>
  currencyValues.filter(curr => curr === data.toUpperCase().trim()).length !==
  1; 

export { checkFormData, checkEmailField, checkId, checkAmount, checkCurrency };
