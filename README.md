# Shopify API
This repository contains the API endpoints of Shopify E-commerce. This enables customers to visit the application and perform basic CRUD. The customers will have a level of authorization before they can access some of the endpoints. Customers can view products, add products to cart, and proceed to make payment based on an order created. This project is built primarily using NodeJs and Express.

You can access the hosted API here: https://shopify-ecommerce.herokuapp.com

The API is documented using Postman. You can find the documentation of this API here: https://documenter.getpostman.com/view/2103043/S1ZxbpV6

## Main Features
- Users can view all products
- Users can search for products.
- Users can create an account
- Users can login
- Users can add items to their shopping carts
- Users can save an Item in cart for later.
- Authenticated users can update personal profiles with shipping addresses and other info
- Users can checkout with Stripe payment gateways

### List of All the endpoints
1.  `/attributes`
2.  `/attributes/:attribute_id`
3.  `/attributes/values/:attribute_id`
4.  `/attributes/inProduct/:product_id`
5.  `/departments`
6.  `/departments/:department_id`
7.  `/categories`
8.  `/categories/:category_id`
9.  `/categories/inProduct/:product_id`
10. `/categories/inDepartment/:department_id`
11. `/products`
12. `/products/search`
13. `/products/:product_id`
14. `/products/inCategory/:category_id`
15. `/products/inDepartment/:department_id`
16. `/products/:product_id/details`
17. `/products/:product_id/reviews`
18. `/products/:product_id/reviews`
19. `/customer`
20. `/customers/login`
21. `/customers`
22. `/customers/address`
23. `/customers/creditCard`
24. `/shoppingcart/generateUniqueId`
25. `/shoppingcart/add`
26. `/shoppingcart/:cart_id`
27. `/shoppingcart/update/:item_id`
28. `/shoppingcart/empty/:cart_id`
29. `/shoppingcart/totalAmount/:cart_id`
30. `/shoppingcart/saveForLater/:item_id`
31. `/shoppingcart/getSaved/:cart_id`
32. `/shoppingcart/removeProduct/:item_id`
33. `/tax`
34. `/tax/:tax_id`
35. `/shipping/regions`
36. `/shipping/regions/:shipping_region_id`
37. `/orders`
38. `/orders/:order_id`
39. `/orders/inCustomer`
40. `/orders/shortDetail/:order_id`
41. `/stripe/charge`
42. `/stripe/webhooks`

## Built With
- [NodeJS](https:nodejs.org) - a runtime environment for JavaScript outside of the browser
- [ExpressJS](https://expressjs.com) - a framework for flexibly handling HTTP routing in NodeJS applications
- [MYSQL](https://www.mysql.com) - an open-source Object-Relational Database System; used for data storage
- [Sequelize](https://github.com/sequelize/sequelize) - a multi-dialect, promise-based Object-Relational Mapper (ORM) for NodeJS
- [Babel](https://babeljs.io) - a transpiler for transpiling ES2015+ JavaScript code into ES5.
- [Stripe](https://stripe.com/) - an online payment processing for internet businesses.

## Getting started
### Setting up the project locally
- Clone the repo to your local computer by running ```git clone your-github-name/project-name``` from your terminal.
- Cd into the project and install all the dependencies by running `npm install`
- Create a .env file, copy the variables in the `.envSample` in the root directory of the project and provide the variables as it applies to your machine.
- Install Mysql, create a development database for development
- Dump the `tshirtshop.sql` file into the database created by running `mysql -u username -p database_name < tshirtshop.sql`
- To start the application, in the root directory of the project, run: `npm run start:dev`
- Test out the endpoints on postman.
### Running the tests
To run test:
- Run `npm install` to install all the required dependencies for the test.
- Ensure to set up a test database and the connection strings in place.
- Run `npm run start:dev` to run the test.
- All endpoint can be tested using postman. A link to the Postman documentation of the API has been included above in this file.

## Authors
- Eloka Chima
