import 'newrelic';
import http from 'http';
import logger from 'src/utils/logger';
import { PORT } from 'src/config/constants';
import app from './app';

// setting up the port to be used for creating a server
const port = PORT || 8003;

// create the server
const server = http.createServer(app);

server.listen(port, () => { logger.info(`Application is running on port ${port}`); });

export default app;
