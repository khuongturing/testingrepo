let {} = require('../config/rules');
let responseMessages = require('../config/responseMessages');
let HttpStatus = require('../lib/httpStatus')
let Response = require('../lib/responseManager')

let create = (res, body) =>  new Promise((resolve, reject) => {
    console.log({body})
    if(!body) return Response.failure(
        res, responseMessages.FORM_BODY_EMPTY,
        HttpStatus.BAD_REQUEST, ['review', 'rating']
    )
    let req_fields = []
    let {review, rating} = body;

    if(!review) req_fields.push('review');
    if(!rating) req_fields.push('rating');

    if(req_fields.length > 0) return Response.failure(res, responseMessages.REQUIRED_FIELDS, HttpStatus.BAD_REQUEST, req_fields );

    if(typeof parseInt(rating) !== "number") return Response.failure(res, responseMessages.RATING_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'rating');
    return resolve();
})

module.exports = {create}