/**
 * Contains application configuration options
 */

// Sensitive information like passwords and secret keys can be passed in through environment variables
module.exports = {
  DATABASE_CONFIG: { // Mysql configuration
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: process.env.database_password || 'mysqlpass',
    database: 'turing'
  },
  LOG: { // Winston configuration
    LOG_LEVEL: '', // Set to debug to view comprehensive logs 
    DO_NOT_LOG_KEYS: ['password', 'tokens'] // These keys are not logged to the console
  },
  SERVER: { // Node server configuration 
    PORT: 3000,
    API_VERSION: 'v1'
  },
  JWT: { // Json web tokens configuration
    AUTH_SECRET: process.env.jwt_auth_secret ||'secret',
    VALID_ISSUERS: '["https://turing.ly"]',
    DOMAIN: 'https://turing.ly',
    ROLES: {
      USER: 'User'
    },
    EXPIRES_IN: '24h'
  },
  STRIPE: { // Stripe configuration
    SECRET_KEY: process.env.stripe_secret_key || 'sk_test_Emgg2aPuNIpkvDMS5rp77p8d00SASdzncF',
    CHARGE_EVENT: 'charge',
    CHARGE_STATUS: {
      SUCCEEDED: 'succeeded'
    }
  },
  EMAIL: { // Nodemailer configuration
    USER: 'turingbackendtest@gmail.com',
    PASSWORD: process.env.email_password ||'turingtest123'
  },
  CACHE: { // node-cache configuration
    TTL: 0, // (stdTTL) 0 for unlimited
    DELETE_CHECK_INTERVAL: 0, // (checkperiod) 0 for no auto delete checks
    SET_CACHE: '__set_cache__' // variable on express request object to indicate that no cache value exists for a key
  },
  CRON: { // Cron config
    CRON_TIME: '0 0 0 * * *', // Time to clear old shopping carts. Default to everyday
    TIME_ZONE: 'America/Los_Angeles',
    CLEAR_CARTS_OLDER_THAN: 3 // days
  },
  REQUEST_THROTTLING: { // Limit number of requests per IP
    ENABLE: true,
    WINDOW: 5 * 60 * 1000, // 5 minutes.
    NUMBER_OF_REQUESTS_IN_WINDOW: 1000 // The number of allowed requests per IP inside WINDOW
  },
  EXCLUDE_DECORATING_SERVICES: ['MySqlService.js', 'CacheService.js', 'CronService.js'], // Add services which do not serve resources to this list
  ENABLE_DATADOG_APM: true, // Switch to control APM. Set to false to disable datadog tracing
  BCRYPT_SALT_ROUNDS: 5, // Bcrypt password hashing salt rounds
  FORCE_USE_DB: false, // This is only for testing. Let this be false always in default.js. It is used in test.js
  STORED_PROCEDURES: { // Mapping of stored procedures
    GET_ATTRIBUTES: 'catalog_get_attributes',
    GET_ATTRIBUTE: 'catalog_get_attribute_details',
    GET_ATTRIBUTE_VALUES: 'catalog_get_attribute_values',
    GET_ATTRIBUTES_IN_PRODUCT: 'catalog_get_product_attributes',
    GET_CATEGORIES: 'catalog_get_categories',
    GET_CATEGORY: 'catalog_get_category_details',
    GET_CATEGORIES_IN_PRODUCT: 'catalog_get_categories_for_product',
    GET_CATEGORIES_IN_DEPARTMENT: 'catalog_get_categories_list',
    CREATE_CATEGORY: 'catalog_add_category',
    UPDATE_CATEGORY: 'catalog_update_category',
    DELETE_CATEGORY: 'catalog_delete_category',
    GET_DEPARTMENTS: 'catalog_get_departments',
    GET_DEPARTMENT: 'catalog_get_department_details',
    CREATE_DEPARTMENT: 'catalog_add_department',
    UPDATE_DEPARTMENT: 'catalog_update_department',
    DELETE_DEPARTMENT: 'catalog_delete_department',
    GET_PRODUCTS: 'catalog_get_products',
    CREATE_PRODUCT: 'catalog_add_product',
    UPDATE_PRODUCT: 'catalog_update_product',
    DELETE_PRODUCT: 'catalog_delete_product',
    SEARCH_PRODUCTS: 'catalog_search',
    GET_PRODUCT: 'catalog_get_product_info',
    GET_PRODUCT_DETAILS: 'catalog_get_product_details',
    GET_PRODUCT_LOCATIONS: 'catalog_get_product_locations',
    GET_PRODUCT_REVIEWS: 'catalog_get_product_reviews',
    GET_PRODUCTS_IN_CATEGORY: 'catalog_get_products_in_category',
    GET_PRODUCTS_IN_DEPARTMENT: 'catalog_get_products_on_department',
    CREATE_PRODUCT_REVIEW: 'catalog_create_product_review',
    GET_CUSTOMER: 'customer_get_customer',
    UPDATE_CUSTOMER: 'customer_update_account',
    CREATE_CUSTOMER: 'customer_add',
    LOGIN_CUSTOMER: 'customer_get_login_info',
    UPDATE_CUSTOMER_ADDRESS: 'customer_update_address',
    UPDATE_CUSTOMER_CREDIT_CARD: 'customer_update_credit_card',
    GET_TAXES: 'tax_get_taxes_list',
    GET_TAX: 'tax_get_tax',
    GET_SHIPPING_REGIONS: 'customer_get_shipping_regions',
    GET_SHIPPING_REGION: 'customer_get_shipping_region',
    ADD_PRODUCT_TO_SHOPPING_CART: 'shopping_cart_add_product',
    GET_PRODUCTS_IN_SHOPPING_CART: 'shopping_cart_get_products',
    UPDATE_ITEM_IN_SHOPPING_CART: 'shopping_cart_update',
    EMPTY_SHOPPING_CART: 'shopping_cart_empty',
    DELETE_OLD_SHOPPING_CARTS: 'shopping_cart_delete_old_carts',
    MOVE_ITEM_TO_SHOPPING_CART: 'shopping_cart_move_product_to_cart',
    GET_TOTAL_AMOUNT_IN_CART: 'shopping_cart_get_total_amount',
    SAVE_PRODUCT_FOR_LATER: 'shopping_cart_save_product_for_later',
    GET_SAVED_PRODUCT_IN_CART: 'shopping_cart_get_saved_products',
    REMOVE_PRODUCT_IN_CART: 'shopping_cart_remove_product',
    CREATE_ORDER: 'shopping_cart_create_order',
    GET_ORDER_DETAILS: 'orders_get_order_details',
    GET_ORDER_INFO: 'orders_get_order_info',
    GET_ORDER_FOR_CUSTOMER: 'orders_get_by_customer_id',
    GET_ORDER_SHORT_DETAILS: 'orders_get_order_short_details',
    ASSIGN_ATTRIBUTE_VALUE_TO_PRODUCT: 'catalog_assign_attribute_value_to_product',
    REMOVE_PRODUCT_ATTRIBUTE: 'catalog_remove_product_attribute_value'
  }
}