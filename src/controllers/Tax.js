import model from '../../models/';
import { errorResponse } from '../utils/errors';
const { Tax } = model;


/**
 * @description: A class containing all Tax controllers
 *
 * @class: TaxController
 *
 */
class TaxController{

    /**
    * @description: This method gets all existing Tax
    *
    * @method: getAllTaxes
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing a tax object
    */
    static getAllTaxes = async(req, res, next) =>{
        try {
            const taxes = await Tax.findAll()
            return res.json(taxes)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets a single tax
    *
    * @method: getSingleTax
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing a single tax object
    */
    static getSingleTax = async(req, res, next) => {
        const { tax_id } = req.params
        try {
            const tax = await Tax.findByPk(tax_id)
            if (!tax) {
                return res.status(404).send(
                    errorResponse("TAX_01", 404, "Don't exist tax with this ID.","Tax Id"))
            }
            return res.json(tax)
        } catch (err) {
            next()
        }
    }
}

export default TaxController;
