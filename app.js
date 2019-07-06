import express from 'express';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator'
import logger from 'morgan';
import dotenv from 'dotenv';

import config from './config/config';
import router from './src/routes/routes';
import { errorResponse } from './src/utils/errors'
import { sequelize } from './models';

dotenv.config();

const app = express()
const port = config.port

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
  verify: (req, res, buf) => {
        if (req.originalUrl.startsWith('/stripe/webhooks')) {
            req.rawBody = buf.toString('utf8')
    }
  }
}))
app.use(expressValidator());
app.use(router)
app.use((err, req, res, next) => {
    return res.status(500).send(
        errorResponse("USR_02", 500, "A server error occured", "Server")
    )
});
app.get('/', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.status(200).send({ message: 'Welcome to Shopify API...' });
});
app.get('*', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.status(404).send({ message: 'Error! No resource matches your request!' });
});

sequelize.authenticate().then(() => {
    app.listen(port);
        console.log(`listening on ${port}`);
        console.log('Connection to database established successfully')
    })
    .catch(err => {
        console.error('Unable to connect to the database', err);
});

export default app;
