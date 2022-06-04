import { App, syslib } from '../sys/index.js';

// conf
import { $debugOpts } from './conf/index.js';


// controllers
import HomeCtrl from './controllers/HomeCtrl.js';
import QuickstartCtrl from './controllers/QuickstartCtrl.js';
import NotfoundCtrl from './controllers/NotfoundCtrl.js';


// routes
const routes = [
  ['when', '/', 'HomeCtrl'],
  ['when', '/quickstart', 'QuickstartCtrl'],
  ['notfound', 'NotfoundCtrl']
];


// app
const app = new App();
app
  .controllers([
    HomeCtrl,
    QuickstartCtrl,
    NotfoundCtrl
  ])
  .routes(routes)
  .debugger($debugOpts);
