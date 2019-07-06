/**
 * @description: A utitlity function that sends error object as response
 * 
 * @function: errorResponse
 * 
 * @param {string} code: request parameter
 * @param {string} status: response object
 * @param {string} message: error response
 * @param {string} field: error response
 * 
 * @return {object}: Error response
 */
export const errorResponse = (code, status, message, field) => {
    return { code, status, message, field }
};


export const stripeErrorResponse = (code, message, field) => {
    return { "error": { code, message, field } }
}
