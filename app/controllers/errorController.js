'user strict';


var Errors = 
{
    // Attribute's Errors
    ATT_01 : {
        "error": {
            "status": 400,
            "code": "ATT_01",
            "message": "Doesn't exist attribute with this ID.",
            "field": "attribute_id"
        }
    },
    // Authentication's Errors
    AUTH_01 : {
        "error": {
            "status": 401,
            "code": "AUT_01",
            "message": "Authorization code is empty",
            "field": "NoAuth"
        }
    },
    AUTH_02 : {
        "error": {
            "status": 401,
            "code": "AUT_02",
            "message": "Access Unauthorized",
            "field": "NoAuth"
        }
    },
    // Category's Errors
    CAT_01 : {
        "error": {
            "status": 400,
            "code": "CAT_01",
            "message": "Don't exist category with this ID",
            "field": "category_id"
        }
    },
    // Department's Errors
    DEP_01 : {
        "error": {
            "status": 400,
            "code": "DEP_01",
            "message": "The ID is not a number.",
            "field": "department_id"
        }
    },
    DEP_02 : {
        "error": {
            "status": 400,
            "code": "DEP_02",
            "message": "Don'exist department with this ID.",
            "field": "department_id"
        }
    },
    // User's Errors
    USR_01 : {
        "error": {
            "code": "USR_01",
            "message": "Email or Password is invalid",
            // "field": "product_id",
            "status": 400
        }
    },
    USR_02 : {
        "error": {
            "code": "USR_02",
            "message": "Invalid Field(s) Input",
            // "field": "product_id",
            "status": 400
        }
    },
    USR_03 : {
        "error": {
            "code": "USR_03",
            "message": "The email is invalid.",
            "field": "Email",
            "status": 400
        }
    },
    USR_04 : {
        "error": {
            "code": "USR_04",
            "message": " The email already exists.",
            "field": "Email",
            "status": 400
        }
    },
    USR_05 : {
        "error": {
            "code": "USR_05",
            "message": "The email doesn't exist.",
            "field": "Email",
            "status": 400
        }
    },
    USR_06 : {
        "error": {
            "code": "USR_06",
            "message": "This is an invalid phone number",
            "field": "Phone Number",
            "status": 400
        }
    },
    USR_07 : {
        "error": {
            "code": "USR_07",
            "message": "The filled in field is too long",
            // "field": "product_id",
            "status": 400
        }
    },
    USR_08 : {
        "error": {
            "code": "USR_08",
            "message": "This is an invalid Credit Card",
            "field": "Credit Card",
            "status": 400
        }
    },
    USR_09 : {
        "error": {
            "code": "USR_09",
            "message": "The Shipping Region ID is not number",
            "field": "Shipping Region ID",
            "status": 400
        }
    },
    USR_10 : {
        "error": {
            "code": "USR_10",
            "message": "The field(s) are/is required.",
            // "field": "product_id",
            "status": 400
        }
    },
    // Pagination's Errors
    PAG_01 : {
        "error": {
            "status": 400,
            "code": "PAG_01",
            "message": "Page Not Exist"
        }
    },
    PAG_02 : {
        "error": {
            "status": 400,
            "code": "PAG_02",
            "message": "The field of order is not allow sorting"
        }
    },
    PAG_03 : {
        "error": {
            "status": 400,
            "code": "PAG_03",
            "message": "Limit Not Valid."
        }
    },
    PRO_01 : {
        "error": {
            "status": 400,
            "code": "PRO_01",
            "message": "Don't exist product with this ID",
            "field": "product_id"
        }
    },
    // Success Message
    SUCCESS: {
        "success": {
          "status": 200,
          "message": "success"
        }
    }
}


module.exports = Errors;