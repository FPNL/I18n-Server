#!/usr/bin/env node

/**
 * Module dependencies.
 */

import debug from 'debug';
import http from 'http';

import app from '../app';
import { m_connectionTest } from '../database/mongoose';
// import { s_connectionTest } from '../database/sequelize';
// import { r_connectionTest } from '../database/redis';
debug('i18n-server:server');
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
(async () => {
  // await s_connectionTest();
  // await r_connectionTest();
  await m_connectionTest();
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
})();
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    // @ts-ignore
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
