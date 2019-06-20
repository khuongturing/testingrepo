import express from 'express';
import path from 'path';
import cors from 'cors';
import morganLogger from 'morgan';
import bodyParser from 'body-parser';
import baseRouter from 'src/api/router';
import errorHandler from 'src/utils/errorHandler';
import { NODE_ENV } from 'src/config/constants';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.doc';

const app = express();

if (NODE_ENV === 'development') {
  app.use(morganLogger('dev'));
}

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Setup CORS to allow requests from all origins
app.use(cors());

app.get('/', (req, res) => {
  return res.status(200).send({
    message: 'Welcome to Turing Shopping'
  });
});

app.use('/api', baseRouter);

// load assets from public folder
// This is just for the swagger-ui.js file
app.use('/public', express.static(path.join(__dirname, './public')));

// provide custom javascript for the swagger
// This will be used to customise swagger ui
const swaggerOptions = {
  customJs: '/public/swagger-ui.js',
  customCss: `
    .swagger-ui .topbar { display: none; }
    .auth-container .markdown { padding-bottom: 20px; }
  `
};

// apply the route for the swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.use('*', (req, res) => {
  return res.status(404).send({
    error: 'Route not found'
  });
});

// handling all the request and async errors
app.use((err, req, res, next) => {
  return errorHandler(err, req, res, next);
});

export default app;
