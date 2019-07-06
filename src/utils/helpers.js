import bcrypt from 'bcrypt';

/**
 * @description: This function paginates the data from a model
 *
 * @method: paginate
 *
 * @param {string} page
 * @param {string} limit
 *
 * @return {object}
 */
export const paginate = ({ page, limit }) => {
    const limit_ = Number(limit)
    const offset = Number(page - 1) * Number(limit_)

    return { offset, limit: limit_, subQuery: false }
}

/**
 * @description: This function trims the length of a text
 * based on the length passed and adds an elipsis
 *
 * @method: trimTextLength
 *
 * @param {string} string
 * @param {int} length
 *
 * @return {string}
 */
const trimTextLength = (string, length) => {
    const ellipsis = "..."
    const trimmedString = string.substring(0, length).concat(ellipsis);
    if (!length || string.length === length || length >= 200) {
        return string
    }
    return trimmedString
}

/**
 * @description: This is a helper function that alters the description field
 * of an model
 *
 * @method: alterDescriptionField
 *
 * @param {object} products
 * @param {int} description_length
 *
 * @return {object}
 */
export const alterDescriptionField = (products, description_length) => {
    const { rows } = products
    rows.forEach(element => {
        const { description } = element
        const descriptionLength = trimTextLength(description, description_length)
        element['description'] = descriptionLength
    });
    return products[rows]
}

/**
 * @description: This function encodes data from a customer model using jwt
 * and signs it and passed in as an element in the response body.
 *
 * @method: customerResponse
 *
 * @param {object} customer
 * @param {object} jwt
 * @param {object} res
 * 
 */
export const customerResponse = (customer, jwt, res) => {
    const payload = {
        customerId: customer.customer_id,
        name: customer.name,
        role: 'customer'
    }
    const token = jwt.sign(
        payload,
        process.env.SECRET,
        { expiresIn: '24h' });
    res.status(201).json({
        customer: customer,
        accessToken: `Bearer ${token}`,
        expires_in: "24h"
    });
}

/**
 * @description: Generates hash from plain password
 * @param {String} plainText
 * @return {String} hash
 */
export const generateHash = (plainText) => {
    const hash = bcrypt.hashSync(plainText, 3);
    return hash;
}

/**
 * @description: Verifies plain password against hashed DB password
 * @param {String} plainText
 * @param {String} hashFromDB
 * @return {Boolean} result
 */
export const verifyPassword = (plainText, hashFromDB) => {
    const result = bcrypt.compareSync(plainText, hashFromDB);
    return result;
}

/**
  * @description: Checks for null entries
  * @param {Array} entries Array of key/value pairs to check
  * @return {object} errorMessage Concatenated validation error messages
  */
export const checkEmpty = (entries) => {
    let entryName, entryValue, obj = '';
    entries.forEach((entry) => {
        entryName = Object.keys(entry)[0];
        entryValue = Object.values(entry)[0];
        if (entryValue === undefined) {
            obj = {
                message: 'The object key is invalid or not provided.',
                name: entryName

            }
        }
    });
    return obj;
}
