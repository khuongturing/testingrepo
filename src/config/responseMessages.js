module.exports = {

    AUTHORIZATION_CODE_EMPTY: {
        code: 'AUT_01',
        message: 'Authorization Code is Empty.',
    },
    ACCESS_UNAUTHORIZED: {
        code: 'AUT_02',
        message: 'Access Unauthorized.'
    },
    ATTRIBUTE_ID_NOT_NUMBER: {
        code: 'ATT_01',
        message: 'The Attribute ID should be a number.'
    },
    ATTRIBUTE_NOT_EXISTS: {
        code: 'ATT_02',
        message: 'No Attribute Exists with this ID.'
    },
    AMOUNT_NOT_NUMBER: {
        code: 'SHP_08',
        message: 'The Amount should be a number.'
    },
    AMOUNT_NOT_EQUAL_TO_PRICE: {
        code: 'SHP_09',
        message: 'The amount being paid is not equal to the total amount for the items'
    },


    CART_ID_NOT_NUMBER: {
        code: 'SHP_06',
        message: 'Please Provide a cart Id.'
    },
    CART_NOT_EXISTS: {
        code: 'SHP_03',
        message: 'No Products have been added to this cart.'
    },

    CATEGORY_ID_NOT_NUMBER: {
        code: 'CAT_01',
        message: 'The Category ID is not a number.'
    },
    CATEGORY_NOT_EXISTS: {
        code: 'CAT_02',
        message: 'No Category Exists with this ID.'
    },

    DEPARTMENT_ID_NOT_NUMBER: {
        code: 'DEP_01',
        message: 'The Department ID is not a number.'
    },
    DEPARTMENT_NOT_EXISTS: {
        code: 'DEP_02',
        message: 'No Department Exists with this ID.'
    },

    
    EMAIL_EXISTS: {
        code: 'USR_04',
        message: "Email already exists."
    },
    EMAIL_NOT_EXISTS: {
        code: 'USR_05',
        message: "Email does not exist."
    },


    FORM_BODY_EMPTY: {
        code: 'FRM_01',
        message: 'Form Body cannot be empty'
    },
    FORM_CONTAINS_OTHER_FIELDS: {
        code: 'FRM_02',
        message: 'Form Body contains fields not needed'
    },
    FIELD_TOO_LONG: {
        code: 'USR_07',
        message: 'field is too long'
    },
    

    INTERNAL_SERVER_ERROR: {
        code: 'SVR_01',
        message: "Internal Server Error."
    },
    INVALID_CREDIT_CARD: {
        code: 'USR_08',
        message: "This is an Invalid Credit Card."
    },
    INVALID_EMAIL_PASSWORD: {
        code: 'USR_01',
        message: "Email or Password is invalid."
    },
    INVALID_EMAIL: {
        code: 'USR_03',
        message: "Email is invalid."
    },
    INVALID_PASSWORD: {
        code: 'USR_10',
        message: "Password should be greater than 6 characters."
    },
    INVALID_PHONE_NUMBER: {
        code: 'USR_06',
        message: "This is an Invalid Phone number"
    },
    INVALID_SHIPPING_REGION: {
        code: 'USR_09',
        message: "Shipping Region Id is Invalid"
    },
    ITEM_ID_NOT_NUMBER: {
        code: 'SHP_04',
        message: 'The Item ID is not a number.'
    },
    ITEM_NOT_EXISTS: {
        code: 'SHP_05',
        message: 'No Item Exists with this ID.'
    },

    ORDER_ID_NOT_NUMBER: {
        code: 'ORD_01',
        message: 'The Order ID is not a number.'
    },
    ORDER_NOT_EXISTS: {
        code: 'ORD_02',
        message: 'No Order Exists for the ID provided.'
    },
    ORDER_HAS_BEEN_PAID_FOR: {
        code: 'ORD_03',
        message: 'Order has been paid for.'
    },


    PAGE_INVALID: {
        code: 'QUE_01',
        message: 'No results available for this page.'
    },
    PRODUCT_ID_NOT_NUMBER: {
        code: 'PDT_01',
        message: 'The Product ID is not a number.'
    },
    PRODUCT_NOT_EXISTS: {
        code: 'PDT_02',
        message: 'No Product Exists with this ID.'
    },

    QUERY_NOT_EXISTS: {
        code: 'PDT_03',
        message: 'Query String Required for search.'
    },
    QUANTITY_NOT_NUMBER: {
        code: 'SHP_07',
        message: 'Quantity Should be a number'
    },


    REQUIRED_FIELDS: {
        code: 'USR_02',
        message: "The field(s) are/is required."
    },
    RATING_NOT_NUMBER:{
        code: 'REV_01',
        message: "Rating Should be a number"
    },

    SHIPPING_REGION_ID_NOT_NUMBER: {
        code: 'SHP_01',
        message: 'The Shipping Region ID is not a number.'
    },
    SHIPPING_NOT_EXISTS: {
        code: 'SHP_02',
        message: 'No Shipping Details Exists for the Id Provided.'
    },

    TAX_ID_NOT_NUMBER: {
        code: 'TAX_01',
        message: 'The Tax ID is not a number.'
    },
    TAX_NOT_EXISTS: {
        code: 'TAX_02',
        message: 'No Tax Exists for the Id Provided.'
    },

    UPDATE_SUCCESSFUL: {
        code: 'UPD_01',
        message: "Update Successful."
    },
    UPDATE_FAILED: {
        code: 'UPD_02',
        message: "Update Failed."
    },



}