import App from './App.js';
import Controller from './mvc/Controller.js';
import * as syslib from './lib/index.js';
import RegochRouter from './router/RegochRouter.js';

export { App, Controller, syslib, RegochRouter };
window.regochWeber.sys = { App, Controller, syslib };
