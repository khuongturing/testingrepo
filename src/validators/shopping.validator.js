let {} = require('../config/rules');
let responseMessages = require('../config/responseMessages');
let HttpStatus = require('../lib/httpStatus')
let Response = require('../lib/responseManager')

let add = (res, body) =>  new Promise((resolve, reject) => {
    if(!body) return Response.failure(
        res, responseMessages.FORM_BODY_EMPTY,
        HttpStatus.BAD_REQUEST, ['cart_id', 'product_id', 'attributes', 'quantity']
    )
    let req_fields = []
    let {cart_id, product_id, attributes, quantity} = body;

    if(!cart_id) req_fields.push('cart_id');
    if(!product_id) req_fields.push('product_id');
    if(!attributes) req_fields.push('attributes');
    if(!quantity) req_fields.push('quantity');


    if(req_fields.length > 0) return Response.failure(res, responseMessages.REQUIRED_FIELDS, HttpStatus.BAD_REQUEST, req_fields );

    if(typeof parseInt(product_id) !== "number") return Response.failure(res, responseMessages.PRODUCT_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'product_id');
    if(typeof parseInt(quantity) !== "number") return Response.failure(res, responseMessages.QUANTITY_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'rating');
    return resolve();
})

let update = (res, body) =>  new Promise((resolve, reject) => {
    if(!body) return Response.failure(
        res, responseMessages.FORM_BODY_EMPTY,
        HttpStatus.BAD_REQUEST, ['quantity']
    )
    let req_fields = []
    let {quantity} = body;
    if(!quantity) req_fields.push('quantity');
    if(req_fields.length > 0) return Response.failure(res, responseMessages.REQUIRED_FIELDS, HttpStatus.BAD_REQUEST, req_fields );

    if(Object.keys(body).length > 1) return Response.failure(res, responseMessages.FORM_CONTAINS_OTHER_FIELDS, HttpStatus.BAD_REQUEST, 'quantity' )
    
    if(typeof parseInt(quantity) !== "number") return Response.failure(res, responseMessages.QUANTITY_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'rating');
    return resolve();
})

let order = (res, body) =>  new Promise((resolve, reject) => {
    if(!body) return Response.failure(
        res, responseMessages.FORM_BODY_EMPTY,
        HttpStatus.BAD_REQUEST, ['cart_id', 'shipping_id', 'tax_id']
    )
    let req_fields = []
    let {cart_id, shipping_id, tax_id} = body;
    if(!cart_id) req_fields.push('cart_id');
    if(!shipping_id) req_fields.push('shipping_id');
    if(!tax_id) req_fields.push('tax_id')
    if(req_fields.length > 0) return Response.failure(res, responseMessages.REQUIRED_FIELDS, HttpStatus.BAD_REQUEST, req_fields );

    
    if(typeof parseInt(shipping_id) !== "number") return Response.failure(res, responseMessages.SHIPPING_REGION_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'rating');
    if(typeof parseInt(tax_id) !== "number") return Response.failure(res, responseMessages.TAX_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'rating');
    return resolve();
})

let payment = (res, body) =>  new Promise((resolve, reject) => {
    let fields = ['stripeToken', 'order_id', 'description', 'amount', 'currency'];
    if(!body) return Response.failure(
        res, responseMessages.FORM_BODY_EMPTY,
        HttpStatus.BAD_REQUEST, fields
    )
    let req_fields = []
    let {stripeToken, order_id, description, amount, currency} = body;
    if(!stripeToken) req_fields.push(fields[0]);
    if(!order_id) req_fields.push(fields[1]);
    if(!description) req_fields.push(fields[2]);
    if(!amount) req_fields.push(fields[3])

    if(req_fields.length > 0) return Response.failure(res, responseMessages.REQUIRED_FIELDS, HttpStatus.BAD_REQUEST, req_fields );

    
    if(typeof parseInt(order_id) !== "number") return Response.failure(res, responseMessages.ORDER_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, fields[1]);
    if(typeof parseInt(amount) !== "number") return Response.failure(res, responseMessages.AMOUNT_NOT_NUMBER, HttpStatus.BAD_REQUEST, fields[3]);
    return resolve();
})

module.exports = {
    add, update,order, payment
}