const HTTPServer = require('../sys/server/HTTPServer');


///// HTTP Server /////
const httpOpts = {
  port: 3333,
  timeout: 5 * 60 * 1000, // if 0 never timeout
  indexFile: '/client/app.html',
  clientDir: '/client/',
  assetsDir: '/client/assets',
  sysDir: '/sys',
  acceptEncoding: 'gzip', // gzip, deflate or ''
  headers: {
    // CORS Headers
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Methods': 'GET', // 'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, HEAD',
    'Access-Control-Max-Age': '3600'
  },
  debug: true
};
const httpServer = new HTTPServer(httpOpts);
httpServer.start();
