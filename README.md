[![Build Status](https://travis-ci.com/kampkelly/shopmate-backend.svg?token=jDmhdZzRzB1WyMWuvoJF&branch=develop)](https://travis-ci.com/kampkelly/shopmate-backend)

# shopmate-backend

This is the API for an e-commerce application allowing users to create accounts, view products, add to cart and checkout.

The following are the API routes available

### Setup and Installation

The app is built with the following tools/technologies:

1. NodeJs
2. Mysql
3. Sequelize ORM
4. Redis

## Installation

1. Install Nodejs and npm if they are not already installed.
2. Install Mysql server on database. If using a mac, you can make use of SequelPro to connect to it. If on Windows, ypu can make use of PhpMyAdmin.
3. Clone the repository.
4. Run `npm install`.
5. Create a .env file in your root directory and add the environment variables from .env-sample (put in your own details).
6. Migrate the database with `npm run migrate`.
7. You can seed the database with `npm run seed` (optionally).
8. Run `npm run dev to start the server`.
9. Visit the available endpoints.

##### _The hosted app can be accessed [here](https://shopmate-backend-api.herokuapp.com/)_

##### _The documentation for this api can be found [here](https://documenter.getpostman.com/view/7132396/S1LsYVz3)_

## Available Endpoints

### Customer Registration

Post Request to: `/customers`

Body:
```
{
	"name": "customer name",
	"email": "email@example.com",
	"password": "password"
}
```
Example response: 
```
{
    "customer": {
        "customer_id": 'id',
        ...
    },
    "accessToken": "...",
    "expires_in": "24h"
}
```

### Customer Login

Post Request to: `/customers/login`

Body:
```
{
	"email": "email@example.com",
	"password": "password"
}
```
Example response: 
```
{
    "customer": {
        "customer_id": 'id',
        ...
    },
    "accessToken": "...",
    "expires_in": "24h"
}
```

### Customer update address 

Post request to: `/customers/address`

*Jwt token required in header Authorization*

Body:
```
{
	"address_1": "...",
	"address_2": "...",
	"city": "...",
	"region": "...",
	"postal_code": "...",
	"country": "...",
	"shipping_region_id": 'id'
}
```
Example response: 
```
{
    "customer_id": 'id',
    "name": "...",
    "email": "...",
    "address_1": "...",
    "address_2": "...",
    "city": "...",
    "region": "...",
    "postal_code": "...",
    "country": "...",
    "shipping_region_id": 'id',
    "credit_Card": null,
    "day_phone": null,
    "eve_phone": null,
    "mob_phone": null
}
```

### Product Endpoints

#### Get all products

*Get request to: `/products`*

#### Get all products (with filters)

*Get request to: `/products?limit=10&description_length=51&page=1`*

Example response: 
```
{
    "count": 0,
    "rows": [...]
}

```

#### Get single product

*Get request to: `/products/:productId`*

Example response: 
```
{
    "product_id": 'id',
    "name": "...",
    "description": "...",
    "price": "...",
    "discounted_price": "...",
    "image": "...",
    "image_2": "...",
    "thumbnail": "...",
    "display": 0
}

```

#### Get products in category

*Get request to: `/products/inCategory/:categoryId`*

#### Get products in category (with filters)

*Get request to: `/products/inCategory/:categoryId?page=3&limit=23&description_length=51`*


Example response: 
```
{
    "count": 0,
    "rows": []
}

```

#### Get products in department

*Get request to: `/products/inDepartment/:departmentId`*

#### Get products in department (with filters)

*Get request to: `/products/inDepartment/:departmentId?page=3&limit=23&description_length=51`*


Example response: 
```
{
    "count": 0,
    "rows": []
}

```

#### Search products

*Get request to: `/products/search?query_string=Coay&page=1&limit=10&description_length=50`*

Example response: 
```
{
    "count": 0,
    "rows": [...]
}

```

### Shopping Cart Endpoints

#### Generate cart id

*Get request to: `shoppingcart/generateUniqueId`*

Example response: 
```
{
    "cart_id": "..."
}
```

#### Add product to cart

*Post request to: `shoppingcart/add`*
Body:
```
{
	"cart_id": 'id',
	"product_id": 1',
	"attributes": "..."
}
```

Example response: 
```
[
    {
        "item_id": 'id',
        "name": "...",
        "attributes": "...",
        "price": "...",
        "quantity": 2,
        "subtotal": "..."
    }
    ...
]
```

#### Get items in a shopping cart

*Get request to: `shoppingcart/:cart_id`*

Example response: 
```
[
    {
        "item_id": 'id',
        "name": "...",
        "attributes": "...",
        "price": "...",
        "quantity": 2,
        "subtotal": "..."
    }
    ...
]
```

#### Empty the shopping cart

*Get request to: `shoppingcart/empty/:cart_id`*

Example response: 
```
[]
```

### Stripe Endpoints

#### Charge on Stripe

*Get request to: `stripe/charge`*
Body:
```
{
	"stripeEmail": "email@exmaple.com",
    "amount": 100,
    "order_id": 1,
    "description": "...",
    "currency": "usd",
    "stripeToken": "..."
}
```

Example response: 
```
{
     ...
}
```

## Additional Endpoints

### Create an order

N.B: Authentication is required

*Post request to: `orders`*
Body:
```
{
        "cart_id": "tyy4amqpi3axkimrci",
	"shipping_id": "3",
	"tax_id": 2
}
```

Example response: 
```
{
     orderId: 'id
}
```

### Get orders by a customer

N.B: Authentication is required

*Get request to: `orders/inCustomer`*

Example response: 
```
[
    {
        "order_id": 'id,
        "total_amount": "...",
        "created_on": "...",
        "shipped_on": null,
        "status": 0,
        "name": "..."
    }
]
```

### Get order info

N.B: Authentication is required

*Get request to: `orders/:order_id`*

Example response: 
```
[
    {
        "order_id": 'id,
        "product_id": 2,
        "attributes": "...",
        "product_name": "...",
        "quantity": 1,
        "unit_cost": "...",
        "subtotal": "..."
    },
    ...
]
```

### Stripe webhook

*Get request to: `stripe/webhooks`*

Example response: 
```
{
    "received": true
}
```

### Get a stripe token

N.B: Authentication is required

*Get request to: `stripe/getToken`*

Example response: 
```
{
    "stripeToken": "..."
}
```

### Get shipping regions

*Get request to: `shipping/regions`*

Example response: 
```
[
    {
        "shipping_region_id": 'id',
        "shipping_region": "..."
    },
    ...
]
```

### Get shipping for a shipping region

*Get request to: `shipping/regions/:shipping_region_id`*

Example response: 
```
[
    {
        "shipping_id": 'id',
        "shipping_type": "...",
        "shipping_cost": "...",
        "shipping_region_id": 'id'
    },
    ...
]
```

### Get all categories

*Get request to: `/categories`*

#### Get categories (with filters)

*Get request to: `/categories/?page=3&limit=23&description_length=51`*

Example response: 
```
{
    "count": 7,
    "rows": [
        {
            "category_id": id,
            "department_id": id,
            "name": "...",
            "description": "..."
        },
        ...
     ]
}
```

### Get a single category

*Get request to: `/categories/:category_id`*

Example response: 
```
{
    "category_id": id,
    "name": "...",
    "description": "...",
    "department_id": id
}
```

### Get the category of a product

*Get request to: `/categories/inProduct/:product_id`*

Example response: 
```
[
    {
        "category_id": id,
        "department_id": id,
        "name": "..."
    }
]
```

### Get all departments

*Get request to: `/departments`*

Example response: 
```
[
        {
            "department_id": id,
            "name": "...",
            "description": "..."
        },
        ...
]
```

### Get a single department

*Get request to: `/departments/:department_id`*

Example response: 
```
{
    "department_id": id,
    "name": "...",
    "description": "..."
}
```

### Get the categories of a department

*Get request to: `/categories/inDepartment/:department_id`*

Example response: 
```
[
    {
        "category_id": id,
        "name",
        "description",
        "department_id": id
    }
]
```

## Testing

To run the tests, run `npm run test` in the terminal.

## Supporting a large number of users

#### If you have a large number of users, here are a couple of suggestions:

1. Rent a server (a cloud server, AWS or Google) with great specifications. This includes the ram, storage size and how distributed it is. It should also be very reliable (99%+ uptime). 
2. Make use of caching to reduce the number of requests to the database.
3. Save images and assets in a cloud storage such as Google to reduce the stress on the server. This also allows the server to have more storage space.

#### When most of your users are coming from a specific region(US):

You would need to ensure majority of your severs are from that region(US) and regions around it. This will allow users from the US to send and retrieve data faster because their request location will be closer.
Also, you can make use of load balancers to efficiently distribute incoming network traffic. So, if the servers from the US region are receiving very large number of requests and a server goes down, the load balancer will  redirect traffic to the remaining online servers from other regions.

## System Design Architecture:

The system architecture used for this application is the MVC project with Object Oriented Programming. This stands for Models, Views and Controllers. The model handles all database connections while controllers are responsible for the logic of the application.

Several data structures were used in the application including strings, arrays, objects, etc.

The stack used in building this project includes:
- Nodejs
- Express
- Sequelize
- MySQL
- Redis

You can view the system diagram below:
<div class="something" markdown="1">
<img src="https://i.imgur.com/s2MOYEo.png" alt="drawing" width="600" />
</div>

Nodejs and Express are used to create the Api endpoints and the server, Redis is used for caching while MySQl is used as the database storage.
They are used to build a Rest Api which can be consumed by a front-end application. 
The Api endpoints used for this application can be found in the app documentation through the following link: [postman documentation](https://documenter.getpostman.com/view/7132396/S1LsYVz3)