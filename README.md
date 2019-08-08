# Turing Backend Challenge (E-Commerce)
This project is built to provide backend support through REST APIs for an E-commerce app named TShirtShop.
API endpoints and database is provided by Turing. Backend is built on **Django** Framework using **MySQL** as database server.

## Installation
You will need [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) on your machine to run this project. Once both are installed, cd into a directory, clone the repo and run docker compose.
```bash
git clone https://github.com/FahadNoor/e-commerce.git
cd e-commerce
docker-compose up
```
It will download Docker images of Python and MySQL and create a new image for the project so you may wanna grab a coffee or watch a funny cat video meanwhile because it will take time.

## Usage
By default, Django app will be running on port **8000** and MySQL on port **3406** (In case you want to connect through a client).
Both of the ports can be configured in _docker-compose.yml_ file.
Homepage will be accessible at http://localhost:8000/.
API Documentation is available here:

> [API Documentation](https://documenter.getpostman.com/view/6767012/SVYqNJf9)


## Tests
Run following command to run tests
```bash
python manage.py test apps
``` 

## Authentication
Token Based authentication is used for secure APIs. Token should be sent in the Authorization Header with Bearer key.
```bash
Header: Authorization
Value: Bearer <token>
```

## Errors Format
Errors will be in the following format:
```json
{
    "error": [
        {
            "status": 400,
            "code": "min_value",
            "message": "Ensure this value is greater than or equal to 0.",
            "field": "rating"
        },
        {
            "status": 400,
            "code": "does_not_exist",
            "message": "Invalid pk \"-1\" - object does not exist.",
            "field": "product"
        }
    ]
}
```
If error is not related to any field then
```json
{
    "error": [
        {
            "message": "Authentication credentials were not provided.",
            "code": "not_authenticated",
            "status": 401
        }
    ]
}
```

## Data
Some initial data like Products and Regions is inserted in database at deployment time. A lot of other data is available in the form of fixtures and is used to run tests. In case you want to test an API which needs a certain data, just find the related fixture and dump it in database.
```bash
python manage.py loaddata users customers tokens
```
All the fixtures are available under _fixtures_ directory of all apps.

## Demo Project
App is live on

> [Demo URL](http://3.14.148.108:8000)

As shared above, you can find more details about APIs [here](https://documenter.getpostman.com/view/6767012/SVYqNJf9).