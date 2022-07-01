import { HTTPServer, cache } from '../sys/server/index.js';


///// HTTP Server /////
const httpOpts = {
  port: process.env.PORT || 3333, // change port with  $ export PORT = 3330  and remove it with  $ unset PORT
  timeout: 5 * 60 * 1000, // if 0 never timeout
  acceptEncoding: 'gzip', // gzip, deflate or ''
  headers: {
    // CORS Headers
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Methods': 'GET', // 'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, HEAD',
    'Access-Control-Max-Age': '3600'
  },
  debug: false
};
const httpServer = new HTTPServer(httpOpts);
httpServer.start();




///// Proxy Server /////
/*
const ProxyServer = require('../sys/server/HTTPServer');
const proxyOpts = {
  port: 3335,
  request_host: '127.0.0.1',
  request_port: '4400', // HTTP Server port, 4400
  regexpUA: /bot|spider|crawl|curl|lynx|wget/i, // open URL via browser when user agent contains this regular expression
  debug: false
};

const browserOpts = { headless: true, width: 1300, height: 900, position: '700,20' };

const proxyServer = new ProxyServer(proxyOpts, browserOpts);
proxyServer.openBrowser();
proxyServer.start();
*/



////// Build Views Cache ////////
const files = [
  'inc/navbar.html',
  'inc/footer.html'
];
cache.views(files);
