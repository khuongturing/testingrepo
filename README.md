# Turing Backend Challenge

#### Credentials
Test account for gmail and datadog:
  email: `turingbackendtest@gmail.com`
  password: `turingtest123`

Stripe account:
  email: `turingbackendtest@gmail.com`
  password: `stripePassForTuring1`
   
## Local setup

### Prerequisites
1. Node.js v10.14.2 or higher. Download link: https://nodejs.org/en/download/

2. Mysql Community Server latest version. Download link: https://dev.mysql.com/downloads/mysql/. Start server once done.

3. Datadog agent (for APM):
   1. I have created a free 14 day test account on datadog. Please signin using google and use the gmail credentials I have provided above. If the credentials do not work anymore, either create a free account or disable APM by setting `ENABLE_DATADOG_APM: true` to false in `config/default.js`
   
   2. Install the agent: https://docs.datadoghq.com/agent/?tab=agentv6
   
   3. If you're on a mac, you need to install and run the Trace Agent in addition to the Datadog Agent: https://github.com/DataDog/datadog-agent/tree/master/docs/trace-agent#run-on-macos. Download the `amd64` file `trace-agent-6.10.0-darwin-amd64`.

     Then, run,

     `./trace-agent-6.10.0-darwin-amd64 -config ~/.datadog-agent/datadog.yaml`
      
     You can find the location of `datadog.yml` on your OS, here: https://docs.datadoghq.com/agent/guide/agent-configuration-files/?tab=agentv6
   
   4. Enable trace collection for the Datadog Agent: https://docs.datadoghq.com/agent/apm/?tab=agent630#agent-configuration.

     ```
     # Trace Agent Specific Settings
         apm_config:
           enabled: true
     ```

      You can find the location of `datadog.yml` on your OS, here: https://docs.datadoghq.com/agent/guide/agent-configuration-files/?tab=agentv6.

      If you're stuck, you can find the official docs here, https://docs.datadoghq.com/agent/apm/?tab=agent630. See Section `Setup process`.

   5. Restart the datadog-agent. See section `Restart the agent` here, https://docs.datadoghq.com/agent/guide/agent-commands/?tab=agentv6

4. Stripe account for testing (Use credentials above)

5. Postman. Download link: https://www.getpostman.com/downloads/

6. ngrok. Download link: https://ngrok.com/download

7. Swagger UI to view API documentation. Download link: https://swagger.io/tools/swagger-ui/download/

### How to run

1. Clone the repository `git clone https://github.com/MayurRJoshi/turing_backend.git`. Checkout `master` branch.

2. Create database `turing` and load sql file
   ```
   $ mysql -u root -p
   $ Enter password: <enter your password here>
   $ mysql -> create database turing;
   $ mysql -> use database turing;
   $ mysql -> source <path to turing_backend/sql/tshirtshop_new.sql>
   ``` 

3. Update configuration options in `config/default.js`. You'll only need to update the following:
   1. `DATABASE_CONFIG` to match your setup
   2. `STRIPE.SECRET_KEY` with your key if you're not using the credentials provided above. 
   
   The rest of the config will work as is. If you need to make a change, the comments next to each option will help you out.

4. Install node modules and start server
   ```
   npm i
   npm start
   ```

5. Start ngrok. `./ngrok http 3000`. 
   1. Copy the https link created 
   2. Append `/v1/stripe/webhooks` to it. e.g. `https://8bcaef61.ngrok.io/v1/stripe/webhooks`
   3. Post it in the `Webhooks` section Stripe. You will find it under `Developers`


6. Open Postman. Load collection `postman/Turing.postman_collection.json` and environment `postman/turing_environment.postman_environment.json`.

7. Execute each request in each folder in order. 
  I have ordered these to ensure that no changes will be needed to any of the environment variables.
  You will however need to make the following changes:
    1. Update `customer_email` variable to a valid email that you have access to. The stripe webhook handler will send an email to this account. You can also check the `Sent` emails in `turingbackendtest@gmail.com` account.

    2. Stripe token for POST /stripe/charge
       1. First create a new stripe token: https://stripe.com/docs/stripe-js/elements/quickstart. Fill up the credit card form and click submit payment.
       2. Copy the token created
       3. Paste it in the environment variable `stripe_token`. Each token is valid only for one request.

8. Now open the datadog dashboard at https://app.datadoghq.com/. Click on `APM -> Trace list`. You will find the performance metrics of each request.

### Testing

I have provided integration tests for all positive scenarios. 

The unit tests are incomplete. The basic framework for running those tests however is complete. It is just a matter of adding more tests.

Integration tests use a different database, `turing_test` and the node server runs on port `3001` by default. You can change these settings in `config/test.js`

To run integration tests:
`npm run test:integration`

To run unit tests:
`npm run test:unit`

By default APM is set to false for tests. If you want to change it, set `ENABLE_DATADOG_APM` to true in `config/test.js`

### Linting

I've used `eslint` to lint code. Run lint check by `npm run lint`

### Optional requirements

I have added admin routes for these endpoints:
  1. Can add/remove/edit a department
  2. Can add/remove/edit a category
  3. Can add/remove/edit a product
  4. Can add/remove/edit attributes for a product

These routes and their corresponding Postman files are in the `optional` branch. 
The `optional` branch does not have any caching.
You can follow the Postman requests in that branch in order to test those routes.

For architecture related documentation, please see `docs/Architecture.pdf` or `docs/Architecture.md`.

### API documentation

Open `docs/swagger.yaml` in the swagger UI to view all the routes.

### API Errors

The application produces the following errors:

1. 404: Invalid route, method or resource
   ```
   {
    "message": "The requested resource cannot be found."
   }
   ``` 

   ```
   {
    "message": "Department with id 6 was not found"
   }
   ```

2. 403: Missing access token or invalid access token
   ```
    {
       "version": "v3",
       "result": {
           "success": false,
           "status": 403,
           "content": {
               "message": "No token provided."
            }
        } 
    }
   ``` 
3. 400: Invalid input. Joi validation error.
   ```
    {
      "message": "\"password\" is required"
    } 
   ``` 

4. 500: Generic server side error. This means something is wrong with the server

5. 429: Too many requests from a single IP.
   ```
   {
    "message": "Too many requests, please try again later."
   }
   ```

### Security

`npm i` shows 3 warnings. Running `npm audit fix` does not fix these issues. These packages need to be updated by the developer.