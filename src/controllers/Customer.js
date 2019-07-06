import jwt from 'jsonwebtoken';
import model from '../../models/'
import { errorResponse } from '../utils/errors'
import { 
    customerResponse, generateHash, 
    verifyPassword, checkEmpty 
} from '../utils/helpers';

const { Customer } = model;

/**
 * @description: A class containing all the Customer controllers
 *
 * @class: CustomerController
 *
 */
class CustomerController {

    /**
    * @description: This method creates a new customer
    *
    * @method: createCustomer
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing the user objects/details
    * and token.
    */
    static createCustomer = async (req, res, next) => {
        const { name, email, password } = req.body
        const error = checkEmpty([
            { name },
            { email },
            { password }])
        if (error) {
            return res.status(400).json(
                errorResponse("USR_12", 400, error.message, error.name))
        }
        const hashedPassword = generateHash(password)
        try {
            const userExist = await Customer.findOne({ where: { email } })
            if (userExist) {
                res.status(409).json(
                    errorResponse("USR_04", 409,"The email already exists.", "email"))
            }
            const createCustomer = await Customer.create({
                name, email,
                password: hashedPassword
            })
            customerResponse(createCustomer, jwt, res)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method enables a user to login after creating an account
    *
    * @method: loginCustomer
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing the user objects/details
    * and token.
    */
    static loginCustomer = async (req, res, next) => {
        const { email, password } = req.body
        const error = checkEmpty([
            { email },
            { password }])
        if (error) {
            return res.status(400).json(
                errorResponse("USR_12", 400, error.message, error.name))
        }
        try {
            const customer = await Customer.findOne({
                where: { email }
            })
            if (!customer) {
                return res.status(404).json(
                    errorResponse("USR_05", 404,
                        "The email doesn't exist.", "email")
                )
            }
            const valid = verifyPassword(password, customer.password)
            if (!valid) {
                return res.status(400).json(
                    errorResponse("USR_01", 400,"Password is invalid.", "password"))
            } else {
                customerResponse(customer, jwt, res)
            }
        } catch (err) {
            next()
        }
    }


    /**
    * @description: This method enables a user to update their account profile
    *
    * @method: updateCustomerProfile
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing the user objects/details
    * and token.
    */
    static updateCustomerProfile = async (req, res, next) => {
        const { name, email, password,
            day_phone, eve_phone, mob_phone } = req.body
        const error = checkEmpty([
            { name }, { email }, { password },
            { day_phone }, { eve_phone }, { mob_phone }
        ])
        if (error) {
            return res.status(400).json(
                errorResponse("USR_12", 400, error.message, error.name))
        }
        const { customerId } = req.user
        try {
            const customer = await Customer.findByPk(customerId)
            if (!customer) {
                return res.status(404).json(
                    errorResponse("USR_05", 404,"The email doesn't exist", "email"))
            }
            const updatedProfile = await customer.update({
                name, email, password, day_phone, eve_phone, mob_phone
            })
            return res.json(updatedProfile)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method enables a user to update their address
    *
    * @method: updateCustomerAddress
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing the user objects/details
    * and token.
    */
    static updateCustomerAddress = async (req, res, next) => {
        const { address_1, address_2, city,
            region, postal_code, country, shipping_region_id } = req.body
        const error = checkEmpty([
            { address_1 }, { address_2 }, { city },
            { region }, { postal_code }, { country }, { shipping_region_id }
        ])
        if (error) {
            return res.status(400).json(
                errorResponse("USR_12", 400, error.message, error.name))
        }
        const { customerId } = req.user
        try {
            const customer = await Customer.findByPk(customerId)
            if (!customer) {
                return res.status(404).json(
                    errorResponse("USR_05", 404,"The email doesn't exist", "email"))
            }
            const updatedAddress = await customer.update({
                address_1, address_2,
                city, region, postal_code, country,
                shipping_region_id
            })
            return res.json(updatedAddress)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method enables a user to add their credit card details
    *
    * @method: customerCreditCard
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing the user objects/details
    * and token.
    */
    static customerCreditCard = async (req, res, next) => {
        const { credit_card } = req.body
        const error = checkEmpty([
            { credit_card }])
        if (error) {
            res.status(400).json(
                errorResponse("USR_12", 400, error.message, error.name))
        }
        const { customerId } = req.user
        try {
            const customer = await Customer.findByPk(customerId)
            if (!customer) {
                return res.status(404).json(
                    errorResponse("USR_05", 404,
                        "User does not exist", "email")
                )
            }
            const newCreditCard = credit_card.replace(/\s+/g, '');
            if (newCreditCard.length !== 12) {
                return res.status(400).json(
                    errorResponse("USR_08", 400,
                        "This is an invalid Credit Card. Card should be 12 digit pin",
                        "credit card")
                )
            }
            const updateCreditCard = await customer.update({
                credit_card: newCreditCard
            })
            const creditCard = updateCreditCard.credit_card
            const hiddenDigits = creditCard.slice(0, 8).replace(/[0-9]/g, "x")
            const visibleDigits = creditCard.slice(8, 12)
            updateCreditCard.credit_card = `${hiddenDigits}${visibleDigits}`
            return res.json(updateCreditCard)
        } catch (err) {
            next()
        }
    }
}

export default CustomerController;
