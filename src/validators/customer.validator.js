let {isEmail, isValidPassword, isPhone, isPostalCode} = require('../config/rules');
let responseMessages, {REQUIRED_FIELDS, FORM_BODY_EMPTY, INVALID_EMAIL, INVALID_PHONE_NUMBER,
    FIELD_TOO_LONG, INVALID_PASSWORD, INVALID_SHIPPING_REGION
} = require('../config/responseMessages');
let HttpStatus = require('../lib/httpStatus')
let Response = require('../lib/responseManager')

let create = (res, body) =>  new Promise((resolve, reject) => {
    if(!body) return Response.failure(
        res, FORM_BODY_EMPTY,
        HttpStatus.BAD_REQUEST, ['email', 'password', 'name']
    )
    let req_fields = []
    let {name, email, password} = body;

    if(!name) req_fields.push('name');
    if(!email) req_fields.push('email');
    if(!password) req_fields.push('password');

    if(req_fields.length > 0) return Response.failure(res, REQUIRED_FIELDS, HttpStatus.BAD_REQUEST, req_fields );

    if(email.length > 50) return Response.failure(res, FIELD_TOO_LONG, HttpStatus.BAD_REQUEST, 'email');
    if(name.length > 100) return Response.failure(res, FIELD_TOO_LONG, HttpStatus.BAD_REQUEST, 'name');
    if(!isEmail(email)) return Response.failure(res, INVALID_EMAIL, HttpStatus.BAD_REQUEST, 'email')
    if(!isValidPassword(password)) return Response.failure(res, INVALID_PASSWORD, HttpStatus.BAD_REQUEST, 'password');

    return resolve();
})

let login = (res, body) =>  new Promise((resolve, reject) => {
    if(!body) return Response.failure(
        res, FORM_BODY_EMPTY,
        HttpStatus.BAD_REQUEST, ['email', 'password']
    )
    let req_fields = []
    let {email, password} = body;

    if(!email) req_fields.push('email');
    if(!password) req_fields.push('password');

    if(req_fields.length > 0) return Response.failure(res, REQUIRED_FIELDS, HttpStatus.BAD_REQUEST, req_fields );

    if(email.length > 50) return Response.failure(res, FIELD_TOO_LONG, HttpStatus.BAD_REQUEST, 'email');
    if(!isEmail(email)) return Response.failure(res, INVALID_EMAIL, HttpStatus.BAD_REQUEST, 'email')
    if(!isValidPassword(password)) return Response.failure(res, INVALID_PASSWORD, HttpStatus.BAD_REQUEST, 'password');

    return resolve();
})

let update = (res, body) =>  new Promise((resolve, reject) => {
    if(!body) return Response.failure(res, FORM_BODY_EMPTY,
        HttpStatus.BAD_REQUEST, ['email', 'name']
    )
    let req_fields = []
    let {email, name, day_phone, eve_phone, mob_phone} = body;

    if(!email) req_fields.push('email');
    if(!name) req_fields.push('name');

    if(req_fields.length > 0) return Response.failure(res, REQUIRED_FIELDS, HttpStatus.BAD_REQUEST, req_fields );

    if(email.length > 50) return Response.failure(res, FIELD_TOO_LONG, HttpStatus.BAD_REQUEST, 'email');
    if(!isEmail(email)) return Response.failure(res, INVALID_EMAIL, HttpStatus.BAD_REQUEST, 'email')
 
    if(day_phone && !isPhone(day_phone)){
        return Response.failure(res, {
            code: INVALID_PHONE_NUMBER.code,
            message: 'Invalid Day Phone'
        }, HttpStatus.BAD_REQUEST, 'day_phone')
    }

    if(eve_phone && !isPhone(eve_phone)){
        return Response.failure(res, {
            code: INVALID_PHONE_NUMBER.code,
            message: 'Invalid Eve Phone'
        }, HttpStatus.BAD_REQUEST, 'eve_phone')
    }

    if(mob_phone && !isPhone(mob_phone)){
        return Response.failure(res, {
            code: INVALID_PHONE_NUMBER.code,
            message: 'Invalid Mob Phone'
        }, HttpStatus.BAD_REQUEST, 'mob_phone')
    }
    

    return resolve();
})

let update_address = (res, body) =>  new Promise((resolve, reject) => {
    let req_fields = ['address_1', 'postal_code', 'city', 'region', 'country', 'shipping_region_id']
    if(!body) return Response.failure(res, FORM_BODY_EMPTY,
        HttpStatus.BAD_REQUEST, req_fields 
    )
    let {address_1, address_2, postal_code, city, region, country, shipping_region_id} = body;

    if(!address_1 || !postal_code || !city || !region || !country || !shipping_region_id)
                return Response.failure(res, REQUIRED_FIELDS, HttpStatus.BAD_REQUEST, req_fields );

    if(typeof parseInt(shipping_region_id) !== "number") 
                 return Response.failure(res, INVALID_SHIPPING_REGION, HttpStatus.BAD_REQUEST, req_fields );


    return resolve();
})

let update_credit_card = (res, body) =>  new Promise((resolve, reject) => {
    let req_field = "credit_card"
    if(!body) return Response.failure(res, FORM_BODY_EMPTY,
        HttpStatus.BAD_REQUEST, req_field 
    )
    let {credit_card} = body;

    if(!credit_card)
                return Response.failure(res, REQUIRED_FIELDS, HttpStatus.BAD_REQUEST, req_field );
    
   return resolve();
})

module.exports = {
    create, login, update, update_address, update_credit_card
}