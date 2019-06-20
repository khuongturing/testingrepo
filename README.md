# Turing E-Commerce API

[![codecov](https://codecov.io/gh/terisolve/turing-api/branch/master/graph/badge.svg?token=ZFqUkBI4VD)](https://codecov.io/gh/terisolve/turing-api)
[![Build Status](https://travis-ci.com/terisolve/turing-api.svg?token=ozaWQTUqMvyqxXhsDedC&branch=master)](https://travis-ci.com/terisolve/turing-api)

## Overview
Turing E-commerce is an ecommerce application that lets users shop for clothings and wears of asorted brands types. They allow shipping to many parts of the world. 

The development of this API took into account the several specific needs of the product. It is carefully crafted as one that can easily require updates and new features, taking into account the need for scalability, easy maintainance, performance and security.

## Project Architecture
I have chosen to use a `Domain-Driven Architecture` that organises the codebase as a collection of features. 

### A top-level directory structure 

    server
    ├── api       
    │   └──router.js
    ├── config
    │   ├── constants           # load all project-wide constants including environment variables
    │   ├── database            # database configuration
    │   └── redis   
    ├── database
    │   ├── migration           # migration dump and script
    │   └── seeding             # seed dump and script
    ├── domains
    │   ├── attribute      
    │   ├── audit               
    │   ├── order               
    │   │   product 
    │   │   ├── __tests__
    │   │   ├── model.js        # models the table schema and provides data access methods
    │   │   ├── controller.js   # handles the http request and returns the response
    │   │   ├── repository.js   # fetches data from cache or database through the Model
    │   │   ├── router.js       # contain all routes for a domain
    │   │   └── transformer.js  # transformers the response                               
    │   └── ...                                     
    ├── http
    │   ├── middlewares         # all middlewares
    │   ├── httpException       # handler for http exceptions
    │   ├── response            # response handler
    │   └── wrapAsync           # wrapper for all async functions
    ├── public                  # serve static files used in the swagger documentation
    ├── services                # contains all external services used e.g payment, facebook, network request
    ├── utils                   # some utilities used within the project
    └── README.md





#### The Benefit of the Architecture
- Better maintainability
- Quicker to scale the architecture into a Micro-Services architecture
- Faster development made possible by the clean structure

I also added another piece to the data access layer - **Repository**

The concept of a **Repository** is that it handles fetching and returning data to the controller. It knows to fetch the data either from the cache or from the database.


## Utilities Developed
I have produced a couple of utilities that serve different purposes.

* Pagination
  > This contains the methods for extracting the pagination properties sent from the request - `orderBy, limit, page` and turning them into properties that are passed to the query that is executed to retrieve paginated data and meta

* errorHandler
  > This intercepts and handles all the errors that occur throughout the flow of the application.

* baseRepository
  > The base Repository has methods for fetching a collection of resource records or a single item. It is also responsible for caching the response data that should be sent back to the controllers. It reach for the cache first and then to the database through the Model.

* facebookLogin
  > This is used for the facebook login. It uses facebook graph API to fetch data that allows the application to validate a facebook user account so that they can be given access to our services.

<br />

## Third Party Tools
* Joi 
  > All Input sent through the API are validated with joi. Schemas are provided for each endpoint requiring input validation. The defined schema is checked against the supplied fields. The fields failing the validations are reported using the error handler middleware.

* Sequelize ORM
  > Sequelize is one of the most popular Database ORM (Object Relationtional Mapper). It's API is simple and expressive. It provides an abstraction on the Data Access Layer. Sequelize works very well with most SQL-based RDBMS.

* Redis
  > Caching is implemented in redis. Once new data is created or existing data updated, the cache is cleared removing keys matching the affected domain.

* Winston
  > This is used for logging errors in the command line, useful during development.

* Payment
  > Stripe is used to receive payments made for orders

<br />

## API FLOW
The Flow of actions across the API can best be described with this diagram
<br />
<br />

![image](https://user-images.githubusercontent.com/51211828/59460119-3b7d4180-8e16-11e9-8b5a-03e687d9780c.png)

## SECURITY
The API is protected with JWT (JSON WEB TOKEN). This allows the application to identify authorized users and restrict access to data for unauthorised users.

Passwords have also been hashed with strong a crypto-algorithm.

**A structure has been established for the implementation of rate-limiting**, to circumvent **DOS** security vulnerabilities with the system.