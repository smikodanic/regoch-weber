# regoch-web
> Regoch Web is the single page application framework. Very fast and simple to use.

## Features
- no slow compilation as in Angular, Vue or React (no such compilation at all)
- lightweight application with small app file size (~200kB only)
- JS files builded with the gulp and browserify (very fast)
- use CommonJS and write the code just like you are doing that in NodeJS by using require()
- no typescript, no heavy compiling, no bullshit
- Model-View-Controller (MVC), intuitive app structure
- easy to learn and to use - learn it in one day

## Installation
```bash
npm install --save regoch-web
```

## Documentation
[http://www.regoch.org/web](http://www.regoch.org/web)


## How to start
To start a new application clone the [regoch-web-skel](https://github.com/smikodanic/regoch-web-skel) which already has the folder structure and all needed files.


## Example
```javascript
app.js - the app starting point
=======================================================================
const { App } = require('regoch-web');
const viewsCached = require('../_cache/views.json');
const routes = [
  ['when', '/', 'HomeCtrl'],
  ['when', '/page1', 'Page1Ctrl'],
  ['notfound', 'NotFoundCtrl'],
];

// conf
const $debugOpts = require('./conf/$debugOpts');

// controllers
const HomeCtrl = require('./controllers/HomeCtrl');
const Page1Ctrl = require('./controllers/Page1Ctrl');
const NotFoundCtrl = require('./controllers/NotFoundCtrl');

// app
const app = new App();
app
  .controllers([HomeCtrl, Page1Ctrl, NotFoundCtrl])
  .viewsCached(viewsCached)
  .debugger($debugOpts)
  .routes(routes);



HomeCtrl.js  - the controller
=======================================================================
const { Controller } = require('regoch-web');

class HomeCtrl extends Controller {
  constructor(app) {
    super();
  }

  async loader(trx) {
    this.setTitle('Regoch Web Skeleton');
    this.setDescription('The Regoch Web Skeleton is the easiest way to start new Regoch Web App.');
    this.setKeywords('regoch, skell, app');
    this.setLang('en');

    await this.loadView('#layout', 'pages/home/layout.html');
    await this.loadViews([
      ['#main', 'pages/home/main.html']
    ], true);
  }

  async init() {
    this.$model.regochImageURL = '/assets/img/regoch.jpg';
  }
}

module.exports = HomeCtrl;
```

```html
index.html
==========================================================================
<!DOCTYPE html>
<html lang="en">

<head>
  <title>Regoch Web Skel</title>

  <!-- Meta -->
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="The Regoch Skel is the easiest way to start with the Regoch Web.">
  <meta name="keywords" content="regoch, skel">
  <meta name="author" content="">
  <link rel="shortcut icon" href="/assets/img/favicon.ico">

  <!-- CSS -->
  <link rel="stylesheet" href="/styles/app.css">
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>

<body>
  <div data-rg-view="#layout"></div>

  <!-- JS -->
  <script src="/js/app.js"></script>
</body>

</html>
```


### Licence
Copyright (c) 2020 Saša Mikodanić licensed under [MIT](./LICENSE).
