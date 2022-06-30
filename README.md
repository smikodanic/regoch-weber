# regoch-weber
> The Regoch Weber is simple and intuitive JavaScript framework for 
browser single page applications, mobile applications, browser extensions, electronJS desktop apps, ...etc.

## Features
- no slow compilation as in Angular, Vue or React (no compilation at all)
- no npm package dependencies - build apps which will not depend on 3rd party code
- no typescript, no heavy compiling, no bullshit
- create lightweight applications - small app file size (~50kB only)
- use import &amp; export <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules" target="_blank">ES Modules</a> to build complex apps with clear and readable code
- Model-View-Controller (MVC), intuitive app structure
- easy to learn and easy to use
- create very fast applications with reactive features
- shorten your development time rapidly
- steep learning curve (you'll reach high programming skills very fast)


## Good for dynamic and reactive code in:
- browser single page applications
- browser extensions
- ElectronJs desktop applications
- Cordova mobile applications


## Installation
```bash
$ npm install regoch-weber
```


## Download the framework
```bash
$ git clone https://github.com/smikodanic/regoch-weber.git <projectName>
$ cd <projectName>
$ rm -rg .git
```

The files with small example app is downloaded.
Now you can start to build your app by changing HTML, CSS and JS files in "client" folders.
In most cases there's no need to change files other files in other folders.



## Webpack /sys
Bundle and minify /sys/ files.
```bash
$ npx webpack --config sys/webpack-sys.config.js
```
After that include minified file in the client/app.html
```html
<body>
  <div data-rg-view="#layout"></div>

  <script src="/sys/index.min.js"></script>
</body>
```
And use **regochWeber** global variable.
```js
class HomeCtrl extends regochWeber.sys.Controller {
  ...
}
  ```



## Webpack /client
Import /sys files and bundle /client files with webpack.
Bundle whole project.
```bash
$ npx webpack --config client/webpack-client.config.js
```

Then use it in the app.html
```html
<body>
  <div data-rg-view="#layout"></div>

  <script src="/client/app.min.js"></script>
</body>
```







## Documentation
[http://www.regoch.org/weber](http://www.regoch.org/weber)





## Example
```javascript
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
app</small>
  .controllers([
    HomeCtrl,
    QuickstartCtrl,
    NotfoundCtrl
  ])
  .routes(routes)
  .debugger($debugOpts);
```


### Licence
Copyright (c) 2022 Saša Mikodanić licensed under [MIT](./LICENSE).
