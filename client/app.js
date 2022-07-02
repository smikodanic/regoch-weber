import { App, syslib } from '/sys/index.js';
import viewsCached from '/client/_cache/views.js';
import env from '/client/env.js';
console.log('env::', env);
// console.log('viewsCached::', viewsCached);


// conf
import { $debugOpts, authOpts } from '/client/conf/index.js';


// controllers
import HomeCtrl from '/client/controllers/HomeCtrl.js';
import QuickstartCtrl from '/client/controllers/QuickstartCtrl.js';
import DocsCtrl from '/client/controllers/DocsCtrl.js';
import ExamplesCtrl from '/client/controllers/ExamplesCtrl.js';
import NotfoundCtrl from '/client/controllers/NotfoundCtrl.js';

/// playground
import Controller_hooksCtrl from '/client/controllers/playground/Controller_hooksCtrl.js';
import ModelCtrl from '/client/controllers/playground/ModelCtrl.js';
import View_rgIncCtrl from '/client/controllers/playground/View_rgIncCtrl.js';
import View_loadViewsCtrl from '/client/controllers/playground/View_loadViewsCtrl.js';
import View_lazyJSCtrl from '/client/controllers/playground/View_lazyJSCtrl.js';
import DataRgCtrl from '/client/controllers/playground/DataRgCtrl.js';
import DataRgListenersCtrl from '/client/controllers/playground/DataRgListenersCtrl.js';
import CookieCtrl from '/client/controllers/playground/CookieCtrl.js';
import FormCtrl from '/client/controllers/playground/FormCtrl.js';

import LoginCtrl from '/client/controllers/playground/LoginCtrl.js';
import LoginokCtrl from '/client/controllers/playground/LoginokCtrl.js';

import Navig1Ctrl from '/client/controllers/playground/Navig1Ctrl.js';
import Navig2Ctrl from '/client/controllers/playground/Navig2Ctrl.js';

import PaginatorCtrl from '/client/controllers/playground/PaginatorCtrl.js';
import AntiflickCtrl from '/client/controllers/playground/AntiflickCtrl.js';
import I18nCtrl from '/client/controllers/playground/I18nCtrl.js';




// routes
const routes = [
  ['when', '/', 'HomeCtrl'],
  ['when', '/quickstart', 'QuickstartCtrl'],
  ['when', '/docs', 'DocsCtrl'],
  ['when', '/examples', 'ExamplesCtrl'],

  ['when', '/playground/controller-hooks', 'Controller_hooksCtrl'],
  ['when', '/playground/controller-hooks-same', 'Controller_hooksCtrl'],
  ['when', '/playground/model', 'ModelCtrl'],
  ['when', '/playground/view-rginc', 'View_rgIncCtrl'],
  ['when', '/playground/view-loadviews', 'View_loadViewsCtrl'],
  ['when', '/playground/view-lazyjs', 'View_lazyJSCtrl'],
  ['when', '/playground/datarg', 'DataRgCtrl'],
  ['when', '/playground/datarglisteners', 'DataRgListenersCtrl'],
  ['when', '/playground/cookie', 'CookieCtrl'],
  ['when', '/playground/form', 'FormCtrl'],

  ['when', '/playground/login', 'LoginCtrl', { authGuards: ['autoLogin'] }],
  ['when', '/playground/developer/dashboard', 'LoginokCtrl', { authGuards: ['isLogged', 'hasRole'] }],

  ['when', '/playground/navig1', 'Navig1Ctrl'],
  ['when', '/playground/navig2', 'Navig2Ctrl'],
  ['redirect', '/playground/navig3', '/playground/navig1'],

  ['when', '/playground/paginator', 'PaginatorCtrl'],
  ['when', '/playground/antiflick', 'AntiflickCtrl'],
  ['when', '/playground/i18n', 'I18nCtrl'],

  ['notfound', 'NotfoundCtrl'],
];


// auth
const auth = new syslib.Auth(authOpts);

// preflight/postflight
const pref1 = async (trx) => { console.log('PREFLIGHT 1 - trx::', trx); };
const pref2 = async (trx) => { console.log('PREFLIGHT 2 - trx::', trx); };
const pref3 = (trx) => { trx.ctrl.showViews(false, true); };
const postf1 = async (trx) => { console.log('POSTFLIGHT 1 - trx::', trx); };
const postf2 = async (trx) => { console.log('POSTFLIGHT 2 - trx::', trx); };
const postf3 = (trx) => { trx.ctrl.showViews(true, true); };

// app
const app = new App();

app
  .controllers([
    HomeCtrl,
    QuickstartCtrl,
    DocsCtrl,
    ExamplesCtrl,
    NotfoundCtrl,

    // playground controllers
    Controller_hooksCtrl,
    ModelCtrl,
    View_rgIncCtrl,
    View_loadViewsCtrl,
    View_lazyJSCtrl,
    DataRgCtrl,
    DataRgListenersCtrl,
    CookieCtrl,
    FormCtrl,

    LoginCtrl,
    LoginokCtrl,

    Navig1Ctrl,
    Navig2Ctrl,

    PaginatorCtrl,
    AntiflickCtrl,
    I18nCtrl
  ]);

app
  .auth(auth) // needed for route authGuards
  // .preflight(pref3)
  // .postflight(postf3)
  .debugger($debugOpts);

app
  .routes(routes)
  .viewsCached(viewsCached);
