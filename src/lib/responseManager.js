/**
 *  objective: building to scale
 */


  
  module.exports.success = function success(res, data, message) {
        return res.status(200).json({
        status: true,
        data,
        message
    })
  };
  
  module.exports.failure = function failure(res, response, status, field) {
    return res.status(status).json({
        status,
        code: response.code,
        message: response.message,
        field
    })
  };
  