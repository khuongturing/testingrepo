const sinon = require('sinon')
const config = require('config')
const mysql = require('promise-mysql')
const chai = require('chai')
const data = require('../data')
const expect = chai.expect
const STORED_PROCEDURES = config.get('STORED_PROCEDURES')

// Stub database and respond with results of stored procedures
sinon.stub(mysql, 'createPool').returns({
  query: (queryString, params) => {
    let storedProcedure // Extract name of stored procedure from query string
    if(queryString.includes('(')) {
      // query with params for stored procedure
      storedProcedure = queryString.substring(5, queryString.indexOf('('))
    } else {
      // No params
      storedProcedure = queryString.substring(5, queryString.length)
    }
    switch(storedProcedure) {
      case STORED_PROCEDURES.GET_ATTRIBUTES:
        return data.ATTRIBUTES

      case STORED_PROCEDURES.GET_ATTRIBUTE:
        return data.ATTRIBUTES.find((a) => a.attribute_id === params)

      case STORED_PROCEDURES.GET_ATTRIBUTE_VALUES:
        expect(params).eql(data.ATTRIBUTES[0].attribute_id)
        return data.ATTRIBUTE_VALUES

      case STORED_PROCEDURES.GET_ATTRIBUTES_IN_PRODUCT:
        expect(params).eql(data.PRODUCTS[0].product_id)
        return data.ATTRIBUTES_IN_PRODUCT
        
      case STORED_PROCEDURES.GET_CATEGORIES:
        expect(params).eql(['category_id', 20, 0])
        return [data.CATEGORIES]
    }
  }
})