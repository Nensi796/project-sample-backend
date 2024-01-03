import './init-aliases';
import dotenv from 'dotenv';
import http from 'http';
import app from './config/express';
import mongooseService from './config/database';
import logger from './utils/logger';

dotenv.config();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port);

server.on('listening', () => {
  logger.info(`Server is listening on PORT ${port}`);
});

server.on('error', (error) => {
  throw error;
});

// Connect to MongoDB
mongooseService.connect();
