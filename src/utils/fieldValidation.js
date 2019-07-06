import { errorResponse } from '../utils/errors';

const validate = (req) => {
    const { name } = req.body
    const requiredField = 'The field(s) are/is required'
    const invalidPhoneNo = 'This is an invalid phone number'
    if (req.hasOwnProperty('body')) {
        for (const key in req.body) {
            switch (key) {
                case 'email':
                    req.check('email', requiredField).notEmpty();
                    req.check('email', 'The email is invalid').isEmail().normalizeEmail();
                    break;

                case 'password':
                    req.check('password', requiredField).notEmpty();
                    break;

                case 'name':
                    req.check('name', requiredField).notEmpty();
                    req.check('name', `This is too long ${name}`).isLength(1, 10);
                    break;

                case 'address_1':
                    req.check('address_1', requiredField).notEmpty();
                    break;

                case 'city':
                    req.check('city', requiredField).notEmpty();
                    break;

                case 'region':
                    req.check('region', requiredField).notEmpty();
                    break;

                case 'postal_code':
                    req.check('postal_code', requiredField).notEmpty();
                    break;

                case 'country':
                    req.check('country', requiredField).notEmpty();
                    break;

                case 'shipping_region_id':
                    req.check('shipping_region_id', requiredField).notEmpty();
                    req.check('shipping_region_id', 'The Shipping Region ID is not a number').isInt();
                    break;

                case 'credit_card':
                    req.check('credit_card', requiredField).notEmpty();
                    break;

                case 'cart_id':
                    req.check('cart_id', requiredField).notEmpty();
                    break;

                case 'attributes':
                    req.check('attributes', requiredField).notEmpty();
                    break;

                case 'item_id':
                    req.check('item_id', 'The Item ID is not a number').isInt()
                    break;

                case 'quantity':
                    req.check('quantity', 'The Quantity is not a number').isInt()
                    break;

                case 'product_id':
                    req.check('product_id', 'The Product ID is not a number').isInt()
                    break;

                case 'review':
                    req.check('review', requiredField).notEmpty();
                    break;

                case 'rating':
                    req.check('rating', 'Rating is not a number').isInt()
                    break;

                case 'day_phone':
                    req.check('day_phone', invalidPhoneNo).isInt()
                    break;

                case 'eve_phone':
                    req.check('eve_phone', invalidPhoneNo).isInt()
                    break;

                case 'mob_phone':
                    req.check('mob_phone', invalidPhoneNo).isInt()
                    break;

                case 'amount':
                    req.check('amount', requiredField).notEmpty();
                    req.check('amount', 'Amount is not a number').isInt()
                    break;

                case 'order_id':
                    req.check('order_id', requiredField).notEmpty();
                    req.check('order_id', 'Order ID is not a number').isInt()
                    break;

                case 'description':
                    req.check('description', requiredField).notEmpty();
                    break;

                case 'stripeToken':
                    req.check('stripeToken', requiredField).notEmpty();
                    break;
            }
        }
    }
    return req.validationErrors();
}

const mapMsgToCode = {
    'The field(s) are/is required': {
        code: "USR_02"
    },
    'The email is invalid': {
        code: "USR_03"
    },
    'The field(s) are/is required': {
        code: "USR_03"
    },
    'The Shipping Region ID is not a number': {
        code: "USR_03"
    },
    'This is an invalid phone number': {
        code: "USR_06"
    },
    'The Item ID is not a number': {
        code: "USR_09"
    },
    'The Quantity is not a number': {
        code: "USR_09"
    },
    'The Product ID is not a number': {
        code: "USR_09"
    },
    'Rating is not a number': {
        code: "USR_09"
    },
    'Order ID is not a number': {
        code: "USR_09"
    },
    'Amount is not a number': {
        code: "USR_09"
    }
};

const validateRequestBody = (req, res, next) => {
    const error = validate(req);
    if (error) {
        const { param, msg } = error[0]
        const codeObject = mapMsgToCode[msg]
        if (codeObject) {
            return res.status(400).json(
                errorResponse(codeObject.code, 400, msg, param)
            )
        } else if (param === 'name') {
            return res.status(400).json(
                errorResponse("USR_07", 400, msg, param )
            )
        }
    } else {
        next()
    }
}

export default validateRequestBody;
