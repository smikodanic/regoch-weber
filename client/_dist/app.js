/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 632:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * The EventEmitter based on window CustomEvent. Inspired by the NodeJS event lib.
 */
class EventEmitter {

  constructor() {
    this.activeOns = []; // [{eventName:string, listener:Function, listenerWindow:Function}]
  }


  /**
   * Create and emit the event
   * @param {string} eventName - event name, for example: 'pushstate'
   * @param {any} detail - event argument
   * @returns {void}j
   */
  emit(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  }


  /**
   * Listen for the event
   * @param {string} eventName - event name, for example: 'pushstate'
   * @param {Function} listener - callback function, for example msg => {...}
   * @returns {void}
   */
  on(eventName, listener) {
    const listenerWindow = event => {
      listener.call(null, event);
    };

    this._removeOne(eventName, listener);
    this.activeOns.push({ eventName, listener, listenerWindow });
    window.addEventListener(eventName, listenerWindow);
  }


  /**
   * Listen for the event only once
   * @param {string} eventName - event name, for example: 'pushstate'
   * @param {Function} listener - callback function
   * @returns {void}
   */
  once(eventName, listener) {
    const listenerWindow = event => {
      listener.call(null, event);

      this._removeOne(eventName, listener, listenerWindow);
    };

    window.addEventListener(eventName, listenerWindow, { once: true });
  }


  /**
   * Stop listening the event for specific listener.
   * @param {string} eventName - event name, for example: 'pushstate'
   * @param {Function} listener - callback function, for example msg => {...}
   * @returns {void}
   */
  off(eventName, listener) {
    this._removeOne(eventName, listener);
  }


  /**
   * Stop listening the event for all listeners defined with on().
   * For example eventEmitter.on('msg', fja1) & eventEmitter.on('msg', fja2) then eventEmitter.off('msg') will remove fja1 and fja2 listeners.
   * @param {string} eventName - event name, for example: 'pushstate'
   * @returns {void}
   */
  offAll(eventName) {
    let ind = 0;
    for (const activeOn of this.activeOns) {
      if (activeOn.eventName === eventName) {
        window.removeEventListener(activeOn.eventName, activeOn.listenerWindow);
        this.activeOns.splice(ind, 1);
      }
      ind++;
    }
  }


  /**
   * Get all active listeners.
   * @returns {{eventName:string, listener:Function, listenerWindow:Function}[]}
   */
  getListeners() {
    return { ...this.activeOns };
  }





  /*** PRIVATES ***/
  /**
   * Remove a listener from window and this.activeOns
   */
  _removeOne(eventName, listener) {
    if (!listener) { throw new Error('eventEmitter._removeOne Error: listener is not defined'); }
    let ind = 0;
    for (const activeOn of this.activeOns) {
      if (activeOn.eventName === eventName && activeOn.listener.toString() === listener.toString()) {
        window.removeEventListener(activeOn.eventName, activeOn.listenerWindow);
        this.activeOns.splice(ind, 1);
      }
      ind++;
    }
  }





}


const eventEmitter = new EventEmitter();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (eventEmitter);


/***/ }),

/***/ 719:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eventEmitter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(632);



/**
 * Manage the URL in browser's address bar.
 */
class Navig {

  constructor() {
    this.previous = { uri: '', ctrl: null };
    this.current = { uri: '', ctrl: null };
  }



  /********** SETTERS & GETTERS ********/
  /**
   * Set previous uri and controller.
   */
  setPrevious() {
    this.previous = { ...this.current };
  }

  /**
   * Set current uri and controller.
   * @param {Controller} ctrl - instance of the current controller
   */
  setCurrent(ctrl) {
    const uri = this.getCurrentURI();
    this.current = { uri, ctrl };
  }

  /**
  * Get the current URI. The uri is path + query string, without hash, for example: /page1.html?q=12
  * @returns {string}
  */
  getPrevioustURI() {
    return this.previous.uri;
  }

  /**
   * Get the current URI. The uri is path + query string, without hash, for example: /page1.html?q=12
   * @returns {string}
   */
  getCurrentURI() {
    return window.location.pathname + window.location.search;
  }


  /**
   * Reset the previous controller properties and execute destroy()
   * @param {object} trx - regoch router transitional variable (defined in router.js -> _exe())
   */
  async resetPreviousController(trx) {
    const ctrl_prev = this.previous.ctrl;
    if (!!ctrl_prev) {
      await ctrl_prev.destroy(trx); // execute destroy() defined in the previous controller
      ctrl_prev.rgKILL(); // kill the previous controller event listeners
      ctrl_prev.emptyModel(); // empty the previous controller $model

      // purge non-standard controller properties
      const ctrlProps = Object.keys(ctrl_prev);
      for (const ctrlProp of ctrlProps) {
        if (
          ctrlProp !== '$debugOpts' &&
          ctrlProp !== '$fridge' &&
          ctrlProp !== '$model' &&
          ctrlProp !== '$modeler' &&
          ctrlProp !== '$navig' &&
          ctrlProp !== '$rg' &&
          ctrlProp !== '$httpClient' &&
          ctrlProp !== '$baseURIhost' &&
          ctrlProp !== '$auth'
        ) {
          delete ctrl_prev[ctrlProp];
          // console.log('purged::', ctrlProp);
        }
      }

    }

  }




  /************ NAVIGATION ************/
  /**
   * Navigates to a view using an absolute URL path. The controller middlewares will be executed.
   * https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
   * @param {string} url - absolute URL path, /customer/product/25?limit=25
   * @param {any} state - the state data. Fetch it with event.detail
   * @param {string} title
   */
  goto(url, state, title) {
    if (!url) { throw new Error('The argument "url" is not defined'); }
    if (!state) { state = {}; }
    if (!title) { title = ''; }
    state = { ...state, url };
    window.history.pushState(state, title, url); // change URL in the browser address bar
    _eventEmitter_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].emit */ .Z.emit('pushstate', state); // pushstate event to activate controller in the router.js
  }


  /**
   * Just change the browser URL and do not execute controller middlewares.
   * @param {string} url - absolute URL path, /customer/product/25?limit=25
   * @param {any} state - the state data. Fetch it with event.detail
   * @param {string} title
   */
  goblind(url, state, title) {
    if (!url) { throw new Error('The argument "url" is not defined'); }
    if (!state) { state = {}; }
    if (!title) { title = ''; }
    state = { ...state, url };
    window.history.pushState(state, title, url); // change URL in the browser address bar
  }


  /**
   * Go forward like forward button is clicked.
   */
  forward() {
    window.history.forward();
  }

  /**
   * Go back like back button is clicked.
   */
  back() {
    window.history.back();
  }

  /**
   * Loads a specific page from the session history.
   * You can use it to move forwards and backwards through the history depending on the delta value.
   * @param {number} delta - history index number, for example: -1 is like back(), and 1 is like forward()
   */
  go(delta) {
    window.history.go(delta);
  }

  /**
   * Reloads the page like refresh button is clicked.
   */
  reload() {
    window.location.reload();
  }




  /********** EVENT LISTENERS ************/
  /**
   * Listen for the 'pushstate' event.
   * The pushstate hapen when element with data-rg-href attribute is clicked.
   * @param {Function} listener - callback function with event parameter, for example pevent => { ... }
   * @returns {void}
   */
  onPushstate(listener) {
    _eventEmitter_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].on */ .Z.on('pushstate', listener);
  }


  /**
   * Listen for the 'popstate' event.
   * The popstate event is fired each time when the current history entry changes (user navigates to a new state).
   * That happens when user clicks on browser's Back/Forward button or when history.back(), history.forward(), history.go() methods are programatically called.
   * Also popstate event occur when the a.href link is clicked (even if it contains only hashtag, for example: <a href="#">test</a>).
   * The event.state is property of the event is equal to the history state object.
   * @param {Function} listener - callback function with event parameter, for example pevent => { ... }
   * @returns {void}
   */
  onPopstate(listener) {
    window.addEventListener('popstate', listener);
  }


  /**
   * Listen for the URL changes.
   * The URL is contained of path and search query but without hash, for example: /page1.html?q=12.
   * @param {Function} listener - callback function with event parameter, for example pevent => { ... }
   * @returns {void}
   */
  onUrlChange(listener) {
    this.onPushstate(listener);
    this.onPopstate(listener);
  }


  /**
   * Listen for the 'hashchange' event.
   * This happens when window.location.hash is changed. For example /product#image --> /product#description
   * @param {Function} listener - callback function with event parameter, for example pevent => { ... }
   * @returns {void}
   */
  onHashchange(listener) {
    window.addEventListener('hashchange', listener);
  }


}


const navig = new Navig();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (navig);


/***/ }),

/***/ 835:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Auxilary controller methods.
 */
class Aux {

  /***** CONTROLLER PROPERTY GETTER/SETTER *****/
  /**
   * Get the controller property's value. For example controller's property is this.$model.firstName in JS and in HTML data-rg-print="$model.firstName"
   * @param {string} prop - controller property name, for example: company.name, $model.car.color, $fridge.color
   * @returns {any}
   */
  _getControllerValue(prop) {
    prop = this._solveInterpolated(prop); // first solve {{...}} brackets, for example: $model.pet___{{pets.$i0._id}} -> $model.pet___12345
    prop = this._solveMath(prop); // $model.pet___solveMath/{{ctrlProp}} + 1/ -> $model.pet___8

    const propSplitted = prop.split('.'); // ['company', 'name']
    const prop1 = propSplitted[0]; // company

    let val = this[prop1]; // controller property value
    propSplitted.forEach((prop, key) => {
      if (key !== 0 && val != undefined) { val = val[prop]; }
    });

    return val;
  }


  /**
   * Set the controller property's value.
   * For example controller's property is this.product.name
   * @param {string} prop - controller property name, for example: $model.product.name
   * @param {any} val - controller property value
   * @returns {void}
   */
  _setControllerValue(prop, val) {
    const propSplitted = prop.split('.'); // ['$model', 'product', 'name']
    let i = 1;
    let obj = this;
    for (const prop of propSplitted) {
      if (i !== propSplitted.length) { // not last property
        if (obj[prop] === undefined) { obj[prop] = {}; }
        obj = obj[prop];
      } else { // on last property associate the value
        obj[prop] = val;
      }
      i++;
    }
  }



  /***** MODEL PROPERTY GETTER/SETTER *****/
  /**
   * Get the model value
   * @param {string} mprop - $model property path (without $model), for example 'car.year' is 'this.$model.car.year'
   */
  _getModelValue(mprop) {
    const prop = '$model.' + mprop;
    const val = this._getControllerValue(prop);
    return val;
  }


  /**
   * Set the $model property's value with <input data-rg-model="modelName.mprop1.mprop2">.
   * Up to 5 levels deep and every object level is a new Proxy object.
   * --- This method will trigger render() because this.$model is Proxy object. ---
   * @param {string} mprop - $model property path (without $model), for example: 'company.ceo.name' represents this.$model.company.ceo.name
   * @param {any} val - the value of $model property i.e. mprop
   * @returns {void}
   */
  _setModelValue(mprop, val) {
    const mprops = mprop.split('.'); // ['company', 'cto',  'name']
    const modelName = mprops.shift(); // modelName:: 'company'  AND  props:: ['cto',  'name']

    if (mprops.length === 0) {
      this.$model[modelName] = val;

    } else if (mprops.length === 1) {
      const prop1 = mprops[0];
      const obj = this.$model[modelName] || {};
      obj[prop1] = val;
      this.$model[modelName] = obj;

    } else if (mprops.length === 2) {
      const prop1 = mprops[0];
      const prop2 = mprops[1];
      const obj = this.$model[modelName] || {};
      obj[prop1] = obj[prop1] || {};
      obj[prop1][prop2] = val;
      this.$model[modelName] = obj;

    } else if (mprops.length === 3) {
      const prop1 = mprops[0];
      const prop2 = mprops[1];
      const prop3 = mprops[2];
      const obj = this.$model[modelName] || {};
      obj[prop1] = obj[prop1] || {};
      obj[prop1][prop2] = obj[prop1][prop2] || {};
      obj[prop1][prop2][prop3] = val;
      this.$model[modelName] = obj;

    } else if (mprops.length === 4) {
      const prop1 = mprops[0];
      const prop2 = mprops[1];
      const prop3 = mprops[2];
      const prop4 = mprops[3];
      const obj = this.$model[modelName] || {};
      obj[prop1] = obj[prop1] || {};
      obj[prop1][prop2] = obj[prop1][prop2] || {};
      obj[prop1][prop2][prop3] = obj[prop1][prop2][prop3] || {};
      obj[prop1][prop2][prop3][prop4] = val;
      this.$model[modelName] = obj;

    } else if (mprops.length === 5) {
      const prop1 = mprops[0];
      const prop2 = mprops[1];
      const prop3 = mprops[2];
      const prop4 = mprops[3];
      const prop5 = mprops[4];
      const obj = this.$model[modelName] || {};
      obj[prop1] = obj[prop1] || {};
      obj[prop1][prop2] = obj[prop1][prop2] || {};
      obj[prop1][prop2][prop3] = obj[prop1][prop2][prop3] || {};
      obj[prop1][prop2][prop3][prop4] = obj[prop1][prop2][prop3][prop4] || {};
      obj[prop1][prop2][prop3][prop4][prop5] = val;
      this.$model[modelName] = obj;
    }

  }



  /***** SOLVERS *****/
  /**
   * Replace iteration variable $i with the number. Use only inside data-rg-for and data-rg-repeat.
   * @param {number} i - number to replace $i with
   * @param {string} txt - text which needs to be replaced, usually it contains HTML tags
   * @param {string} $iExtension - extension of the variable name. For example if $iExtension is 21 then the $i21 will be replaced.
   * @returns {string}
   */
  _solve_$i(i, txt, $iExtension) {
    let reg;
    if (!$iExtension || $iExtension === '0') { reg = new RegExp('\\$i0|\\$i', 'g'); } // $i can be used instead of $i0
    else { reg = new RegExp(`\\$i${$iExtension}`, 'g'); }
    txt = txt.replace(reg, i);
    return txt;
  }


  /**
   * Find {{ctrlProp}} occurrences in the txt and replace it with the controller property value.
   * @param {string} txt - text which needs to be replaced
   */
  _solveInterpolated(txt) {
    const openingChar = '{{';
    const closingChar = '}}';

    const reg = new RegExp(`${openingChar}\\s*${this.$rg.varnameChars}\\s*${closingChar}`, 'g');
    const interpolations = txt.match(reg) || []; // ["age", "user.name"]

    for (const interpolation of interpolations) {
      const prop = interpolation.replace(openingChar, '').replace(closingChar, '').trim();

      let val = this._getControllerValue(prop);
      if (val === undefined) {
        this._debug('warnings', `_solveInterpolatedWarn:: Controller property ${prop} is undefined.`, 'Maroon', 'LightYellow');
        val = '';
      }
      txt = txt.replace(interpolation, val);

      // nested interpolation, for example: data-rg-echo="{{docs.$i.{{fields.$i}}}}"
      if (reg.test(txt)) {
        txt = this._solveInterpolated(txt);
      }
    }

    return txt;
  }


  /**
   * Replace solveMath/expression/ in the txt (HTML code) with the evaluated value.
   * @param {string} txt  - text which needs to be replaced, usually it contains HTML tags
   */
  _solveMath(txt) {
    const reg = /solveMath\/[\d\+\-\*\/\%\(\)\s]+\//g;
    const evs = txt.match(reg); // ['solveMath/0 + 1/', 'solveMath/5 / 2/']
    if (!evs) { return txt; }

    for (const ev of evs) {
      const reg2 = /solveMath\/([\d\+\-\*\/\%\(\)\s]+)\//;
      const expression = ev.match(reg2)[1];
      const result = eval(expression);
      txt = txt.replace(reg2, result);
    }

    return txt;
  }


  /***** COMPARISONS *****/
  /**
   * Caclulate comparison with operators ! = < > && ||: data-rg-if="5 === 3", data-rg-if="this.age > this.myAge", data-rg-if="$model.age <= $model.myAge"
   * @param {any} attrVal - data-rg-if attribute value, for example: 5===3,
   * @returns {boolean}
   */
  _calcComparison_A(attrVal) {
    const reg = new RegExp(`\\$model\\.${this.$rg.varnameChars}|this\\.${this.$rg.varnameChars}`, 'g');
    const props = attrVal.match(reg) || []; // controller properties: ['this.age', '$model.age']

    let expression = attrVal;
    for (const prop of props) {
      const prop2 = prop.trim().replace(/^this\./, '');
      let val = this._getControllerValue(prop2);
      if (typeof val === 'string') { val = `'${val}'`; }
      // console.log(prop, val);
      expression = expression.replace(prop, val);
    }

    let tf = false;
    try {
      tf = eval(expression);
    } catch (err) {
      console.error(`Bad expression "${attrVal}" --> ${expression}`);
    }

    // console.log(expression, '--', tf);
    return tf;
  }

  /**
   * Get true/false directly from the controller/model value: data-rg-if="is_active", data-rg-if="$model.is_active"
   * Caclulate comparison with $ operators, simillar to mongoDB: data-rg-if="this.age $eq(18)", data-rg-if="age $eq(18)", data-rg-if="age $eq(this.myAge)", data-rg-if="age $eq($model.myAge)"
   * @param {any} attrVal - data-rg-if attribute value, for example: is_active, age $gt(this.ctrlProp), age $eq($model.myAge)
   * @returns {boolean}
   */
  _calcComparison_B(attrVal) {
    const propCompSplitted = attrVal.split(/\s+\$/); // ['age', 'eq($model.myAge)'] or ['this.age', 'eq($model.myAge)']

    const prop = propCompSplitted[0].trim().replace(/^this\./, ''); // age
    const val = this._getControllerValue(prop); // 33

    const funcDef = propCompSplitted[1] ? '$' + propCompSplitted[1].trim() : undefined; // $eq($model.myAge)
    const { funcName, funcArgs } = this._funcParse(funcDef); // funcName: $eq , funcArgs: [22]
    const arg = !!funcArgs && !!funcArgs.length ? funcArgs[0] : undefined; // 22

    let tf = !!val;
    if (funcName === '$not') { tf = !val; }
    else if (funcName === '$eq') { tf = val === arg; }
    else if (funcName === '$ne') { tf = val !== arg; }
    else if (funcName === '$gt') { tf = typeof val === 'number' ? val > arg : false; }
    else if (funcName === '$gte') { tf = typeof val === 'number' ? val >= arg : false; }
    else if (funcName === '$lt') { tf = typeof val === 'number' ? val < arg : false; }
    else if (funcName === '$lte') { tf = typeof val === 'number' ? val <= arg : false; }
    else if (funcName === '$in' && !!arg) { tf = arg.indexOf(val) !== -1; } // arg must be array
    else if (funcName === '$nin' && !!arg) { tf = arg.indexOf(val) === -1; } // arg must be array
    else if (funcName === '$reg' && !!arg) { tf = val !== undefined ? arg.test(val) : false; } // arg must be RegExp, val must contain regexp to be true
    else if (funcName === '$nreg' && !!arg) { tf = val !== undefined ? !arg.test(val) : false; } // arg must be RegExp, val shouldn't contain regexp to be true

    // console.log(`funcName:: ${funcName} -- val::${typeof val} ${val} vs. arg::${typeof arg} ${arg} => tf::${tf} --`);
    return tf;
  }



  /***** FUNCTIONS *****/
  /**
   * Execute the assignment. For example: $model.age = 3 in data-rg-click="$model.age = 3" will set model this.$model.age=3
   * Examples: $model.age=3 , $model.name = 'Marko', $model.name="Marko" , $model.age=$element.value , $model.age=this.ctrlProp , $model.age=$model.mdlProp
   * @param {string} assignment - JS assignment, for example: age = 3 i.e. prop=val
  * @param {HTMLElement} elem - element where is the data-rg-... attribute
   * @param {Event} event - the DOM Event object
   * @return {void}
   */
  _assignmentExe(assignment, element, event) {
    try {
      const splitted = assignment.split('='); // prop=val
      const prop = splitted[0].trim();
      let val = splitted[1].trim().replace(/\'|\"|\`/g, '');

      // solve val if it's $element.value or ctrlProp (controller property)
      const reg = new RegExp(this.$rg.varnameChars, '');
      if (/^\$element/.test(val)) { const element_prop = val.split('.')[1] || 'value'; val = element[element_prop]; } // data-rg-click="$model.x = $element.value"
      else if (/^\$event/.test(val)) { const event_prop = val.split('.')[1] || 'type'; val = event[event_prop]; }  // data-rg-click="$model.x = $event.type" (rarely used)
      else if (/^\$model/.test(val)) { val = val.replace('$model.', ''); val = this._getModelValue(val); }  // data-rg-click="$model.x = $model.y"
      else if (/^this\./.test(val)) { val = val.replace('this.', ''); val = this._getControllerValue(val); } // data-rg-click="$model.x = this.ctrlProp"
      else { val = val; } // data-rg-click="$model.x = 888"
      this._setControllerValue(prop, val);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Parse function definition and return function name and arguments.
   * For example: products.list(25, 'str', $event, $element) -> {funcName: 'products.list', funcArgs: [55, elem]}
   * @param {string} funcDef - function definition in the data-rg- attribute
   * @param {HTMLElement} elem - data-rg- HTML element on which is the event applied
   * @param {Event} event - event (click, keyup, ...) applied on the data-rg- element (used only in the DataRgListeners)
   * @returns {{funcName:string, funcArgs:any[], funcArgsStr:string}
   */
  _funcParse(funcDef, elem, event) {
    if (!funcDef) { return {}; }

    const matched = funcDef.match(/^(.+)\((.*)\)$/);
    if (!matched) { console.error(`_funcParseErr: Function "${funcDef}" has bad definition.`); return {}; }
    const funcName = matched[1] || ''; // function name: products.list

    const funcArgsStr = !!matched[2] ? matched[2].trim() : ''; // function arguments: 25, 'str', $event, $element, this.products
    const funcArgs = !funcArgsStr ? [] : funcArgsStr
      .split(',')
      .map(arg => {
        arg = arg.trim();
        if (arg === '$element') { arg = elem; }
        else if (arg === '$value') { arg = this._getElementValue(elem, true); }
        else if (arg === '$event') { arg = event; }
        else if (/"|'/.test(arg)) { arg = arg.replace(/\'/g, ''); } // string
        else if (/^-?\d+\.?\d*$/.test(arg) && !/\'/.test(arg)) { arg = +arg; } // number
        else if ((arg === 'true' || arg === 'false')) { arg = JSON.parse(arg); } // boolean
        else if (/^\/.+\/i?g?$/.test(arg)) { // if regular expression, for example in replace(/Some/i, 'some')
          const mat = arg.match(/^\/(.+)\/(i?g?)$/);
          arg = new RegExp(mat[1], mat[2]);
        }
        else if (/^this\./.test(arg)) { // if contain this. i.e. controller property
          const prop = arg.replace(/^this\./, ''); // remove this.
          const val = this._getControllerValue(prop);
          arg = val;
        }
        else if (/^\$model\./.test(arg)) { // if contain this. i.e. controller property
          const mprop = arg.replace(/^\$model\./, ''); // remove this.
          const val = this._getModelValue(mprop);
          arg = val;
        }
        return arg;
      });

    return { funcName, funcArgs, funcArgsStr };
  }


  /**
   * Execute the function. It can be the controller method or the function defined in the controller proerty.
   * @param {string} funcName - function name, for example: runKEYUP or products.list
   * @param {any[]} funcArgs - function argumants
   * @return {void}
   */
  async _funcExe(funcName, funcArgs) {
    try {
      if (/\./.test(funcName)) {
        // execute the function in the controller property, for example: this.print.inConsole = () => {...}
        const propSplitted = funcName.split('.'); // ['print', 'inConsole']
        let func = this;
        for (const prop of propSplitted) { func = func[prop]; }
        await func(...funcArgs);
      } else {
        // execute the controller method
        if (!this[funcName]) { throw new Error(`Method "${funcName}" is not defined in the "${this.constructor.name}" controller.`); }
        await this[funcName](...funcArgs);
      }

    } catch (err) {
      console.error(err);
    }
  }


  /**
   * Execute multiple functions, for example: data-rg-click="f1(); f2(a, b);";
   * @param {string} funcDefs - definition of the functions: func1();func2(a, b);
   * @param {HTMLElement} elem - element where is the data-rg-... attribute
   * @param {Event} event - the DOM Event object
   */
  async _funcsExe(funcDefs, elem, event) {
    const statement_reg = /\w\s*\=\s*[a-zA-z0-9\'\"\$]+/; // regexp for statement, for example age = 3
    if (statement_reg.test(funcDefs)) {
      const assignment = funcDefs;
      this._assignmentExe(assignment, elem, event);
      return;
    }

    const funcDefs_arr = funcDefs.split(';').filter(funcDef => !!funcDef).map(funcDef => funcDef.trim());
    for (const funcDef of funcDefs_arr) {
      const { funcName, funcArgs } = this._funcParse(funcDef, elem, event);
      await this._funcExe(funcName, funcArgs);
    }
  }



  /***** DOM ELEMENTS *****/
  /**
   * Clone the original element and place new element in the element sibling position.
   * The original element gets data-rg-xyz-id , unique ID to distinguish the element from other data-rg-xyz elements on the page.
   * The cloned element gets data-rg-xyz-gen and data-rg-xyz-id attributes.
   * @param {Element} elem - original element
   * @param {string} attrName - attribute name: data-rg-for, data-rg-repeat, data-rg-print
   * @param {string} attrVal - attribute value: 'continent @@ append'
   * @returns
   */
  _genElem_create(elem, attrName, attrVal) {
    // hide the original data-rg-xyz (reference) element
    elem.style.display = 'none';

    let uid = this._uid();

    const dataRgId = elem.getAttribute(`${attrName}-id`);
    if (!dataRgId) {
      elem.setAttribute(`${attrName}-id`, uid); // add data-rg-xyz-id , unique ID (because the page can have multiple elements with [data-rg-xyz-gen="${attrVal}"] and we need to distinguish them)
    } else {
      uid = dataRgId; // if the uid is already assigned
    }


    // clone the data-rg-xyz element
    const newElem = elem.cloneNode(true);
    newElem.removeAttribute(attrName);
    newElem.setAttribute(`${attrName}-gen`, attrVal);
    newElem.setAttribute(`${attrName}-id`, uid);
    newElem.style.display = '';

    // place newElem as sibling of the elem
    elem.parentNode.insertBefore(newElem, elem.nextSibling);

    return newElem;
  }


  /**
   * Remove element with the specific data-rg-xyz-gen and data-rg-xyz-id attributes.
   * @param {Element} elem - original element
   * @param {string} attrName - attribute name: data-rg-for, data-rg-repeat, data-rg-print
   * @param {string} attrVal - attribute value: 'continent @@ append'
   * @returns
   */
  _genElem_remove(elem, attrName, attrVal) {
    const uid = elem.getAttribute(`${attrName}-id`);
    const genAttr_sel = `[${attrName}-gen="${attrVal}"][${attrName}-id="${uid}"]`;
    const genElems = document.querySelectorAll(genAttr_sel);
    for (const genElem of genElems) { genElem.remove(); }
  }


  /**
   * Set the HTML form element value. Make correction according to the element & value type.
   * @param {HTMLElement} elem - HTML form element
   * @param {any} val - value to populate HTML form element (if val is undefined then it's empty string)
   */
  _setElementValue(elem, val = '') {
    if (typeof val === 'object') {
      if (elem.type === 'textarea') { val = JSON.stringify(val, null, 2); }
      else { val = JSON.stringify(val); }
    }
    elem.value = val;
    elem.setAttribute('value', val);
  }


  /**
   * Get the HTML form element value. Make correction according to the element type & value type.
   * Element types: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
   * @param {HTMLElement} elem - HTML form element
   * @param {boolean} convertType - default true
   * @returns {any} val - single value or array for checkbox and select-multiple
   */
  _getElementValue(elem, convertType = true) {
    // pickup all elements with same name="something", for example checkboxes
    let val;

    if (elem.type === 'checkbox') {
      const elems = document.querySelectorAll(`[name="${elem.name}"]`);
      const valArr = [];
      let i = 1;
      for (const elem of elems) {
        let v = elem.value;
        if (convertType) { v = this._typeConvertor(elem.value); }
        if (elem.checked) { valArr.push(v); val = valArr; }
        if (i === elems.length && !val) { val = []; }
        i++;
      }

    } else if (elem.type === 'select-multiple') {
      const opts = elem.selectedOptions; // selected options
      const valArr = [];
      let i = 1;
      for (const opt of opts) {
        let v = opt.value;
        if (convertType) { v = this._typeConvertor(opt.value); }
        valArr.push(v);
        val = valArr;
        if (i === opts.length && !val) { val = []; }
        i++;
      }

    } else if (elem.type === 'radio') {
      let v = elem.value;
      if (convertType) { v = this._typeConvertor(elem.value); }
      if (elem.checked) { val = v; }

    } else if (elem.type === 'number') {
      const v = elem.valueAsNumber;
      val = v;

    } else if (elem.type === 'password') {
      val = elem.value;

    } else if (elem.type === 'file' && elem.multiple) {
      val = elem.files;

    } else if (elem.type === 'file') {
      val = elem.files[0];

    } else {
      let v = elem.value;
      if (convertType) { v = this._typeConvertor(elem.value); }
      val = v;
    }

    return val;
  }


  /**
  * Remove elements which has generated element as parent i.e. if the parent has data-rg-xyz-gen attribute then delete that parent.
  * @param {string} attrName - attribute name - 'data-rg-for'
  * @param {string|RegExp} attrValQuery - query the attribute value, for example: 'companies' , or /companies\.\$/i
  * @returns {void}
  */
  _removeParentElements(attrName, attrValQuery) {
    let elems = document.querySelectorAll(`[${attrName}]`);

    if (!!attrValQuery && typeof attrValQuery === 'string') {
      elems = document.querySelectorAll(`[${attrName}^="${attrValQuery}"]`);

    } else if (!!attrValQuery && attrValQuery instanceof RegExp) {
      const elems2 = [];
      for (const elem of elems) {
        const attrVal = elem.getAttribute(attrName);
        const tf = attrValQuery.test(attrVal);
        if (tf) { elems2.push(elem); }
      }
      elems = elems2;
    }

    // removals
    for (const elem of elems) {
      const parentElem = elem.parentNode;
      if (parentElem.hasAttribute(`${attrName}-gen`)) { parentElem.remove(); }
    }
  }


  /**
   * Get the DOM elements by the query.
   * For example in data-rg-for="companies.$i{fields.$i}" --> attrName will be 'data-rg-for' and attrQuery will be /^companies\.\$\{fields/
   * @param {string} attrName - attribute name - 'data-rg-for'
   * @param {string|RegExp} attrValQuery - query the attribute value, for example: 'companies' , or /companies\.\$/i
   * @returns {HTMLElement[]}
   */
  _listElements(attrName, attrValQuery) {
    let elems = document.querySelectorAll(`[${attrName}]`);

    if (!!attrValQuery && typeof attrValQuery === 'string') {
      elems = document.querySelectorAll(`[${attrName}^="${attrValQuery}"]`);

    } else if (!!attrValQuery && attrValQuery instanceof RegExp) {
      const elems2 = [];
      for (const elem of elems) {
        const attrVal = elem.getAttribute(attrName);
        const tf = attrValQuery.test(attrVal);
        if (tf) { elems2.push(elem); }
      }
      elems = elems2;
    }

    return elems;
  }


  /**
   * Sort elements from higher to lower priority -> 3,2,1,0 . Priority is defined in the attribute value, data-rg-for="companies @@ <priority>"
   * @param {HTMLElement[]} elems - array of the elements with specific attribute name
   * @param {string} attrName - attribute name, for example data-rg-for
   */
  _sortElementsByPriority(elems, attrName) {
    // get priority number from data-rg-for="companies @@ 2"
    const getPriority = elem => {
      const attrVal = elem.getAttribute(attrName);
      const attrValSplited = attrVal.split(this.$rg.separator);
      const priority = !!attrValSplited[1] ? attrValSplited[1].trim() : 0;
      return +priority;
    };

    // convert elems to JS Array --> [{elem, priority}]  because elems doesn't have sort()
    let elems_arr = [];
    for (const elem of elems) {
      const priority = getPriority(elem);
      elems_arr.push({ elem, priority });
    }

    // sort elements descending
    elems_arr = elems_arr.sort((elem1, elem2) => {
      const prior1 = elem1.priority;
      const prior2 = elem2.priority;
      return prior2 - prior1;
    });
    // console.log('elems_arr::', elems_arr);

    // convert JS Array to HTML Elements array
    elems = elems_arr.map(elem_arr => elem_arr.elem);

    return elems;
  }



  /***** MISC *****/
  /**
   * Convert string into integer, float or boolean.
   * @param {string} value
   * @returns {string | number | boolean | object}
   */
  _typeConvertor(value) {
    function isJSON(value) {
      try { JSON.parse(value); }
      catch (err) { return false; }
      return true;
    }

    if (!!value && !isNaN(value) && !/\./.test(value)) { // convert string into integer (12)
      value = parseInt(value, 10);
    } else if (!!value && !isNaN(value) && /\./.test(value)) { // convert string into float (12.35)
      value = parseFloat(value);
    } else if (value === 'true' || value === 'false') { // convert string into boolean (true)
      value = JSON.parse(value);
    } else if (isJSON(value)) {
      value = JSON.parse(value);
    }

    return value;
  }


  /**
   * Create unique id.
   */
  _uid() {
    const date = Date.now() / 1000;
    const ms = (date + '').split('.')[1];
    const rnd = Math.round(Math.random() * 1000);
    const uid = ms + '-' + rnd;
    return uid;
  }


  /**
   * Debug the controller methods.
   * @param {string} tip - debug type: rgprint, render, ...
   * @param {string} text - the printed text
   * @param {string} color - text color
   * @param {string} background - background color
   * @returns {object}
   */
  _debug(tip, text, color, background) {
    if (this.$debugOpts[tip]) { console.log(`%c ${text}`, `color: ${color}; background: ${background}`); }
    return this.$debugOpts;
  }


  _printError(err) {
    const errMsg = err.message;
    const errStack = err.stack.replace(/\n/g, '<br>');
    document.body.innerHTML = `
      <div style="margin:0px 13px;">
        <h5 style="color:Gray">Page Error</h5>
        <b style="color:Red;font:14px Verdana;">${errMsg}</b>
        <br><span style="color:Gray;font:12px Verdana;">${errStack}</span>
      </div>
    `;
    console.error(err);
  }



}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Aux);


/***/ }),

/***/ 242:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ mvc_DataRg)
});

// EXTERNAL MODULE: ./sys/mvc/Aux.js
var Aux = __webpack_require__(835);
// EXTERNAL MODULE: ./sys/lib/navig.js
var navig = __webpack_require__(719);
;// CONCATENATED MODULE: ./sys/mvc/DataRgListeners.js




/**
 * Parse HTML elements with the "data-rg-" attribute (event listeners)
 */
class DataRgListeners extends Aux/* default */.Z {

  constructor() {
    super();
  }


  /**
   * Remove all listeners (click, input, keyup, ...) from the elements with the "data-rg-..." attribute
   * when controller is destroyed i.e. when URL is changed. See /sys/router.js
   * @returns {void}
   */
  async rgKILL() {
    // this._debug().rgKILL = true;
    this._debug('rgKILL', `------- rgKILL (start) ctrl: ${this.constructor.name} -------`, 'orange', '#FFD8B6');

    const promises = [];
    let i = 1;
    for (const rgListener of this.$rg.listeners) {
      rgListener.elem.removeEventListener(rgListener.eventName, rgListener.handler);
      this._debug('rgKILL', `${i}. killed:: ${rgListener.attrName} --- ${rgListener.eventName} --- ${rgListener.elem.localName} -- ${rgListener.elem.innerHTML} -- ctrl:: ${this.constructor.name}`, 'orange');
      promises.push(Promise.resolve(true));
      i++;
    }

    await Promise.all(promises);
    this.$rg.listeners = [];
    this._debug('rgKILL', '------- rgKILL (end) -------', 'orange', '#FFD8B6');
  }



  /**
   * data-rg-href
   * <a href="/product/12" data-rg-href>Product 12</a>
   * <a href="" data-rg-href="/product/12">Product 12</a>
   * Href listeners and changing URLs (browser history states).
   * NOTICE: Click on data-rg-href element will destroy the controller i.e. rgKILL() will be invoked.
   * @returns {void}
   */
  rgHref() {
    this._debug('rgHref', '--------- rgHref ------', 'orange', '#F4EA9E');

    const attrName = 'data-rg-href';
    const elems = this._listElements(attrName, '');
    this._debug('rgHref', `found elements:: ${elems.length}`, 'orange');
    if (!elems.length) { return; }

    for (const elem of elems) {

      const handler = async event => {
        event.preventDefault();

        // change browser's address bar (emit 'pushstate' event)
        const href = elem.getAttribute('data-rg-href') || elem.getAttribute('href') || '';
        const url = href.trim();
        const state = { href };
        const title = !!elem.innerText ? elem.innerText.trim() : '';
        if (!!url) { navig/* default.goto */.Z.goto(url, state, title); }

        this._debug('rgHref', `Executed rgHref listener -->  href: ${href}, ctrl:: ${this.constructor.name}`, 'orangered');
      };

      const eventName = 'click';
      elem.addEventListener(eventName, handler);
      this.$rg.listeners.push({ attrName, elem, handler, eventName });
      this._debug('rgHref', `pushed::  tag: ${elem.localName} | href="${elem.pathname}" | rgListeners: ${this.$rg.listeners.length}`, 'orange');
    }
  }



  /**
   * data-rg-click="<controllerMethod> [@@ preventDefault]"
   * <button data-rg-click="myFunc()">CLICK ME</button>
   * Listen for click and execute the function i.e. controller method.
   * @returns {void}
   */
  rgClick() {
    this._debug('rgClick', '--------- rgClick ------', 'orange', '#F4EA9E');

    const attrName = 'data-rg-click';
    const elems = this._listElements(attrName, '');
    this._debug('rgClick', `found elements:: ${elems.length}`, 'orange');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName); // string 'myFunc(x, y, ...restArgs) @@ preventDefault'
      if (!attrVal) { console.error(`Attribute "data-rg-click" has bad definition (data-rg-click="${attrVal}").`); continue; }

      const attrValSplited = attrVal.split(this.$rg.separator);
      const funcDefs = attrValSplited[0]; // func1();func2(a, b);
      const tf = !!attrValSplited[1] && attrValSplited[1].trim() === 'preventDefault';

      const handler = async event => {
        if (tf) { event.preventDefault(); }
        await this._funcsExe(funcDefs, elem, event);
        this._debug('rgClick', `Executed rgClick listener --> ${funcDefs} | preventDefault: ${tf}`, 'orangered');
      };

      const eventName = 'click';
      elem.addEventListener(eventName, handler);
      this.$rg.listeners.push({ attrName, elem, handler, eventName });
      this._debug('rgClick', `pushed::  tag: ${elem.localName} | data-rg-click="${attrVal}" | preventDefault: ${tf} | rgListeners: ${this.$rg.listeners.length}`, 'orange');
    }
  }


  /**
   * data-rg-keyup="<controllerMethod> [@@ keyCode]"
   * <input type="text" data-rg-keyup="myFunc()"> - it will execute myFunc on every key
   * <input type="text" data-rg-keyup="myFunc() @@ enter"> - it will execute myFunc on Enter
   * Parse the "data-rg-keyup" attribute. Listen for the keyup event on certain element and execute the controller method.
   * @returns {void}
   */
  rgKeyup() {
    this._debug('rgKeyup', '--------- rgKeyup ------', 'orange', '#F4EA9E');

    const attrName = 'data-rg-keyup';
    const elems = this._listElements(attrName, '');
    this._debug('rgKeyup', `found elements:: ${elems.length}`, 'orange');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName);
      const attrValSplited = attrVal.split(this.$rg.separator);

      if (!attrValSplited[0]) { console.error(`Attribute "data-rg-keyup" has bad definition (data-rg-keyup="${attrVal}").`); continue; }
      const funcDefs = attrValSplited[0]; // func1();func2();

      let keyCode = attrValSplited[1] || '';
      keyCode = keyCode.trim().toLowerCase();

      const handler = async event => {
        let eventCode;
        if (event.code) { eventCode = event.code.toLowerCase(); }
        if (!!keyCode && keyCode !== eventCode) { return; }
        await this._funcsExe(funcDefs, elem, event);
        this._debug('rgKeyup', `Executed rgKeyup listener --> ${funcDefs} | eventCode: ${eventCode}`, 'orangered');
      };

      const eventName = 'keyup';
      elem.addEventListener(eventName, handler);
      this.$rg.listeners.push({ attrName, elem, handler, eventName });
      this._debug('rgKeyup', `pushed::  tag: ${elem.localName} | data-rg-keyup="${attrVal}" | ctrl="${this.constructor.name}" | rgListeners: ${this.$rg.listeners.length}`, 'orange');
    }
  }



  /**
   * data-rg-change="<controllerMethod>"
   * <select data-rg-change="myFunc()">
   * Listen for change and execute the function i.e. controller method.
   * @returns {void}
   */
  rgChange() {
    this._debug('rgChange', '--------- rgChange ------', 'orange', '#F4EA9E');

    const attrName = 'data-rg-change';
    const elems = this._listElements(attrName, '');
    this._debug('rgChange', `found elements:: ${elems.length}`, 'orange');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName); // string 'myFunc(x, y, ...restArgs)'
      if (!attrVal) { console.error(`Attribute "data-rg-change" has bad definition (data-rg-change="${attrVal}").`); continue; }
      const funcDefs = attrVal; // func1();func2();

      const handler = async event => {
        await this._funcsExe(funcDefs, elem, event);
        this._debug('rgChange', `Executed rgChange listener --> ${funcDefs}`, 'orangered');
      };

      const eventName = 'change';
      elem.addEventListener(eventName, handler);
      this.$rg.listeners.push({ attrName, elem, handler, eventName });
      this._debug('rgChange', `pushed::  tag: ${elem.localName} | data-rg-change="${attrVal}" | rgListeners: ${this.$rg.listeners.length}`, 'orange');
    }
  }



  /**
   * data-rg-evt="eventName1 @@ <controllerMethod1> [&& eventName2 @@ <controllerMethod2>]"
   * Listen for event and execute the function i.e. controller method.
   * Example:
   * data-rg-evt="mouseenter @@ myFunc($element, $event, 25, 'some text')"  - $element and $event are the DOM objects of the data-rg-evt element
   * @returns {void}
   */
  rgEvt() {
    this._debug('rgEvt', '--------- rgEvt ------', 'orange', '#F4EA9E');
    const attrName = 'data-rg-evt';
    const elems = this._listElements(attrName, '');
    this._debug('rgEvt', `found elements:: ${elems.length}`, 'orange');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName).trim(); // mouseenter @@ runEVT($element, $event, 'red') && mouseleave @@ runEVT($element, $event, 'green')
      const directives = attrVal.split('&&');

      for (const directive of directives) {
        const attrValSplited = directive.split(this.$rg.separator);
        if (!attrValSplited[0] || !attrValSplited[1]) { console.error(`Attribute "data-rg-evt" has bad definition (data-rg-evt="${attrVal}").`); continue; }

        const eventName = attrValSplited[0].trim();
        const funcDefs = attrValSplited[1]; // func1();func2();

        const handler = async event => {
          await this._funcsExe(funcDefs, elem, event);
          this._debug('rgEvt', `Executed rgEvt listener --> ${funcDefs}`, 'orangered');
        };

        elem.addEventListener(eventName, handler);
        this.$rg.listeners.push({ eventName, attrName, elem, handler, eventName });
        this._debug('rgEvt', `pushed::  tag: ${elem.localName} | data-rg-evt | event: ${eventName} | rgListeners: ${this.$rg.listeners.length}`, 'orange');
      }
    }
  }



  /**
   * data-rg-set="<controllerProperty> [@@convertType|convertTypeDont]"
   * Parse the "data-rg-set" attribute. Get the value from elements like INPUT, SELECT, TEXTAREA, .... and set the controller property i.e. $model.
   * Examples:
   * data-rg-set="product" - product is the controller property
   * data-rg-set="product.name"
   * data-rg-set="product.price @@ convertType" -> will convert price to number
   * data-rg-set="product.price @@ convertTypeDont" -> will not convert price to number, it will stay string
   * @returns {void}
   */
  rgSet() {
    this._debug('rgSet', '--------- rgSet ------', 'orange', '#F4EA9E');

    const attrName = 'data-rg-set';
    const elems = this._listElements(attrName, '');
    this._debug('rgSet', `found elements:: ${elems.length}`, 'orange');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName);
      if (!attrVal) { console.error(`Attribute "data-rg-set" has bad definition (data-rg-set="${attrVal}").`); continue; }

      const attrValSplited = attrVal.split(this.$rg.separator);

      const prop = attrValSplited[0].trim();

      const convertType_param = !!attrValSplited[1] ? attrValSplited[1].trim() : ''; // 'convertType' | 'convertTypeDont'
      const convertType = convertType_param === 'convertTypeDont' ? false : true;

      const handler = event => {
        const val = this._getElementValue(elem, convertType);
        this._setControllerValue(prop, val);
        this._debug('rgSet', `Executed rgSet listener --> controller property:: ${prop} = ${val}`, 'orangered');
      };

      const eventName = 'input';
      elem.addEventListener(eventName, handler);
      this.$rg.listeners.push({ attrName, elem, handler, eventName });
      this._debug('rgSet', `pushed::  <${elem.localName} ${attrName}="${attrVal}"> | rgListeners: ${this.$rg.listeners.length}`, 'orange');
    }
  }



  /**
   * data-rg-model="<controllerProp> [@@convertType|convertTypeDont]"
   * Bind controller property and view INPUT, SELECT, TEXTAREA, ...etc in both directions.
   * When the view is updated the controller property will be updated and when controller property is updated the view will be updated.
   * This is a shortcut of rgSet and rgValue, for example <input type="text" data-rg-input="product" data-rg-set="product"> is <input type="text" data-rg-model="product">
   * Example:
   * data-rg-model="product.name"
   * data-rg-model="product.price @@ convertType" -> will convert price to number
   * data-rg-model="product.price @@ convertTypeDont" -> will not convert price to number, it will stay string
   * @returns {void}
   */
  rgModel() {
    this._debug('rgModel', '--------- rgModel ------', 'orange', '#F4EA9E');

    const attrName = 'data-rg-model';
    const elems = this._listElements(attrName, '');
    this._debug('rgModel', `found elements:: ${elems.length}`, 'orange');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName);
      if (!attrVal) { console.error(`Attribute "data-rg-model" has bad definition (data-rg-model="${attrVal}").`); continue; }

      const attrValSplited = attrVal.split(this.$rg.separator);

      const mprop = attrValSplited[0].replace('$model.', '').trim(); // $model property name (without $model.)

      const convertType_param = !!attrValSplited[1] ? attrValSplited[1].trim() : ''; // 'convertType' | 'convertTypeDont'
      const convertType = convertType_param === 'convertTypeDont' ? false : true;

      /** SETTER **/
      const val1 = this._getModelValue(mprop);
      this._setElementValue(elem, val1);
      this._debug('rgModel', `rgModel set element value  --> controller property:: ${mprop} = ${val1} | elem.type:: ${elem.type}`, 'orangered');

      /** LISTENER **/
      const handler = event => {
        const val2 = this._getElementValue(elem, convertType);
        this._setModelValue(mprop, val2); // this will trigger render()
        this._debug('rgModel', `Executed rgModel listener --> controller property:: ${mprop} = ${val2}`, 'orangered');
      };

      const eventName = 'input';
      elem.addEventListener(eventName, handler);
      this.$rg.listeners.push({ attrName, elem, handler, eventName });
      this._debug('rgModel', `rgModel listener -- pushed::  <${elem.localName} ${attrName}="${attrVal}"> -- rgListeners: ${this.$rg.listeners.length}`, 'orange');
    }

  }



}


/* harmony default export */ const mvc_DataRgListeners = (DataRgListeners);


;// CONCATENATED MODULE: ./sys/mvc/DataRg.js



/**
 * Parse HTML elements with the "data-rg-" attribute (non-listeners)
 */
class DataRg extends mvc_DataRgListeners {

  constructor() {
    super();

    this.$rg = {
      separator: '@@', // separator in the data-rg- attribute
      elems: {},  // set by rgElem()
      listeners: [], // collector of the data-rg- listeners  [{attrName, elem, handler, eventName}]
      varnameChars: '[a-zA-Z\\d\\$\\_\\.]+' // valid characters in the variable name
    };
  }


  /**
   * data-rg-setinitial="<controllerProperty> [@@convertType|convertTypeDont]"
   * Parse the "data-rg-setinitial" attribute in the form tag.
   * Get the element value and set the controller property value. The element is input, textarea or select tag.
   * Examples:
   * data-rg-setinitial="product" or data-rg-setinitial="product @@convertType" - convert data type automatically, for example: '5' convert to Number, or JSON to Object
   * data-rg-setinitial="employee.name @@convertTypeDont" - do not convert data type automatically
   * @returns {void}
   */
  rgSetinitial() {
    this._debug('rgSetinitial', '--------- rgSetinitial ------', 'navy', '#B6ECFF');

    const attrName = 'data-rg-setinitial';
    const elems = this._listElements(attrName, '');
    this._debug('rgSetinitial', `found elements:: ${elems.length}`, 'navy');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName) || ''; // 'controllerProperty @@convertTypeNot'
      if (!attrVal) { console.error(`rgSetinitial Error:: Attribute has bad definition (data-rg-setinitial="${attrVal}").`); continue; }

      const attrValSplited = attrVal.split(this.$rg.separator);

      const prop = attrValSplited[0].trim();

      const convertType_param = !!attrValSplited[1] ? attrValSplited[1].trim() : ''; // 'convertType' | 'convertTypeDont'
      const convertType = convertType_param === 'convertTypeDont' ? false : true;

      const val = this._getElementValue(elem, convertType);
      this._setControllerValue(prop, val);

      this._debug('rgSetinitial', `elem.type:: ${elem.type} -- set initial --> ${prop}:: ${val}`, 'navy');
    }
  }


  /************** GENERATORS (create or remove HTML elements) *************/
  /**
   * data-rg-for="<controllerProperty> [@@<priority>]"
   * Parse the "data-rg-for" attribute. Multiply element by the controllerProperty array value.
   * Element with the higher priprity will be parsed before.
   * Examples:
   * data-rg-for="companies"
   * data-rg-for="company.employers"
   * data-rg-for="company.employers @@ 2" --> priority is 2
   * @param {string|RegExp} attrValQuery - controller property name, query for the attribute value
   * @returns {void}
   */
  rgFor(attrValQuery) {
    this._debug('rgFor', `--------- rgFor (start) ------`, 'navy', '#B6ECFF');

    const attrName = 'data-rg-for';
    this._removeParentElements(attrName, attrValQuery);
    let elems = this._listElements(attrName, attrValQuery);
    elems = this._sortElementsByPriority(elems, attrName); // sorted elements
    this._debug('rgFor', `found elements:: ${elems.length} | attrValQuery:: ${attrValQuery}`, 'navy');
    if (!elems.length) { return; }


    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName); // company.employers
      const attrValSplited = attrVal.split(this.$rg.separator);

      const priority = !!attrValSplited[1] ? attrValSplited[1].trim() : 0;

      const prop = attrValSplited[0].trim();
      const val = this._getControllerValue(prop);

      // remove all gen elems
      this._genElem_remove(elem, attrName, attrVal);

      if (this._debug().rgFor) { console.log('rgFor -->', 'attrVal::', attrVal, ' | val::', val, ' priority::', priority); }
      if (!val || (!!val && !val.length)) { elem.style.display = 'none'; continue; }

      // generate new element and place it in the sibling position
      const newElem = this._genElem_create(elem, attrName, attrVal);

      // multiply new element by cloning and adding sibling elements
      const newElemsTotal = val.length;
      for (let i = 1; i <= newElemsTotal; i++) {
        const i2 = newElemsTotal - i; // when newElemsTotal=4 then i2 has 3,2,1,0
        elem.parentNode.insertBefore(newElem, elem.nextSibling);
        let outerHTML = this._solve_$i(i2, newElem.outerHTML, priority); // replace $i, $i1, $i12 with the number
        outerHTML = this._solveInterpolated(outerHTML); // parse interpolated text in the variable name, for example: pet_{{$model.pets.$i0._id}}
        outerHTML = this._solveMath(outerHTML); // calculte for example solveMath/$i0 + 1/
        newElem.outerHTML = outerHTML;
      }

    }

    this._debug('rgFor', '--------- rgFor (end) ------', 'navy', '#B6ECFF');
  }



  /**
   * data-rg-repeat="controllerProperty"
   * Parse the "data-rg-repeat" attribute. Repeat the element n times wher n is defined in the controller property.
   * It's same as rgFor() except the controller property is not array but number.
   * Examples:
   * data-rg-repeat="totalRows"
   * @param {string|RegExp} attrValQuery - controller property name, query for the attribute value
   * @returns {void}
   */
  rgRepeat(attrValQuery) {
    this._debug('rgRepeat', `--------- rgRepeat (start) ------`, 'navy', '#B6ECFF');

    const attrName = 'data-rg-repeat';
    const elems = this._listElements(attrName, attrValQuery);
    this._debug('rgRepeat', `found elements:: ${elems.length} | attrValQuery:: ${attrValQuery}`, 'navy');
    if (!elems.length) { return; }


    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName);

      const prop = attrVal.trim();
      const val = +this._getControllerValue(prop);
      this._debug('rgRepeat', `Element will be repeated ${val} times.`, 'navy');

      // remove all gen elems
      this._genElem_remove(elem, attrName, attrVal);

      // generate new element and place it in the sibling position
      const newElem = this._genElem_create(elem, attrName, attrVal);

      // multiply element by cloning and adding sibling elements
      const newElemsTotal = +val;
      for (let i = 1; i <= newElemsTotal; i++) {
        const i2 = newElemsTotal - i; // 3,2,1,0
        elem.parentNode.insertBefore(newElem, elem.nextSibling);
        let outerHTML = this._solve_$i(i2, newElem.outerHTML); // replace $i, $i1, $i12 with the number
        outerHTML = this._solveInterpolated(outerHTML); // parse interpolated text in the variable name, for example: pet_{{$model.pets.$i0._id}}
        outerHTML = this._solveMath(outerHTML);
        newElem.outerHTML = outerHTML;
      }

    }

    this._debug('rgRepeat', '--------- rgRepeat (end) ------', 'navy', '#B6ECFF');
  }


  /**
   * data-rg-print="<controllerProperty> [@@ inner|outer|sibling|prepend|append]"
   * data-rg-print="company.name @@ inner"
   * data-rg-print="company.name @@ inner @@ keep"   - keep the innerHTML when value is undefined
   * Parse the "data-rg-print" attribute. Print the controller's property to view.
   * Examples:
   * data-rg-print="product" - product is the controller property
   * data-rg-print="product.name @@ outer"
   * data-rg-print="product.name @@ sibling"
   * @param {string|RegExp} attrValQuery - controller property name, query for the attribute value
   * for example product.name in the data-rg-print="product.name @@ inner". This speed up parsing because it's limited only to one element.
   * @returns {void}
   */
  rgPrint(attrValQuery) {
    this._debug('rgPrint', `--------- rgPrint (start) ------`, 'navy', '#B6ECFF');

    const attrName = 'data-rg-print';
    const elems = this._listElements(attrName, attrValQuery);
    this._debug('rgPrint', `found elements:: ${elems.length} | attrValQuery:: ${attrValQuery}`, 'navy');
    if (!elems.length) { return; }


    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName);
      const attrValSplited = attrVal.split(this.$rg.separator);

      // get val and apply pipe to the val
      const propPipe = attrValSplited[0].trim(); // controller property name with pipe:  company.name | slice(0,21)
      const propPipeSplitted = propPipe.split('|');
      const prop = propPipeSplitted[0].trim(); // company.name
      let val = this._getControllerValue(prop);

      // correct val
      const toKeep = !!attrValSplited[2] ? attrValSplited[2].trim() === 'keep' : false; // to keep the innerHTML as value when val is undefined
      if (val === undefined) { val = toKeep ? elem.innerHTML : ''; } // the default value is defined in the HTML tag
      else if (typeof val === 'object') { val = JSON.stringify(val); }
      else if (typeof val === 'number') { val = +val; }
      else if (typeof val === 'string') { val = val; }
      else if (typeof val === 'boolean') { val = val.toString(); }
      else { val = val; }

      // apply pipe, for example: data-rg-print="val | slice(0,130)"
      let pipe_funcDef = propPipeSplitted[1]; // slice(0, 130), json, ...
      if (!!pipe_funcDef && !!val) {
        pipe_funcDef = pipe_funcDef.trim();
        const { funcName, funcArgs } = this._funcParse(pipe_funcDef, elem);
        if (typeof val[funcName] === 'function') { val = val[funcName](...funcArgs); }
      }

      // define action
      let act = attrValSplited[1] || 'inner';
      act = act.trim();

      // remove all gen elems
      this._genElem_remove(elem, attrName, attrVal);

      // generate new element and place it in the sibling position
      let newElem;
      if (act !== 'inner') { newElem = this._genElem_create(elem, attrName, attrVal); }


      // load content in the element
      if (act === 'inner') {
        elem.innerHTML = val;
      } else if (act === 'outer') {
        const id2 = newElem.getAttribute('data-rg-print-id');
        newElem.outerHTML = `<span data-rg-print-gen="${attrVal}" data-rg-print-id="${id2}">${val}</span>`;
      } else if (act === 'sibling') {
        elem.style.display = '';
        const id2 = newElem.getAttribute('data-rg-print-id');
        newElem.outerHTML = `<span data-rg-print-gen="${attrVal}" data-rg-print-id="${id2}">${val}</span>`;
      } else if (act === 'prepend') {
        newElem.innerHTML = val + ' ' + elem.innerHTML;
      } else if (act === 'append') {
        newElem.innerHTML = elem.innerHTML + ' ' + val;
      } else if (act === 'inset') {
        newElem.innerHTML = elem.innerHTML.replace('{{}}', val);
      } else {
        elem.innerHTML = val;
      }

      this._debug('rgPrint', `rgPrint:: ${propPipe} = ${val} -- act::"${act}" -- toKeep::${toKeep}`, 'navy');
    }

    this._debug('rgPrint', '--------- rgPrint (end) ------', 'navy', '#B6ECFF');
  }




  /************ NON-GENERATORS (will not generate new HTML elements or remove existing - will not change the DOM structure) ***********/
  /**
   * data-rg-if="<controllerProperty>"
   * Parse the "data-rg-if" attribute. Show or hide the HTML element by setting display:none.
   * Examples:
   * data-rg-if="this.ifAge" - rend() will not be triggered when this.ifAge is changed
   * data-rg-if="$model.ifAge $eq(22)" - rend() will be triggered when $model.ifAge is changed
   * @param {string|RegExp} attrValQuery - controller property name, query for the attribute value
   * @returns {void}
   */
  rgIf(attrValQuery) {
    this._debug('rgIf', '--------- rgIf (start) ------', 'navy', '#B6ECFF');

    const attrName = 'data-rg-if';
    const elems = this._listElements(attrName, attrValQuery);
    this._debug('rgIf', `found elements:: ${elems.length} | attrValQuery:: ${attrValQuery}`, 'navy');

    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName).trim(); // age_tf , $model.age === 3, age > this.myAge , age < $model.yourAge , age $lt($model.age)
      if (!attrVal) { console.error(`Attribute "data-rg-if" has bad definition (data-rg-if="${attrVal}").`); continue; }

      /* define tf */
      let tf = false;
      if (/\!|<|>|=/.test(attrVal)) {
        // parse data-rg-if with = < > && ||: data-rg-if="5<2", data-rg-if="$model.age >= $model.myAge", data-rg-if="this.age > 3" (this. will not be rendered)
        tf = this._calcComparison_A(attrVal);
      } else {
        // parse data-rg-if with pure controller value: data-rg-if="is_active"
        // parse data-rg-if with the comparison operators: $not(), $eq(22), $ne(22), ...  --> data-rg-if="age $eq(5)" , data-rg-if="$model.age $eq($model.myAge)", data-rg-if="$model.age $gt(this.myNum)"
        tf = this._calcComparison_B(attrVal);
      }

      /* hide/show elem */
      if (tf) {
        const dataRgPrint_attrVal = elem.getAttribute('data-rg-print');
        if (!!dataRgPrint_attrVal && /outer|sibling|prepend|append|inset/.test(dataRgPrint_attrVal)) { elem.style.display = 'none'; } // element with data-rg-print should stay hidden because of _genElem_create()
        else { elem.style.display = ''; }
      } else {
        elem.style.display = 'none';
      }

      this._debug('rgIf', `rgIf:: <${elem.tagName} data-rg-if="${attrVal}"> => tf: ${tf} -- outerHTML: ${elem.outerHTML}`, 'navy');
    }

    this._debug('rgIf', '--------- rgIf (end) ------', 'navy', '#B6ECFF');
  }



  /**
   * data-rg-spinner="<controllerProperty>"
   * Parse the "data-rg-spinner" attribute. Load the spinner inside data-rg-spinner element when expression with $model is true.
   * This method acts like rgIf.
   * @param {string} bool - to show or hide the element
   * @returns {void}
   */
  rgSpinner(attrValQuery) {
    this._debug('rgSpinner', '--------- rgSpinner (start) ------', 'navy', '#B6ECFF');

    const attrName = 'data-rg-spinner';
    const elems = this._listElements(attrName, attrValQuery);
    this._debug('rgSpinner', `found elements:: ${elems.length} | attrValQuery:: ${attrValQuery}`, 'navy');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName).trim(); // ifAge
      if (!attrVal) { console.error(`Attribute "data-rg-spinner" has bad definition (data-rg-spinner="${attrVal}").`); continue; }

      /* define tf */
      let tf = false;
      if (/\!|<|>|=/.test(attrVal)) {
        // parse data-rg-if with = < > && ||: data-rg-if="5<2", data-rg-if="$model.age >= $model.myAge", data-rg-if="this.age > 3" (this. will not be rendered)
        tf = this._calcComparison_A(attrVal);
      } else {
        // parse data-rg-if with pure controller value: data-rg-if="is_active"
        // parse data-rg-if with the comparison operators: $not(), $eq(22), $ne(22), ...  --> data-rg-if="age $eq(5)" , data-rg-if="$model.age $eq($model.myAge)", data-rg-if="$model.age $gt(this.myNum)"
        tf = this._calcComparison_B(attrVal);
      }

      /* hide/show spinner */
      if (tf) {
        const styleScoped = `
        <span data-rg-spinner-gen>
          <style scoped>
            [data-rg-spinner]>span:after {
              content: '';
              display: block;
              font-size: 10px;
              width: 1em;
              height: 1em;
              margin-top: -0.5em;
              animation: spinner 1500ms infinite linear;
              border-radius: 0.5em;
              box-shadow: #BEBEBE 1.5em 0 0 0, #BEBEBE 1.1em 1.1em 0 0, #BEBEBE 0 1.5em 0 0, #BEBEBE -1.1em 1.1em 0 0, #BEBEBE -1.5em 0 0 0, #BEBEBE -1.1em -1.1em 0 0, #BEBEBE 0 -1.5em 0 0, #BEBEBE 1.1em -1.1em 0 0;
            }
            @-webkit-keyframes spinner {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg); }
            }
            @-moz-keyframes spinner {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @-o-keyframes spinner {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes spinner {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </span>
        `;

        // 1. add SPAN and STYLE tags
        elem.insertAdjacentHTML('beforeend', styleScoped);

        // 2. center span spinner in the parent element
        const elemRect = elem.getBoundingClientRect(); // {x,y,width,height}}
        const spinnerElem = elem.querySelector('span[data-rg-spinner-gen]');

        spinnerElem.style.position = 'relative';

        const x = elemRect.width / 2;
        spinnerElem.style.left = x + 'px';

        const y = elemRect.height / 2;
        spinnerElem.style.top = y + 'px';

        this._debug('rgSpinner', `spinner position:: x=${x}px , y=${y}px`, 'navy');

      } else {
        elem.innerHTML = '';
      }

      this._debug('rgSpinner', `rgSpinner:: <${elem.tagName} data-rg-spinner="${attrVal}"> => tf: ${tf}`, 'navy');
    }

    this._debug('rgSpinner', '--------- rgSpinner (end) ------', 'navy', '#B6ECFF');
  }



  /**
   * data-rg-switch="<controllerProperty> [@@ multiple]"
   * Parse the "data-rg-switch" attribute. Show or hide elements depending if "data-rg-switchcase" value matches controller property.
   * Examples:
   * data-rg-switch="ctrlprop" - ctrlprop is string, number or boolean
   * data-rg-switch="ctrlprop @@ multiple" - ctrlprop is array of string, number or boolean
   * Notice @@ multiple can select multiple switchcases.
   * @param {string|RegExp} attrValQuery - controller property name, query for the attribute value
   * @returns {void}
   */
  rgSwitch(attrValQuery) {
    this._debug('rgSwitch', '--------- rgSwitch (start) ------', 'navy', '#B6ECFF');

    const attrName = 'data-rg-switch';
    const elems = this._listElements(attrName, attrValQuery);
    this._debug('rgSwitch', `found elements:: ${elems.length} | attrValQuery:: ${attrValQuery}`, 'navy');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName) || ''; // 'controllerProperty @@ multiple'
      const attrValSplited = attrVal.split(this.$rg.separator);

      const isMultiple = !!attrValSplited[1] ? attrValSplited[1].trim() === 'multiple' : false;

      const prop = attrValSplited[0].trim();
      const val = this._getControllerValue(prop);

      // get data-rg-switchcase and data-rg-switchdefault attribute values
      const switchcaseElems = elem.querySelectorAll('[data-rg-switch] > [data-rg-switchcase]');
      const switchdefaultElem = elem.querySelector('[data-rg-switch] > [data-rg-switchdefault]');

      // set data-rg-switchcase
      let isMatched = false; // is data-rg-switchcase value matched
      for (const switchcaseElem of switchcaseElems) {
        let switchcaseAttrVal = switchcaseElem.getAttribute('data-rg-switchcase');
        switchcaseAttrVal = switchcaseAttrVal.trim();

        if (!isMultiple && switchcaseAttrVal === val) { switchcaseElem.style.display = ''; isMatched = true; }
        else if (isMultiple && val && val.indexOf(switchcaseAttrVal) !== -1) { switchcaseElem.style.display = ''; isMatched = true; }
        else { switchcaseElem.style.display = 'none'; }

        this._debug('rgSwitch', `data-rg-switch="${attrVal}" data-rg-switchcase="${switchcaseAttrVal}" --val:: "${val}" --isMatched: ${isMatched}`, 'navy');
      }

      // set data-rg-switchdefault
      if (!!switchdefaultElem) { !isMatched ? switchdefaultElem.style.display = '' : switchdefaultElem.style.display = 'none'; }

      this._debug('rgSwitch', `data-rg-switch="${attrVal}" data-rg-switchdefault --isMatched: ${isMatched}`, 'navy');
    }

    this._debug('rgSwitch', '--------- rgSwitch (end) ------', 'navy', '#B6ECFF');
  }



  /**
   * data-rg-disabled="<controllerProperty>"
   * Parse the "data-rg-disabled" attribute. set the element to disabled state.
   * Examples:
   * data-rg-disabled="ifAge"
   * data-rg-disabled="ifAge $eq(22)"
   * @param {string|RegExp} attrValQuery - controller property name, query for the attribute value
   * @returns {void}
   */
  rgDisabled(attrValQuery) {
    this._debug('rgDisabled', '--------- rgDisabled (start) ------', 'navy', '#B6ECFF');

    const attrName = 'data-rg-disabled';
    const elems = this._listElements(attrName, attrValQuery);
    this._debug('rgDisabled', `found elements:: ${elems.length} | attrValQuery:: ${attrValQuery}`, 'navy');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName).trim(); // ifAge
      if (!attrVal) { console.error(`rgDisabled Error:: Attribute has bad definition (data-rg-disabled="${attrVal}").`); continue; }

      /* define tf */
      let tf = false;
      if (/\!|<|>|=/.test(attrVal)) {
        // parse data-rg-if with = < > && ||: data-rg-if="5<2", data-rg-if="$model.age >= $model.myAge", data-rg-if="this.age > 3" (this. will not be rendered)
        tf = this._calcComparison_A(attrVal);
      } else {
        // parse data-rg-if with pure controller value: data-rg-if="is_active"
        // parse data-rg-if with the comparison operators: $not(), $eq(22), $ne(22), ...  --> data-rg-if="age $eq(5)" , data-rg-if="$model.age $eq($model.myAge)", data-rg-if="$model.age $gt(this.myNum)"
        tf = this._calcComparison_B(attrVal);
      }

      /* disable/enable the element */
      if (tf) { elem.disabled = true; }
      else { elem.disabled = false; }

      this._debug('rgDisabled', `rgDisabled:: data-rg-disabled="${attrVal}" -- outerHTML: ${elem.outerHTML}`, 'navy');
    }

    this._debug('rgDisabled', '--------- rgDisabled (end) ------', 'navy', '#B6ECFF');
  }



  /**
   * data-rg-value="<controllerProperty>"
   * Parse the "data-rg-value" attribute. Sets the element's "value" attribute from the controller property value.
   * Examples:
   * data-rg-value="product"
   * data-rg-value="$model.employee.name"
   * @param {string|RegExp} attrValQuery - controller property name, query for the attribute value
   * @returns {void}
   */
  rgValue(attrValQuery) {
    this._debug('rgValue', '--------- rgValue ------', 'navy', '#B6ECFF');

    const attrName = 'data-rg-value';
    const elems = this._listElements(attrName, attrValQuery);
    this._debug('rgValue', `found elements:: ${elems.length} | attrValQuery:: ${attrValQuery}`, 'navy');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName);
      if (!attrVal) { console.error(`rgValue Error:: Attribute has bad definition (data-rg-value="${attrVal}").`); continue; }

      const prop = attrVal.trim();
      const val = this._getControllerValue(prop);

      this._setElementValue(elem, val);

      this._debug('rgValue', `elem.type:: ${elem.type} -- ${prop}:: ${val}`, 'navy');
    }
  }



  /**
   * data-rg-checked="<controllerProperty>"
   * Sets the "checked" attribute with the controller property value.
   * The controller property is an array. If the checkbox value is in that array then the checkbox is checked.
   * Use it for checkboxes only.
   * Examples:
   * data-rg-checked="selectedProducts"
   * @param {string|RegExp} attrValQuery - controller property name, query for the attribute value
   * @returns {void}
   */
  rgChecked(attrValQuery) {
    this._debug('rgChecked', '--------- rgChecked ------', 'navy', '#B6ECFF');

    const attrName = 'data-rg-checked';
    const elems = this._listElements(attrName, attrValQuery);
    this._debug('rgChecked', `found elements:: ${elems.length} | attrValQuery:: ${attrValQuery}`, 'navy');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName);
      if (!attrVal) { console.error(`rgChecked Error:: Attribute has bad definition (data-rg-checked="${attrVal}").`); continue; }

      const prop = attrVal.trim();
      const val = this._getControllerValue(prop); // val must be array
      if (!Array.isArray(val)) { console.error(`rgChecked Error:: The controller property ${prop} is not array.`); continue; }

      if (val.indexOf(elem.value) !== -1) { elem.checked = true; }
      else { elem.checked = false; }

      this._debug('rgChecked', `elem.type:: ${elem.type} -- ${prop}:: ${val}`, 'navy');
    }
  }



  /**
   * data-rg-class="<controllerProperty> [@@ add|replace]"
   * Parse the "data-rg-class" attribute. Set element class attribute.
   * Examples:
   * data-rg-class="myKlass" - add new classes to existing classes
   * data-rg-class="myKlass @@ add" - add new classes to existing classes
   * data-rg-class="myKlass @@ replace" - replace existing classes with new classes
   * @param {string|RegExp} attrValQuery - controller property name, query for the attribute value
   * @returns {void}
   */
  rgClass(attrValQuery) {
    this._debug('rgClass', '--------- rgClass ------', 'navy', '#B6ECFF');

    const attrName = 'data-rg-class';
    const elems = this._listElements(attrName, attrValQuery);
    this._debug('rgClass', `found elements:: ${elems.length} | attrValQuery:: ${attrValQuery}`, 'navy');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName) || ''; // 'controllerProperty'
      const attrValSplited = attrVal.split(this.$rg.separator);

      const prop = attrValSplited[0].trim(); // controller property name company.name
      const valArr = this._getControllerValue(prop) || []; // ['my-bold', 'my-italic']
      if (!Array.isArray(valArr)) { console.log(`%c rgClassWarn:: The controller property "${prop}" is not an array.`, `color:Maroon; background:LightYellow`); continue; }

      let act = attrValSplited[1] || '';
      act = act.trim() || 'add';

      if (act == 'replace' && !!valArr.length) { elem.removeAttribute('class'); }
      for (const val of valArr) { elem.classList.add(val); }

      this._debug('rgClass', `data-rg-class="${attrVal}" --- ctrlProp:: ${prop} | ctrlVal:: ${valArr} | act:: ${act}`, 'navy');
    }
  }



  /**
   * data-rg-style="<controllerProperty> [@@ add|replace]"
   * Parse the "data-rg-style" attribute. Set element style attribute.
   * Examples:
   * data-rg-style="myStyl" - add new styles to existing sytles
   * data-rg-style="myStyl @@ add" - add new styles to existing sytles
   * data-rg-style="myStyl @@ replace" - replace existing styles with new styles
   * @param {string|RegExp} attrValQuery - controller property name, query for the attribute value
   * @returns {void}
   */
  rgStyle(attrValQuery) {
    this._debug('rgStyle', '--------- rgStyle ------', 'navy', '#B6ECFF');

    const attrName = 'data-rg-style';
    const elems = this._listElements(attrName, attrValQuery);
    this._debug('rgStyle', `found elements:: ${elems.length} | attrValQuery:: ${attrValQuery}`, 'navy');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName) || ''; // 'controllerProperty'
      const attrValSplited = attrVal.split(this.$rg.separator);

      const prop = attrValSplited[0].trim();
      const valObj = this._getControllerValue(prop); // {fontSize: '21px', color: 'red'}

      let act = attrValSplited[1] || '';
      act = act.trim() || 'add';

      if (act == 'replace') { elem.removeAttribute('style'); }

      let styleProps = [];
      if (!!valObj) {
        styleProps = Object.keys(valObj);
        for (const styleProp of styleProps) { elem.style[styleProp] = valObj[styleProp]; }
      }

      this._debug('rgStyle', `data-rg-style="${attrVal}" --- prop:: "${prop}" | styleProps:: "${styleProps}" | act:: "${act}"`, 'navy');
    }
  }



  /**
   * data-rg-src"<controllerProperty> [@@<defaultSrc>]"
   * Parse the "data-rg-src" attribute. Set element src attribute.
   * Examples:
   * data-rg-src="imageURL" - define <img src="">
   * @param {string|RegExp} attrValQuery - controller property name, query for the attribute value
   * @returns {void}
   */
  rgSrc(attrValQuery) {
    this._debug('rgSrc', '--------- rgSrc ------', 'navy', '#B6ECFF');

    const attrName = 'data-rg-src';
    const elems = this._listElements(attrName, attrValQuery);
    this._debug('rgSrc', `found elements:: ${elems.length} | attrValQuery:: ${attrValQuery}`, 'navy');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName) || '';
      const attrValSplited = attrVal.split(this.$rg.separator);

      const prop = attrValSplited[0].trim();
      const val = this._getControllerValue(prop);

      // when val is undefined load defaultSrc
      let defaultSrc = attrValSplited[1] || '';
      defaultSrc = defaultSrc.trim();

      const src = val || defaultSrc;
      elem.src = src;

      this._debug('rgSrc', `data-rg-src="${attrVal}" --prop:: "${prop}" --src:: "${src}"`, 'navy');
    }
  }



  /**
  * data-rg-attr"<controllerProperty> [@@<attributeName>]"
  * Parse the "data-rg-attr" attribute. Set element's attribute value.
  * Examples:
  * data-rg-attr="pageURL @@ href" - define <a href="">
  * @param {string|RegExp} attrValQuery - controller property name, query for the attribute value
  * @returns {void}
  */
  rgAttr(attrValQuery) {
    this._debug('rgAttr', '--------- rgAttr ------', 'navy', '#B6ECFF');

    const attrName = 'data-rg-attr';
    const elems = this._listElements(attrName, attrValQuery);
    this._debug('rgAttr', `found elements:: ${elems.length} | attrValQuery:: ${attrValQuery}`, 'navy');
    if (!elems.length) { return; }

    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName) || ''; // pageURL @@ href
      const attrValSplited = attrVal.split(this.$rg.separator);

      const prop = attrValSplited[0].trim();
      const val = this._getControllerValue(prop);

      if (!attrValSplited[1]) { console.error(`Attribute name is not defined in the ${attrName}="${attrVal}".`); continue; }
      const attribute_name = attrValSplited[1].trim(); // href

      elem.setAttribute(attribute_name, val);

      this._debug('rgAttr', `data-rg-attr="${attrVal}" --prop:: "${prop}" --val:: "${val}" --> added ${attribute_name}="${val}"`, 'navy');
    }
  }



  /**
   * data-rg-elem="<rgelemsProp>"     --> rgelemsProp is the property of the this.$rg.elems, for example data-rg-elem="myElement" => this.$rg.elems.myElement
   * Parse the "data-rg-elem" attribute. Transfer the DOM element to the controller property "this.$rg.elems".
   * Examples:
   * data-rg-elem="paragraf" -> fetch it with this.$rg.elems['paragraf']
   * @param {string|RegExp} attrValQuery - query for the attribute value
   * @returns {void}
   */
  rgElem(attrValQuery) {
    this._debug('rgElem', '--------- rgElem ------', 'navy', '#B6ECFF');

    const attrName = 'data-rg-elem';
    const elems = this._listElements(attrName, attrValQuery);
    this._debug('rgElem', `found elements:: ${elems.length} | attrValQuery:: ${attrValQuery}`, 'navy');
    if (!elems.length) { return; }

    // associate values
    for (const elem of elems) {
      const attrVal = elem.getAttribute(attrName) || ''; // 'paragraf'
      this.$rg.elems[attrVal] = elem;
    }
  }



  /**
   * data-rg-echo="<text>"
   * Parse the "data-rg-echo" attribute. Prints the "text" in the HTML element as innerHTML.
   * Examples:
   * data-rg-echo="$i+1"  --> prints the iteration number
   * @returns {void}
   */
  rgEcho() {
    this._debug('rgEcho', '--------- rgEcho (start) ------', 'navy', '#B6ECFF');

    const attrName = 'data-rg-echo';
    const elems = this._listElements(attrName, '');
    this._debug('rgEcho', `found elements:: ${elems.length}`, 'navy');
    if (!elems.length) { return; }

    // associate values
    for (const elem of elems) {
      let txt = elem.getAttribute('data-rg-echo');

      this._debug('rgEcho', `rgEcho txt before: ${txt}`, 'navy', '#B6ECFF');

      txt = this._solveInterpolated(txt); // parse interpolated text in the variable name, for example: pet_{{$model.pets.$i0._id}}
      txt = this._solveMath(txt); // calculte for example solveMath/$i0 + 1/
      txt = txt.replace(/\[/g, '<').replace(/\]/g, '>'); // solve html tags, [b style='color:red']3[/b]

      this._debug('rgEcho', `rgEcho txt after: ${txt}\n`, 'navy', '#B6ECFF');

      elem.innerHTML = txt;
    }

    this._debug('rgEcho', '--------- rgEcho (end) ------', 'navy', '#B6ECFF');
  }



  /**
   * Parse the words with i18n> prefix and replace it with the corersponding word in /i18n/{lang}.json
   */
  rgI18n() {

  }



}


/* harmony default export */ const mvc_DataRg = (DataRg);


/***/ }),

/***/ 961:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DataRg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(242);



class View extends _DataRg_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z {

  constructor() {
    super();
    // window.regochWeber.viewsCached is defined by the App:controllerViewsCached()
  }



  /************** INCLUDES ****************/
  /**
   * Include HTML components with the data-rg-inc attribute.
   * Process:
   * 1) Select all elements which has data-rg-inc but not data-rg-cin.
   * 2) Put data-rg-cin which marks that the data-rg-inc element has beed parsed.
   * 3) Load the content in the data-rg-inc element as inner, outer, sibling, append or prepend. Every loaded element will have data-rg-incgen attribute to mark elements generated with data-rg.inc.
   * 4) Add data-rg-cin attribute to the element with the data-rg-inc to mark that the content is loaded and prevent load in the next iteration.
   * ) Multiple iterations will haeppen when data-rg-inc elements are nested. In case of multiple iterations only in the first iteration will be deleted all data-rg-incgen elements to make reset.
   * Examples:
   * <header data-rg-inc="/html/header.html">---header---</header>
   * <header data-rg-inc="/html/header.html @@  @@ h2 > small">---header---</header>
   * <header data-rg-inc="/html/header.html @@ inner">---header---</header>
   * <header data-rg-inc="/html/header.html @@ prepend">---header---</header>
   * <header data-rg-inc="/html/header.html @@ append">---header---</header>
   * <header data-rg-inc="/html/header.html @@ outer @@ h2 > small">---header---</header>
   * <header data-rg-inc="/html/header.html @@ outer @@ b:nth-child(2)"></header>
   * @param {boolean} delIncgens - delete data-rg-incgen elements (only in the first iteration)
   * @returns {void}
   */
  async rgInc(delIncgens = true) {
    const elems = document.querySelectorAll('[data-rg-inc]:not([data-rg-cin])');
    this._debug('rgInc', '--------- rgInc ------', '#8B0892', '#EDA1F1');
    this._debug('rgInc', `elems found: ${elems.length}`, '#8B0892');
    if (!elems.length) { return; }

    // remove all data-rg-incgen elements (just first iteration)
    if (delIncgens) {
      const elems2 = document.querySelectorAll('[data-rg-incgen]');
      this._debug('rgInc', `data-rg-incgen elems deleted: ${elems2.length}`, '#8B0892');
      for (const elem2 of elems2) { elem2.remove(); }
    }

    for (const elem of elems) {
      // extract attribute data
      const attrValue = elem.getAttribute('data-rg-inc');
      const path_dest_cssSel = attrValue.replace(/\s+/g, '').replace(/^\//, '').split(this.$rg.separator); // remove empty spaces and leading /
      const viewPath = !!path_dest_cssSel && !!path_dest_cssSel.length ? 'inc/' + path_dest_cssSel[0] : '';
      const dest = !!path_dest_cssSel && path_dest_cssSel.length >= 2 ? path_dest_cssSel[1] : 'inner';
      const cssSel = !!path_dest_cssSel && path_dest_cssSel.length === 3 ? path_dest_cssSel[2] : '';
      if (this._debug().rgInc) { console.log('\n******** path_dest_cssSel:: ', viewPath, dest, cssSel, '********'); }
      if (!viewPath) { console.error('viewPath is not defined'); return; }

      // Get HTML content. First try from the cached JSON and if it doesn't exist then request from the server.
      let nodes, str;
      if (!!window && !!window.regochWeber && !!window.regochWeber.viewsCached && !!window.regochWeber.viewsCached[viewPath]) { // HTML content from the cached file /cache/views.json
        const cnt = this.fetchCachedView(viewPath, cssSel);
        nodes = cnt.nodes;
        str = cnt.str;
        this._debug('rgInc', '--from cached JSON', '#8B0892');
      } else { // HTML content by requesting the server
        const cnt = await this.fetchRemoteView(viewPath, cssSel);
        nodes = cnt.nodes;
        str = cnt.str;
        this._debug('rgInc', '--from server', '#8B0892');
      }

      if (this._debug().rgInc) {
        console.log('elem::', elem);
        console.log('nodes loaded::', nodes);
        // console.log('str loaded::', str);
      }


      // load content in the element
      if (dest === 'inner') {
        elem.innerHTML = str;

      } else if (dest === 'outer') {
        elem.outerHTML = str;

      } else if (dest === 'sibling') {
        const parent = elem.parentNode;
        const sibling = elem.nextSibling;
        for (const node of nodes) {
          if (!node) { return; }
          const nodeCloned = node.cloneNode(true); // clone the node because inserBefore will delete it
          if (nodeCloned.nodeType === 1) {
            nodeCloned.setAttribute('data-rg-incgen', ''); // add attribute data-rg-incgen to mark generated nodes
            if (!elem.hasAttribute('data-rg-cin')) { parent.insertBefore(nodeCloned, sibling); }
          }
        }

      } else if (dest === 'prepend') {
        const i = nodes.length;
        for (let i = nodes.length - 1; i >= 0; i--) {
          if (!!nodes.length && !nodes[i]) { return; }
          const nodeCloned = nodes[i].cloneNode(true);
          if (nodeCloned.nodeType === 1) {
            nodeCloned.setAttribute('data-rg-incgen', '');
            if (!elem.hasAttribute('data-rg-cin')) { elem.prepend(nodeCloned); }
          }
        }

      } else if (dest === 'append') {
        for (const node of nodes) {
          if (!node) { return; }
          const nodeCloned = node.cloneNode(true);
          if (nodeCloned.nodeType === 1) {
            nodeCloned.setAttribute('data-rg-incgen', '');
            if (!elem.hasAttribute('data-rg-cin')) { elem.append(nodeCloned); }
          }
        }

      }


      // set "data-rg-cin" attribute which marks that the content is included in the data-rg-inc element and parse process is finished
      elem.setAttribute('data-rg-cin', '');

      // continue with the next parse iteration (when data-rg-inc elements are nested)
      if (/data-rg-inc/.test(str)) { await this.rgInc(false); }

    }

  }


  /************** VIEWS ****************/
  /**
   * Parse elements with the data-rg-view attribute and load router views.
   * This method should be used in the controller.
   * When 'sibling', 'prepend' and 'append' is used comment and text nodes will not be injected (only HTML elements (nodeType === 1)).
   * Example: <main data-rg-view="#main"></main> and in the controller await this.loadView('#sibling', 'pages/home/sibling.html', 'sibling');
   * @param {string} viewName - view name, for example: '#home'
   * @param {string} viewPath - view file path (relative to /view/ directory): 'pages/home/main.html'
   * @param {string} dest - destination where to place the view: inner, outer, sibling, prepend, append
   * @param {string} cssSel - CSS selector to load part of the view file: 'div > p.bolded:nth-child(2)'
   * @returns {elem:Element, str:string, nodes:Node[]}
   */
  async loadView(viewName, viewPath, dest = 'inner', cssSel) {
    const attrSel = `[data-rg-view="${viewName}"]`;

    // get a HTML element with data-rg-view attribute
    const elem = document.querySelector(attrSel);
    this._debug('loadView', `--------- loadView ${attrSel} -- ${viewPath} ---------`, '#8B0892', '#EDA1F1');
    if (this._debug().loadView) { console.log('elem::', elem); }
    if (!elem) { throw new Error(`Element ${attrSel} not found.`); }
    if (!viewPath) { throw new Error(`View path is not defined.`); }

    // Get HTML content. First try from the cached JSON and if it doesn't exist then request from the server.
    let nodes, str;
    if (!!window && !!window.regochWeber && !!window.regochWeber.viewsCached && !!window.regochWeber.viewsCached[viewPath]) { // HTML content from the cached file /cache/views.json
      const cnt = this.fetchCachedView(viewPath, cssSel);
      nodes = cnt.nodes;
      str = cnt.str;
      this._debug('loadView', '--from cached JSON', '#8B0892');
    } else { // HTML content by requesting the server
      const cnt = await this.fetchRemoteView(viewPath, cssSel);
      nodes = cnt.nodes;
      str = cnt.str;
      this._debug('loadView', '--from server', '#8B0892');
    }

    if (this._debug().loadView) {
      console.log('nodes loaded::', nodes);
      // console.log('str loaded::', str);
    }


    // empty content from the element by removing the data-rg-viewgen elements
    this.emptyView(viewName, dest);


    // load content in the element
    if (dest === 'inner') {
      elem.innerHTML = str;

    } else if (dest === 'outer') {
      elem.outerHTML = str;

    } else if (dest === 'sibling') {
      const parent = elem.parentNode;
      const sibling = elem.nextSibling;
      for (const node of nodes) {
        const nodeCloned = node.cloneNode(true); // clone the node because insertBefore will delete it
        if (nodeCloned.nodeType === 1) {
          nodeCloned.setAttribute('data-rg-viewgen', viewName); // mark generated nodes
          parent.insertBefore(nodeCloned, sibling);
        }
      }

    } else if (dest === 'prepend') {
      const i = nodes.length;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const nodeCloned = nodes[i].cloneNode(true);
        if (nodeCloned.nodeType === 1) {
          nodeCloned.setAttribute('data-rg-viewgen', viewName);
          elem.prepend(nodeCloned);
        }
      }

    } else if (dest === 'append') {
      for (const node of nodes) {
        const nodeCloned = node.cloneNode(true);
        if (nodeCloned.nodeType === 1) {
          nodeCloned.setAttribute('data-rg-viewgen', viewName);
          elem.append(nodeCloned);
        }
      }

    }

    return { elem, str, nodes };
  }



  /**
   * Load multiple views.
   * TIP: When using isAsync=false cache views in the regoch.json.
   * @param {any[][]} viewDefs - array of arrays: [[viewName, viewPath, dest, cssSel]]
   * @param {boolean} isAsync - to load asynchronously one by one (default: true)
   * @returns {void}
   */
  async loadViews(viewDefs, isAsync = true) {
    for (const viewDef of viewDefs) {
      const viewName = viewDef[0];
      const viewPath = viewDef[1];
      const dest = viewDef[2];
      const cssSel = viewDef[3];
      !!isAsync ? await this.loadView(viewName, viewPath, dest, cssSel) : this.loadView(viewName, viewPath, dest, cssSel);
    }
  }



  /**
   * Empty a
   * @param {string} viewName - view name
   * @param {string} dest - destination where the view was placed: inner, outer, sibling, prepend, append
   * @returns {void}
   */
  emptyView(viewName, dest = 'inner') {
    const attrSel = `[data-rg-view="${viewName}"]`;
    const elem = document.querySelector(attrSel);
    this._debug('emptyView', `--------- emptyView ${attrSel} | ${dest} ---------`, '#8B0892', '#EDA1F1');
    if (this._debug().emptyView) { console.log('elem::', elem); }
    if (!elem) { return; }

    // empty the interpolated content
    if (dest === 'inner') {
      elem.innerHTML = '';
    } else if (dest === 'outer') {
      elem.outerHTML = '';
    } else if (dest === 'sibling') {
      for (const genElem of document.querySelectorAll(`[data-rg-viewgen="${viewName}"`)) { genElem.remove(); }
    } else if (dest === 'prepend') {
      for (const genElem of document.querySelectorAll(`[data-rg-viewgen="${viewName}"`)) { genElem.remove(); }
    } else if (dest === 'append') {
      for (const genElem of document.querySelectorAll(`[data-rg-viewgen="${viewName}"`)) { genElem.remove(); }
    }

  }


  /**
   * To show body content or not. This method is used to prevent flicker effects.
   * The HTML content in body tag shouldn't be visible until all data is not fetched in init() and all data-rg- elements are not rendered in rend().
   * Use this method in the controller's loader(), init(), postrend() --> this.showViews(true|false);
   * Also it can be used in the app.preflight() and app.postflight() to affect all controllers.
   * @param {boolean} bool - true or false
   * @param {boolean} spinner - true or false, to show the spinner during transition time
   */
  showViews(bool, spinner) {
    /*** without spinner - whole body will be hidden ***/
    if (!spinner) {
      if (bool) { document.body.style.visibility = 'visible'; }
      else { document.body.style.visibility = 'hidden'; }
      return;
    }


    /*** with spinner - only body child tags will be hidden***/
    // hide/show all body child tag nodes
    for (const childNode of document.body.childNodes) {
      if (childNode.nodeType === 1) {
        if (bool) { childNode.style.visibility = 'visible'; }
        else { childNode.style.visibility = 'hidden'; }
      }
    }

    // hide/show loading spinner
    const divElem = document.createElement('div');
    divElem.setAttribute('data-rg-spinner-showviews', '');
    const styleScoped = `
        <span>
          <style scoped>
            [data-rg-spinner-showviews]>span:after {
              content: '';
              display: block;
              font-size: 13px;
              width: 1em;
              height: 1em;
              margin-top: 55px;
              margin-left: auto;
              margin-right: auto;
              animation: spinner 1500ms infinite linear;
              border-radius: 0.5em;
              box-shadow: #BEBEBE 1.5em 0 0 0, #BEBEBE 1.1em 1.1em 0 0, #BEBEBE 0 1.5em 0 0, #BEBEBE -1.1em 1.1em 0 0, #BEBEBE -1.5em 0 0 0, #BEBEBE -1.1em -1.1em 0 0, #BEBEBE 0 -1.5em 0 0, #BEBEBE 1.1em -1.1em 0 0;
            }
            @-webkit-keyframes spinner {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg); }
            }
            @-moz-keyframes spinner {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @-o-keyframes spinner {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes spinner {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </span>
        `;

    divElem.insertAdjacentHTML('beforeend', styleScoped);
    if (bool) {
      const foundDivElem = document.querySelector('[data-rg-spinner-showviews]');
      document.body.removeChild(foundDivElem);
    } else {
      document.body.prepend(divElem);
    }
  }





  /*************** HTML CONTENT FETCHERS *****************/
  /**
   * Fetch view from a cached file app/cache/views.json.
   * @param {string} viewPath - view file path (relative to /view/ directory): 'pages/home/main.html'
   * @param {string} cssSel - CSS selector to load part of the view file: 'div > p.bolded:nth-child(2)'
   * @returns {object}
   */
  fetchCachedView(viewPath, cssSel) {
    // convert HTML string to Document
    const parser = new DOMParser();
    const doc = parser.parseFromString(window.regochWeber.viewsCached[viewPath], 'text/html');

    // define nodes and string
    let nodes; // array of DOM nodes (Node[])
    let str; // HTML content as string (string)
    if (!cssSel) {
      nodes = /\<title|\<meta|\<link\<base/.test(window.regochWeber.viewsCached[viewPath]) ? doc.head.childNodes : doc.body.childNodes;
      str = window.regochWeber.viewsCached[viewPath];
    } else {
      const elem = doc.querySelector(cssSel);
      nodes = [elem];
      str = !!elem ? elem.outerHTML : '';
    }

    return { nodes, str };
  }


  /**
   * Fetch view by sending a HTTP request to the server.
   * @param {string} viewPath - view file path (relative to /view/ directory): 'pages/home/main.html'
   * @param {string} cssSel - CSS selector to load part of the view file: 'div > p.bolded:nth-child(2)'
   * @returns {object}
   */
  async fetchRemoteView(viewPath, cssSel) {
    const path = `/client/views/${viewPath}`; // /client/views/pages/home/main.html
    const url = new URL(path, this.$baseURIhost).toString(); // resolve the URL
    const answer = await this.$httpClient.askHTML(url, cssSel);
    const content = answer.res.content;
    if (answer.status !== 200 || !content) { throw new Error(`Status isn't 200 or content is empty for ${viewPath}`); }

    const nodes = answer.res.content.nodes; // Node[]
    const str = answer.res.content.str; // string

    return { nodes, str };
  }



  /************ JS LOADERS *********/
  /**
   * Create <script> tags and execute js scripts.
   * @param {string[]} urls - array of JS script URLs
   * @param {number} waitMS - wait for miliseconds before loading process
   */
  async lazyJS(urls, waitMS = 0) {
    if (!urls) { return; }
    for (const url of urls) {
      await new Promise(r => setTimeout(r, waitMS));
      // check if SCRIPT already exists and if exists remove it
      const elems = document.body.querySelectorAll(`script[src="${url}"]`);
      if (elems.length) { this.unlazyJS([url]); }

      // add the SCRIPT tag
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.defer = true;
      script.setAttribute('data-rg-lazyjs', '');
      document.body.appendChild(script);
    }
  }


  /**
   * Remove SCRIPT tag with data-rg-lazyjs attribute and the specific url.
   * @param {string[] | undefined} urls - array of JS script URLs
   */
  unlazyJS(urls) {
    if (!urls) { return; }
    for (const url of urls) {
      const elems = document.body.querySelectorAll(`script[src="${url}"][data-rg-lazyjs]`);
      for (const elem of elems) {
        if (!!elem) { elem.remove(); }
      }
    }
  }


  /**
   * Remove all SCRIPT tags with the data-rg-lazyjs attribute.
   */
  unlazyAllJS() {
    const elems = document.querySelectorAll('script[data-rg-lazyjs]') || [];
    for (const elem of elems) {
      if (!!elem) { elem.remove(); }
    }
  }


  /**
   * Do not create <script> tags, just load js scripts.
   * This can work only for local files due to CORS.
   * @param {string[]} urls - array of JS script URLs
   */
  async loadJS(urls) {
    if (!urls) { return; }
    for (let url of urls) {
      // correct the URL
      url = url.trim();
      if (!/^http/.test(url)) {
        url = new URL(url, this.$baseURIhost).toString(); // resolve the URL
      }

      const jsContents = [];
      const answer = await this.$httpClient.askJS(url);
      jsContents.push(answer.res.content);
      for (const jsContent of jsContents) { eval(jsContent); }
    }
  }


  /**
   * <script src="..." data-rg-lazyjs>
   * Parse the "data-rg-lazyjs" attribute. Reload all SCRIPT elements with data-rg-lazyjs attribute.
   * Remove all SCRIPT tags with the data-rg-lazyjs attributes and immediatelly after reload them.
   * @param {number} waitMS - wait for miliseconds before loading process
   * @returns {Promise<void>}
   */
  async rgLazyjs(waitMS = 0) {
    this._debug('rgLazyjs', '--------- rgLazyjs ------', 'navy', '#B6ECFF');

    const attrName = 'data-rg-lazyjs';
    const elems = document.querySelectorAll(`[${attrName}]`);

    this._debug('rgLazyjs', `found elements:: ${elems.length}`, 'navy');
    if (!elems.length) { return; }

    const urls = []; // url in the src attribute
    for (const elem of elems) {
      const url = elem.getAttribute('src');
      this._debug('rgLazyjs', `  src="${url}"`, 'navy');
      urls.push(url);
    }

    this.unlazyAllJS();
    await this.lazyJS(urls, waitMS);
  }




  /************ CSS LOADERS *********/
  /**
   * Create <link rel="stylesheet"> tags and load CSS.
   * Usually use it in the loader() controller hook.
   * @param {string[]} urls - array of CSS file URLs, ['/client/assets/css/common.css', '/client/assets/css/home.css']
   */
  loadCSS(urls) {
    if (!urls) { return; }
    for (const url of urls) {
      // check if LINK tag already exists and if exists remove it
      const elems = document.body.querySelectorAll(`link[href="${url}"]`);
      if (elems.length) { this.unloadCSS([url]); }

      // create LINK tag
      const linkCSS = document.createElement('link');
      linkCSS.setAttribute('rel', 'stylesheet');
      linkCSS.setAttribute('href', url);
      linkCSS.defer = true;
      document.head.appendChild(linkCSS);
    }
  }

  /**
   * Remove <link rel="stylesheet"> tags and unload CSS.
   * Usually use it in the loader() controller hook.
   * @param {string[]} urls - array of CSS file URLs, ['/client/assets/css/common.css', '/client/assets/css/home.css'] or just ['/client/assets/css/'] to remove all folder files
   */
  unloadCSS(urls) {
    if (!urls) { return; }
    for (const url of urls) {
      const elems = document.head.querySelectorAll(`link[rel="stylesheet"][href="${url}"]`);
      for (const elem of elems) {
        if (!!elem) { elem.remove(); }
      }
    }
  }

  /**
   * Append <style data-rg-ref="#reference"></style> tags in the <head>.
   * Usually use it in the loader() controller hook.
   * @param {string} cssRules - CSS rules, for example: div {font-weight: bold; color:red;}
   * @param {string} ref - reference
   */
  addCSS(cssRules, ref) {
    const style = document.createElement('style');
    style.textContent = cssRules;
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-rg-ref', ref);
    document.head.appendChild(style);
  }

  /**
   * Remove <style data-rg-ref="#reference"></style> tag.
   * Usually use it in the destroy() controller hook.
   * @param {string} ref - reference
   */
  delCSS(ref) {
    const style = document.createElement(`style[data-rg-ref="${ref}"]`);
    if (!!style) { style.remove(); }
  }




  /*************** PAGE HEAD *************/
  /**
   * Set the text in the <title> tag.
   * @param {string} title
   */
  setTitle(title) {
    document.title = title;
  }

  /**
   * Set the page description.
   * @param {string} desc
   */
  setDescription(desc) {
    const elem = document.head.querySelector('meta[name="description"]');
    if (!elem) { throw new Error('The meta[name="description"] tag is not placed in the HTML file.'); }
    elem.setAttribute('content', desc);
  }

  /**
   * Set the page keywords.
   * @param {string} kys - for example: 'regoch, app, database'
   */
  setKeywords(kys) {
    const elem = document.head.querySelector('meta[name="keywords"]');
    if (!elem) { throw new Error('The meta[name="keywords"] tag is not placed in the HTML file.'); }
    elem.setAttribute('content', kys);
  }


  /**
   * Set the document language.
   * @param {string} langCode - 'en' | 'hr' | 'de' | ...
   */
  setLang(langCode) {
    const elem = document.querySelector('html');
    elem.setAttribute('lang', langCode);
  }


  /**
   * Load the <head> tag content from the view file.
   * @param {string} viewPath - view file path (relative to /view/ directory): 'pages/home/head.html'
   * @param {string} dest - destination where to place the view: inner, prepend, append
   */
  async loadHead(viewPath, dest = 'inner') {
    // get the <head> HTML element
    const elem = document.querySelector('head');
    this._debug('loadHead', `--------- loadHead -- ${viewPath} ---------`, '#8B0892', '#EDA1F1');
    if (this._debug().loadView) { console.log('elem::', elem); }
    if (!elem) { throw new Error(`Element HEAD not found.`); }
    if (!viewPath) { throw new Error(`View path is not defined.`); }

    // Get HTML content. First try from the cached JSON and if it doesn't exist then request from the server.
    let nodes, str;
    if (!!window.regochWeber.viewsCached[viewPath]) { // HTML content from the cached file /cache/views.json
      const cnt = this.fetchCachedView(viewPath);
      nodes = cnt.nodes;
      str = cnt.str;
      this._debug('loadHead', '--from cached JSON', '#8B0892');
    } else { // HTML content by requesting the server
      const cnt = await this.fetchRemoteView(viewPath);
      nodes = cnt.nodes;
      str = cnt.str;
      this._debug('loadHead', '--from server', '#8B0892');
    }

    if (this._debug().loadHead) { console.log('nodes::', nodes); }
    if (this._debug().loadHead) { console.log('str::', str); }


    // remove previously generated elements, i.e. elements with the data-rg-headgen attribute
    for (const genElem of document.querySelectorAll(`[data-rg-headgen`)) { genElem.remove(); }


    // load content in the head
    if (dest === 'inner') {
      elem.innerHTML = str;

    } else if (dest === 'prepend') {
      const i = nodes.length;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const nodeCloned = nodes[i].cloneNode(true);
        if (nodeCloned.nodeType === 1) {
          nodeCloned.setAttribute('data-rg-headgen', '');
          elem.prepend(nodeCloned);
        }
      }

    } else if (dest === 'append') {
      for (const node of nodes) {
        const nodeCloned = node.cloneNode(true);
        if (nodeCloned.nodeType === 1) {
          nodeCloned.setAttribute('data-rg-headgen', '');
          elem.append(nodeCloned);
        }
      }

    }

    return { elem, str, nodes };
  }





}




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (View);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// NAMESPACE OBJECT: ./sys/lib/index.js
var lib_namespaceObject = {};
__webpack_require__.r(lib_namespaceObject);
__webpack_require__.d(lib_namespaceObject, {
  "Auth": () => (lib_Auth),
  "Cookie": () => (lib_Cookie),
  "Form": () => (lib_Form),
  "HTTPClient": () => (lib_HTTPClient),
  "Paginator": () => (lib_Paginator),
  "eventEmitter": () => (eventEmitter/* default */.Z),
  "navig": () => (navig/* default */.Z),
  "util": () => (lib_util)
});

;// CONCATENATED MODULE: ./sys/router/RegochRouter.js
/**
 * Terminology
 * =================================
 * route :string - defined route in the def() method - /room/subscribe/:room_name/:id
 * routeParsed.full :string - full route (start and end slashes removed) - 'room/subscribe/:room_name/:id'
 * routeParsed.segments :number - number the full route segments (with param parts) - 4
 * routeParsed.base :number - route part without params segments (start and end slashes removed) - 'room/subscribe'
 *
 * uri :string - current URI - /room/subscribe/sasa/123?x=123&y=abc&z=false
 * uriParsed.path :string - complete uri (start and end slashes removed) - '/room/subscribe/sasa/123'
 * uriParsed.segments :number - number of the uri segments - 4
 * uriParsed.queryString :string - uri part after question mark as string - 'x=123&y=abc&z=false'
 * uriParsed.queryObject :object - uri part parsed as object - {x: 123, y: 'abc', z: false}
 *
 * body :any - data sent along with uri as the transitional object - trx: {uri, body}
 *
 * func :Function - route function - a function which is executed when certain route is matched against the uri
 * trx :object - transitional object which can be changed in the route functions, required field is "uri" - {uri, body, uriParsed, routeParsed, params, query}
 *
 * Notice
 *-----------
 * Variables "uri" and "body" are analogous to HTTP POST request, for example:  POST /room/subscribe/sasa/123?key=999  {a: 'something})
 */



class RegochRouter {

  /**
   * @param {object} routerOpts - router initial options {debug:boolean}
   */
  constructor(routerOpts) {
    this.routerOpts = routerOpts || {};
    this.trx; // transitional object {uri:string, body:any, ...}
    this.routeDefs = []; // route definitions [{route:string, routeParsed:object, funcs:Function[] }]
  }


  /**
   * Set transitional object.
   * @param {object} obj - {uri, body, ...}
   * @returns {void}
   */
  set trx(obj) {
    // required properties
    if (!obj.uri) { throw new Error('The "uri" property is required.'); }

    // "uri" and "body" as properties with constant value (can not be modified)
    Object.defineProperty(obj, 'uri', {
      value: obj.uri,
      writable: false
    });

    Object.defineProperty(obj, 'body', {
      value: obj.body,
      writable: false
    });

    // parse uri
    obj.uriParsed = this._uriParser(obj.uri);

    this._trx = obj;
  }


  /**
   * Get transitional object.
   * @returns {object} - {uri, body, ...}
   */
  get trx() {
    return this._trx;
  }



  /**
   * Define route, routeParsed and corresponding functions.
   * @param {string} route - /room/subscribe/:room_name
   * @param {Function[]} funcs - route functions, middlewares
   * @returns {Router}
   */
  when(route, ...funcs) {
    this.routeDefs.push({
      route,
      routeParsed: this._routeParser(route),
      funcs
    });
    return this;
  }


  /**
   * Redirect from one route to another route.
   * @param {string} fromRoute - new route
   * @param {string} toRoute - destination route (where to redirect)
   * @param {Function} cb - callback function executed during redirection process, it's a route middleware appended to toRoute middlewares
   * @returns {Router}
   */
  redirect(fromRoute, toRoute, cb) {
    const toRouteDef = this.routeDefs.find(routeDef => routeDef.route === toRoute); // {route, routeParsed, funcs}
    const toFuncs = !!toRouteDef ? toRouteDef.funcs : [];
    this.when(fromRoute, cb, ...toFuncs); // assign destination functions to the new route
    return this;
  }


  /**
   * Define special route <notfound>
   * @param {Function[]} funcs - middlewares which will be executed when route is not matched aginst URI
   * @returns {Router}
   */
  notfound(...funcs) {
    this.when('<notfound>', ...funcs);
    return this;
  }



  /**
   * Define special route <do>
   * @param {Function[]} funcs - middlewares which will be executed on every request, e.g. every exe()
   * @returns {Router}
   */
  do(...funcs) {
    this.when('<do>', ...funcs);
    return this;
  }




  /**
   * Find the matched route and execute its middlewares.
   * @returns {Promise<object>}
   */
  async exe() {
    const trx_cloned = { ...this.trx }; // clone trx in case that this.trx is changing to fast
    const uriParsed = trx_cloned.uriParsed; // shop/register/john/23

    /*** FIND ROUTE ***/
    // found route definition
    const routeDef_found = this.routeDefs.find(routeDef => { // {route, routeParsed, funcs}
      const routeParsed = routeDef.routeParsed; // {full, segments, base}
      return this._routeRegexMatchNoParams(routeParsed, uriParsed) || this._routeWithParamsMatch(routeParsed, uriParsed);
    });

    // not found route definition
    const routeDef_notfound = this.routeDefs.find(routeDef => routeDef.route === '<notfound>');

    // do route definition
    const routeDef_do = this.routeDefs.find(routeDef => routeDef.route === '<do>');

    /*** EXECUTE FOUND ROUTE FUNCTIONS */
    if (!!routeDef_found) {
      trx_cloned.routeParsed = routeDef_found.routeParsed;
      trx_cloned.query = uriParsed.queryObject;
      trx_cloned.params = !!trx_cloned.routeParsed ? this._getParams(routeDef_found.routeParsed.full, uriParsed.path) : {};

      for (const func of routeDef_found.funcs) { await func(trx_cloned); }
    } else if (!!routeDef_notfound) {
      for (const func of routeDef_notfound.funcs) { await func(trx_cloned); }
    }


    if (!!routeDef_do && !!routeDef_do.funcs && !!routeDef_do.funcs.length) {
      for (const func of routeDef_do.funcs) { await func(trx_cloned); }
    }


    return trx_cloned;
  }





  /*********** ROUTE MATCHES  ***********/

  /**
   * Route regular expression match against the uri. Parameters are not defined in the route e.g. there is no /: chars.
   * For example:
   *       (route) /ads/autos/bmw - (uri) /ads/autos/bmw -> true
   *       (route) /ads/a.+s/bmw  - (uri) /ads/autos/bmw -> true
   * @param {object} routeParsed - {full, segments, base}
   * @param {object} uriParsed - {path, segments, queryString, queryObject}
   * @returns {boolean}
   */
  _routeRegexMatchNoParams(routeParsed, uriParsed) {
    const routeReg = new RegExp(`^${routeParsed.full}$`, 'i');
    const tf1 = routeReg.test(uriParsed.path); // route must match uri
    const tf2 = routeParsed.segments === uriParsed.segments; // route and uri must have same number of segments
    const tf = tf1 && tf2;
    if (this.routerOpts.debug) { console.log(`\n_routeRegexMatchNoParams:: (route) ${routeParsed.full} - (uri) ${uriParsed.path} -> ${tf}`); }
    return tf;
  }


  /**
   * Route with parameters match against the uri.
   * (route) /shop/register/:name/:age - (uri) /shop/register/john/23
   * @param {object} routeParsed - {full, segments, base}
   * @param {object} uriParsed - {path, segments, queryString, queryObject}
   * @returns {boolean}
   */
  _routeWithParamsMatch(routeParsed, uriParsed) {
    const routeReg = new RegExp(`^${routeParsed.base}\/`, 'i');
    const tf1 = routeReg.test(uriParsed.path); // route base must match uri
    const tf2 = routeParsed.segments === uriParsed.segments; // route and uri must have same number of segments
    const tf3 = /\/\:/.test(routeParsed.full); // route must have at least one /:
    const tf = tf1 && tf2 && tf3;
    if (this.routerOpts.debug) { console.log(`_routeWithParamsMatch:: (route) ${routeParsed.full} - (uri) ${uriParsed.path} -> ${tf}`); }
    return tf;
  }




  /*********** HELPERS  ***********/

  /**
   * Removing slashes from the beginning and the end.
   * /ads/autos/bmw/ --> ads/autos/bmw
   * //ads/autos/bmw/// --> ads/autos/bmw
   * @param {string} path - uri path or route
   * @returns {string}
   */
  _removeSlashes(path) {
    return path.trim().replace(/^\/+/, '').replace(/\/+$/, '');
  }


  /**
   * Convert string into integer, float or boolean.
   * @param {string} value
   * @returns {string | number | boolean | object}
   */
  _typeConvertor(value) {
    function isJSON(str) {
      try { JSON.parse(str); }
      catch (err) { return false; }
      return true;
    }

    if (!!value && !isNaN(value) && value.indexOf('.') === -1) { // convert string into integer (12)
      value = parseInt(value, 10);
    } else if (!!value && !isNaN(value) && value.indexOf('.') !== -1) { // convert string into float (12.35)
      value = parseFloat(value);
    } else if (value === 'true' || value === 'false') { // convert string into boolean (true)
      value = JSON.parse(value);
    } else if (isJSON(value)) {
      value = JSON.parse(value);
    }

    return value;
  }



  /**
   * Create query object from query string.
   * @param  {string} queryString - x=abc&y=123&z=true
   * @return {object}             - {x: 'abc', y: 123, z: true}
   */
  _toQueryObject(queryString) {
    const queryArr = queryString.split('&');
    const queryObject = {};

    let eqParts, property, value;
    queryArr.forEach(elem => {
      eqParts = elem.split('='); // equotion parts
      property = eqParts[0];
      value = eqParts[1];

      value = this._typeConvertor(value); // t y p e   c o n v e r s i o n

      queryObject[property] = value;
    });

    return queryObject;
  }



  /**
   * URI parser
   * @param  {string} uri - /shop/register/john/23?x=abc&y=123&z=true  (uri === trx.uri)
   * @returns {path:string, queryString:string, queryObject:object} - {path: 'shop/register/john/23', queryString: 'x=abc&y=123&z=true', queryObject: {x: 'abc', y: 123, z: true}}
   */
  _uriParser(uri) {
    const uriDivided = uri.split('?');

    const path = this._removeSlashes(uriDivided[0]); // /shop/register/john/23 -> shop/register/john/23
    const segments = path.split('/').length;
    const queryString = uriDivided[1];
    const queryObject = !!queryString ? this._toQueryObject(queryString) : {};

    const uriParsed = { path, segments, queryString, queryObject };
    return uriParsed;
  }


  /**
   * Route parser.
   * Converts route string into the parsed object {full, segments, parser} which is used for matching against the URI.
   * @param  {string} route - /shop/register/:name/:age/
   * @returns {full:string, segments:number, base:string} - {full: 'shop/register/:name/:age', segments: 4, base: 'shop/register'}
   */
  _routeParser(route) {
    const full = this._removeSlashes(route);
    const segments = full.split('/').length;
    const base = full.replace(/\/\:.+/, ''); // shop/register/:name/:age --> shop/register

    const routeParsed = { full, segments, base };
    return routeParsed;
  }



  /**
   * Create parameters object.
   * For example if route is /register/:name/:age AND uri is /register/john/23 then params is {name: 'john', age: 23}
   * @param  {string} routeParsedFull - routeParsed.full -- shop/register/:name/:age
   * @param  {string} uriParsedPath  - uriParsed.path -- shop/register/john/23
   * @returns {object}
   */
  _getParams(routeParsedFull, uriParsedPath) {
    const routeParts = routeParsedFull.split('/'); // ['shop', 'register', ':name', ':age']
    const uriParts = uriParsedPath.split('/'); // ['shop', 'register', 'john', 23]

    const params = {};

    routeParts.forEach((routePart, index) => {
      if (/\:/.test(routePart)) {
        const property = routePart.replace(/^\:/, ''); // remove :

        let value = uriParts[index];
        value = this._typeConvertor(value); // t y p e   c o n v e r s i o n

        params[property] = value;
      }
    });

    return params;
  }





}





/* harmony default export */ const router_RegochRouter = (RegochRouter);


;// CONCATENATED MODULE: ./sys/router/Router.js



class Router extends router_RegochRouter {

  constructor(debugRouter, debug) {
    super({ debug });
    this.debugRouter = debugRouter;
  }


  /**
   * Define the routes
   * @param {string} route - route, for example: '/page1.html'
   * @param {object} ctrl - route controller instance
   * @param {{authGuards:string[]}} routeOpts - route options: {authGuards: ['autoLogin', 'isLogged', 'hasRole']}
   * @returns {void}
   */
  _when(route, ctrl, routeOpts = {}) {
    const authGuards = routeOpts.authGuards || [];

    // prechecks
    if (!route && !!ctrl) { throw new Error(`Route is not defined for "${ctrl.constructor.name}" controller.`); }
    if (!!route && !ctrl) { throw new Error(`Controller is not defined for route "${route}".`); }
    if (/autoLogin|isLogged|hasRole/.test(authGuards.join()) && !ctrl.$auth) { throw new Error(`Auth guards (autoLogin, isLogged, hasRole) are used but Auth is not injected in the controller ${ctrl.constructor.name}. Use App::controllerAuth().`); }

    const assign_ctrl = trx => { trx.ctrl = ctrl; }; // add ctrl in trx so that controller it can be used in preflight and postflight

    const guards = [];
    if (authGuards.length && ctrl.$auth) {
      const autoLogin = ctrl.$auth.autoLogin.bind(ctrl.$auth);
      const isLogged = ctrl.$auth.isLogged.bind(ctrl.$auth);
      const hasRole = ctrl.$auth.hasRole.bind(ctrl.$auth);
      if (authGuards.indexOf('autoLogin') !== -1) { guards.push(autoLogin); }
      if (authGuards.indexOf('isLogged') !== -1) { guards.push(isLogged); }
      if (authGuards.indexOf('hasRole') !== -1) { guards.push(hasRole); }
    }

    const preflight = !!ctrl.$preflight ? ctrl.$preflight : []; // array of preflight functions, will be executed on every route before the controller's loader()
    const processing = ctrl.processing.bind(ctrl);
    const postflight = !!ctrl.$postflight ? ctrl.$postflight : []; // array of postflight functions, will be executed on every route ater the controller's postrend()


    this.when(route, assign_ctrl, ...guards, ...preflight, processing, ...postflight);
  }



  /**
   * Define 404 not found route
   * @param {object} ctrl - route controller instance
   * @returns {void}
   */
  _notfound(ctrl) {
    const processing = ctrl.processing.bind(ctrl);
    this.notfound(processing);
  }



  /**
   * Define functions which will be executed on every route.
   * @param {Function[]} funcs - function which will be executed on every request, e.g. every exe()
   * @returns {Router}
   */
  _do(...funcs) {
    this.do(...funcs);
  }



  /**
   * Redirect from one route to another route.
   * @param {string} fromRoute - new route
   * @param {string} toRoute - destination route (where to redirect)
   * @returns {Router}
   */
  _redirect(fromRoute, toRoute) {
    const cb = () => {
      window.history.pushState(null, '', toRoute); // change URL in the address bar
    };
    this.redirect(fromRoute, toRoute, cb);
  }



  /**
   * Match routes against current browser URI and execute matched route.
   * @param {Event} pevent - popstate or pushstate event
   * @returns {void}
   */
  async _exe(pevent) {
    try {
      const start = new Date();
      let uri = window.location.pathname + window.location.search; // the current uri -  The uri is path + query string, without hash, for example: /page1.html?q=12
      uri = decodeURI(uri); // /sh/po%C5%A1ta?field=title --> /sh/pošta?field=title

      if (this.debugRouter) { console.log(`%c --------- router exe start --> ${uri} ------`, 'color:#680C72; background:#E59FED'); }

      // execute matched route middlewares
      this.trx = { uri, pevent };
      const trx = await this.exe();

      const end = new Date();
      trx.elapsedTime = (end - start) + ' ms'; // in miliseconds

      if (this.debugRouter) {
        console.log('Router trx::', trx);
        console.log(`%c --------- router exe end --> elapsedTime: ${this.trx.elapsedTime} ------`, 'color:#680C72; background:#E59FED');
      }

    } catch (err) {
      if (/AuthWarn::/.test(err.message)) { console.log(`%c${err.message}`, `color:#FF6500; background:#FFFEEE;`); }
      else { console.error(err); }
    }
  }



}





/* harmony default export */ const router_Router = (Router);

// EXTERNAL MODULE: ./sys/lib/navig.js
var navig = __webpack_require__(719);
;// CONCATENATED MODULE: ./sys/lib/HTTPClient.js
class HTTPClient {

  /**
   * @param {Object} opts - HTTP Client options {encodeURI, timeout, retry, retryDelay, maxRedirects, headers}
   */
  constructor(opts) {
    this.url;
    this.protocol = 'http:';
    this.hostname = '';
    this.port = 80;
    this.pathname = '/';
    this.queryString = '';

    if (!opts) {
      this.opts = {
        encodeURI: false,
        timeout: 8000,
        responseType: '', // 'blob' for file download (https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)
        retry: 3,
        retryDelay: 5500,
        maxRedirects: 3,
        headers: {
          'authorization': '',
          'accept': '*/*', // 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
          'content-type': 'text/html; charset=UTF-8'
        }
      };
    } else {
      this.opts = opts;
    }

    // initial values for timeout, responseType and req_headers
    this.timeout = this.opts.timeout;
    this.responseType = this.opts.responseType;
    this.req_headers = { ...this.opts.headers };

    // init the xhr
    this.xhr = new XMLHttpRequest();

    // set interceptor
    this.interceptor;
  }




  /********** REQUESTS *********/

  /**
   * Sending one HTTP request to HTTP server.
   *  - 301 redirections are not handled.
   *  - retries are not handled
   * @param {string} url - https://www.example.com/something?q=15
   * @param {string} method - GET, POST, PUT, DELETE, PATCH
   * @param {any} body_obj - http body payload
   * @returns {Promise<answer>}
   */
  async askOnce(url, method = 'GET', body_obj) {

    // answer (response object)
    const answer = {
      requestURL: url,
      requestMethod: method,
      status: 0,
      statusMessage: '',
      https: false,
      req: {
        headers: this.req_headers,
        payload: undefined
      },
      res: {
        headers: undefined,
        content: undefined
      },
      time: {
        req: this._getTime(),
        res: undefined,
        duration: undefined
      }
    };


    // check and correct URL
    try {
      url = this._parseUrl(url);
      answer.requestURL = url;
      answer.https = /^https/.test(this.protocol);
    } catch (err) {
      // if URL is not properly defined
      const ans = { ...answer }; // clone object to prevent overwrite of object properies once promise is resolved
      ans.status = 400; // client error - Bad Request
      ans.statusMessage = err.message || 'Bad Request';
      ans.time.res = this._getTime();
      ans.time.duration = this._getTimeDiff(ans.time.req, ans.time.res);

      return ans; // send answer and stop further execution
    }

    /*** 0) intercept the request ***/
    if (!!this.interceptor) { await this.interceptor(); }


    /*** 1) init HTTP request ***/
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
    this.xhr.open(method, url, true, null, null);


    // set the xhr options (works only after the xhr is opened)
    this._xhr_timeout(this.timeout);
    this._xhr_responseType(this.responseType);
    this._xhr_requestHeaders(this.req_headers);


    /*** 2) add body to HTTP request ***/
    if (!!body_obj && !/GET/i.test(method)) {
      answer.req.payload = body_obj;

      const contentType = this.req_headers['content-type'] || '';
      let body2send;
      if (/application\/json/.test(contentType)) { body2send = JSON.stringify(body_obj); }
      else { body2send = body_obj; }

      /*** 3) send request to server (with body) ***/
      this.xhr.send(body2send);

    } else {
      /*** 3) send request to server (without body) ***/
      this.xhr.send();
    }



    /** 4) wait for response */
    const promise = new Promise((resolve, reject) => {

      this.xhr.onload = res => {
        // format answer
        const ans = { ...answer }; // clone object to prevent overwrite of object properies once promise is resolved
        ans.status = this.xhr.status; // 2xx -ok response, 4xx -client error (bad request), 5xx -server error
        ans.statusMessage = this.xhr.statusText;
        ans.res.headers = this.getResHeaders();
        ans.res.content = res.target.response;
        ans.time.res = this._getTime();
        ans.time.duration = this._getTimeDiff(ans.time.req, ans.time.res);

        resolve(ans);
      };


      this.xhr.onerror = error => {
        this.kill();
        const err = this._formatError(error, url);

        // format answer
        const ans = { ...answer }; // clone object to prevent overwrite of object properies once promise is resolved
        ans.status = err.status;
        ans.statusMessage = err.message;
        ans.time.res = this._getTime();
        ans.time.duration = this._getTimeDiff(ans.time.req, ans.time.res);

        // do not resolve if it's already resolved by timeout
        resolve(ans);
      };


      this.xhr.ontimeout = () => {
        this.kill();

        // format answer
        const ans = { ...answer }; // clone object to prevent overwrite of object properies once promise is resolved
        ans.status = 408; // 408 - timeout
        ans.statusMessage = `Request aborted due to timeout (${this.opts.timeout} ms) ${url} `;
        ans.time.res = this._getTime();
        ans.time.duration = this._getTimeDiff(ans.time.req, ans.time.res);

        resolve(ans);
      };

    });

    return promise;
  }



  /**
   * Sending HTTP request to HTTP server.
   *  - 301 redirections are handled.
   *  - retries are handled
   * @param {String} url - https://www.example.com/contact
   * @param {String} method - GET, POST, PUT, DELETE, PATCH
   * @param {Object} body_obj - http body
   * @returns {Promise<answer>}
   */
  async ask(url, method = 'GET', body_obj) {

    let answer = await this.askOnce(url, method, body_obj);
    const answers = [answer];


    /*** a) HANDLE 3XX REDIRECTS */
    let redirectCounter = 1;

    while (!!answer && /^3\d{2}/.test(answer.status) && redirectCounter <= this.opts.maxRedirects) { // 300, 301, 302, ...

      const url_new = new URL(url, answer.res.headers.location); // redirected URL is in 'location' header
      console.log(`#${redirectCounter} redirection ${answer.status} from ${this.url} to ${url_new}`);

      answer = await this.askOnce(url_new, method, body_obj); // repeat request with new url
      answers.push(answer);

      redirectCounter++;
    }


    /*** b) HANDLE RETRIES when status = 408 timeout */
    let retryCounter = 1;

    while (answer.status === 408 && retryCounter <= this.opts.retry) {
      console.log(`#${retryCounter} retry due to timeout (${this.opts.timeout}) on ${url}`);
      await new Promise(resolve => setTimeout(resolve, this.opts.retryDelay)); // delay before retrial

      answer = await this.askOnce(url, method, body_obj);
      answers.push(answer);

      retryCounter++;
    }


    return answers;
  }



  /**
   * Fetch the JSON. Redirections and retries are not handled.
   * @param {string} url - https://api.example.com/someurl
   * @param {string} method - GET, POST, PUT, DELETE, PATCH
   * @param {object|string} body - http body as Object or String type
   * @returns {Promise<answer>}
   */
  async askJSON(url, method = 'GET', body) {

    // convert body string to object
    let body_obj = body;
    if (!!body && typeof body === 'string') {
      try {
        body_obj = JSON.parse(body);
      } catch (err) {
        throw new Error('Body string is not valid JSON.');
      }
    }

    // JSON request headers
    this.setReqHeaders({
      'content-type': 'application/json; charset=utf-8',
      'accept': 'application/json'
    });

    const answer = await this.askOnce(url, method, body_obj);

    // convert content string to object
    if (!!answer.res.content) {
      try {
        answer.res.content = JSON.parse(answer.res.content);
      } catch (err) {
        throw new Error('Response content is not valid JSON.');
      }
    }

    return answer;
  }



  /**
   * Get the HTML file content or part of it filtered by the css selector.
   * NOTE: The answer.res.content contains a list of nodes and the HTML string  {Node[], string}.
   * @param {string} url - http://example.com/page.html
   * @param {string} cssSel - css selector: div>p.alert
   * @returns {Promise<answer>}
   */
  async askHTML(url, cssSel) {
    const answer = await this.askOnce(url);

    // convert HTML string to Document
    const parser = new DOMParser();
    const doc = parser.parseFromString(answer.res.content, 'text/html');

    // define nodes and string
    let nodes; // array of DOM nodes https://developer.mozilla.org/en-US/docs/Web/API/Node (Node[])
    let str; // HTML content as string (string)
    if (!cssSel) {
      nodes = doc.body.childNodes;
      str = answer.res.content;
    } else {
      const elem = doc.querySelector(cssSel);
      nodes = [elem];
      str = !!elem ? elem.outerHTML : '';
    }

    answer.res.content = { nodes, str };
    return answer;
  }



  /**
   * Get the content of the Javascript file.
   * @param {string} url - https://api.example.com/someurl
   * @returns {Promise<answer>}
   */
  async askJS(url) {
    this.setReqHeaders({
      'content-type': 'application/javascript; charset=utf-8',
      'accept': 'application/javascript'
    });
    const answer = await this.askOnce(url, 'GET');
    answer.res.content = answer.res.content;
    return answer;
  }



  /**
   * Send POST request where body is new FormData() object.
   * For example (frontend code):
   * // create from data
   * const formData = new FormData();
   * formData.append('db_id', db_id);
   * formData.append('coll_name', coll_name);
   * formData.append('csv_file', csv_file);
   * @param {string} url - https://api.example.com/someurl
   * @param {FormData} formData - the FormData instance
   * @returns {Promise<answer>}
   */
  async sendFormData(url, formData) {
    // content-type should be removed for multipart/form-data as defined at https://fetch.spec.whatwg.org/#typedefdef-xmlhttprequestbodyinit
    this.setReqHeaders({
      'content-type': `multipart/form-data`,
      'accept': '*/*'
    });
    this.delReqHeaders(['content-type']);

    const answer = await this.askOnce(url, 'POST', formData);

    // convert content string to object
    if (!!answer.res.content) {
      try {
        answer.res.content = JSON.parse(answer.res.content);
      } catch (err) {
        console.log('WARNING: Response content is not JSON.');
      }
    }

    return answer;
  }


  /**
   * Convert JS Object to FormData and prepare it for sendFormData()
   * @param {object} formObj - object which needs to be converted
   * @returns {FormData}
   */
  object2formdata(formObj) {
    const formData = new FormData();
    for (const [key, val] of Object.entries(formObj)) { formData.set(key, val); }
    return formData;
  }



  /** TODO
   * Send HTML Form fields. Custom boundary for multipart/form-data .
   * @param {string} url - https://api.example.com/someurl
   * @param {FormData} formData - the FormData instance
   * @param {string} contentType - request header content-type value, which can be application/x-www-form-urlencoded or multipart/form-data (for files) or text/plain (Forms with mailto:)
   * @returns {Promise<answer>}
   */
  async sendForm(url, formData, contentType = 'application/x-www-form-urlencoded') {
    // define boundary
    let boundary = 'RegochWebHttpClient';
    boundary += Math.floor(Math.random() * 32768);
    boundary += Math.floor(Math.random() * 32768);
    boundary += Math.floor(Math.random() * 32768);
    console.log('boundary::', boundary);

    const body = `--${boundary}\r\nContent-Disposition: form-data; name="db_id"\r\n\r\n12345\r\n--${boundary}--`;
    console.log('body::', body);

    const answer = await this.askOnce(url, 'POST', formData);
    return answer;
  }



  /**
   * Stop the sent request.
   * @returns {void}
   */
  kill() {
    this.xhr.abort();
  }


  /**
   * Set the interceptor function which will be executed every time before the HTTP request is sent.
   * @param {Function} interceptor - callback function, for example (httpClient) => { httpClient.setReqHeader('Authorization', 'JWT aswas); }
   * @returns {void}
   */
  setInterceptor(interceptor) {
    this.interceptor = interceptor.bind(this);
  }





  /********** HEADERS *********/

  /**
   * Change request header object. The headerObj will be appended to previously defined this.req_headers and headers with the same name will be overwritten.
   * @param {Object} headerObj - {'authorization', 'user-agent', accept, 'cache-control', 'host', 'accept-encoding', 'connection'}
   * @returns {void}
   */
  setReqHeaders(headerObj) {
    Object.keys(headerObj).forEach(prop => {
      const headerName = prop;
      const headerValue = headerObj[prop];
      this.setReqHeader(headerName, headerValue);
    });
  }

  /**
   * Set (add/update) request header.
   * Previously defined header will be overwritten.
   * @param {String} headerName - 'content-type'
   * @param {String} headerValue - 'text/html; charset=UTF-8'
   * @returns {void}
   */
  setReqHeader(headerName, headerValue) {
    headerName = headerName.toLowerCase();
    this.req_headers[headerName] = headerValue;
  }

  /**
   * Delete multiple request headers.
   * @param {Array} headerNames - array of header names, for example: ['content-type', 'accept']
   * @returns {void}
   */
  delReqHeaders(headerNames) {
    headerNames.forEach(headerName => {
      delete this.req_headers[headerName];
    });
  }

  /**
   * Get request headers
   * @returns {object}
   */
  getReqHeaders() {
    return this.req_headers;
  }


  /**
   * Get response HTTP headers.
   * @returns {object}
   */
  getResHeaders() {
    const headersStr = this.xhr.getAllResponseHeaders();
    const headersArr = headersStr.split('\n');
    const headersObj = {};
    headersArr.forEach(headerFull => {
      const splited = headerFull.split(':');
      const prop = splited[0];
      if (prop) {
        const val = splited[1].trim();
        headersObj[prop] = val;
      }
    });
    return headersObj;
  }




  /********** PRIVATES *********/

  /**
   * Parse url.
   * @param {String} url - http://www.adsuu.com/some/thing.php?x=2&y=3
   */
  _parseUrl(url) {
    url = this._correctUrl(url);
    const urlObj = new URL(url);
    this.url = url;
    this.protocol = urlObj.protocol;
    this.hostname = urlObj.hostname;
    this.port = urlObj.port;
    this.pathname = urlObj.pathname;
    this.queryString = urlObj.search;

    // debug
    /*
    console.log('this.url:: ', this.url); // http://localhost:8001/www/products?category=databases
    console.log('this.protocol:: ', this.protocol); // http:
    console.log('this.hostname:: ', this.hostname); // localhost
    console.log('this.port:: ', this.port); // 8001
    console.log('this.pathname:: ', this.pathname); // /www/products
    console.log('this.queryString:: ', this.queryString); // ?category=databases
    */

    return url;
  }


  /**
   * URL corrections
   */
  _correctUrl(url) {
    if (!url) { throw new Error('URL is not defined'); }

    // 1. trim from left and right
    url = url.trim();

    // 2. add protocol
    if (!/^https?:\/\//.test(url)) {
      url = 'http://' + url;
    }

    // 3. remove multiple empty spaces and insert %20
    if (this.opts.encodeURI) {
      url = encodeURI(url);
    } else {
      url = url.replace(/\s+/g, ' ');
      url = url.replace(/ /g, '%20');
    }

    return url;
  }


  /**
   * Beautify error messages.
   * @param {Error} error - original error
   * @return formatted error
   */
  _formatError(error, url) {
    // console.log('_formatError::', error, url);
    const err = new Error(error);


    // reformatting NodeJS errors
    if (error.target.status === 0) {
      err.status = 0;
      err.message = `Status:0 Bad Request ${url}`;
    } else {
      err.status = error.status || 400;
      err.message = error.message;
    }

    err.original = error;

    return err; // formatted error is returned
  }


  /**
   * Get current date/time
   */
  _getTime() {
    const d = new Date();
    return d.toISOString();
  }


  /**
   * Get time difference in seconds
   */
  _getTimeDiff(start, end) {
    const ds = new Date(start);
    const de = new Date(end);
    return (de.getTime() - ds.getTime()) / 1000;
  }



  /********** PRIVATE XHR OPTIONS *********/
  /**
   * Modify request headers. This is the headers sent to the server.
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader
   * To change it use header methods.
   * @param {object} headers - headers object: { 'content-type': 'text/html', accept: 'application/json' }
   * @returns {void}
   */
  _xhr_requestHeaders(headers) {
    Object.keys(headers).forEach(prop => this.xhr.setRequestHeader(prop.toLowerCase(), headers[prop]));
  }

  /**
   * Modify request timeout in miliseconds. This is the time for which will xhr wait for response from the server.
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
   * To change it use: httpClient.timeout = 120000;
   * @param {number} ms - the timeout period
   * @returns {void}
   */
  _xhr_timeout(ms) {
    this.xhr.timeout = +ms || 0; // 0 means the request will never be timeout
  }

  /**
   * Modify the response type. This is the reponse tye which client expects from the server. For example 'blob' if client waits for file download.
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
   * To change it use: httpClient.responseType = 'blob';
   * @param {string} type - text, arraybuffer, blob, document, json, ms-stream
   * @returns {void}
   */
  _xhr_responseType(type) {
    this.xhr.responseType = type || 'text';
  }



}


/* harmony default export */ const lib_HTTPClient = (HTTPClient);

;// CONCATENATED MODULE: ./sys/conf/$debugOpts.js
/**
 * System Default MVC Debug Options
 */
/* harmony default export */ const $debugOpts = ({
  // general
  warnings: false,

  // Router
  router: false,
  regochRouter: false,

  // Controller.js
  render: false,
  navig: false,

  // View.js
  rgInc: false,
  loadView: false,
  emptyView: false,
  loadHead: false,
  rgLazyjs: false,

  // DataRg.js
  rgFor: false,
  rgRepeat: false,
  rgPrint: false,

  rgIf: false,
  rgSpinner: false,
  rgSwitch: false,
  rgDisabled: false,
  rgValue: false,
  rgChecked: false,
  rgClass: false,
  rgStyle: false,
  rgSrc: false,
  rgAttr: false,
  rgElem: false,
  rgEcho: false,

  // DataRgListeners.js
  rgKILL: false,
  rgHref: false,
  rgClick: false,
  rgKeyup: false,
  rgChange: false,
  rgEvt: false,
  rgSet: false,
  rgModel: false
});

;// CONCATENATED MODULE: ./sys/App.js





window.regochWeber = {}; // init global variable



class App {

  constructor() {
    this.ctrls = {}; // { ctrlName1: {}, ctrlName2: {} }
    this.$debugOpts = $debugOpts; // object with the debug parameters -- {rgFor: true, rgIf: false}
  }

  /*============================== CONTROLLERS ==============================*/
  /**
   * Create controller instances and inject into the app.ctrls.
   * @param  {Class[]} Ctrls - array of controller classes
   * @returns {App}
   */
  controllers(Ctrls) {
    for (const Ctrl of Ctrls) {
      const ctrl = new Ctrl(this);
      this.ctrls[Ctrl.name] = ctrl;
    }
    this._httpClient(); // define ctrl.$httpClient and ctrl.$baseURIhost
    return this;
  }


  /**
   * Define controller property/value. Sometimes it's useful that all controllers have same property with the same value.
   * @param {string} name - controller property name
   * @param {any} val - value
   * @returns
   */
  _controllerProp(name, val) {
    const controllersCount = Object.keys(this.ctrls).length;
    if (controllersCount === 0) { throw new Error(`The controller property "${name}" should be defined after the method controllers().`); }
    for (const ctrlName of Object.keys(this.ctrls)) { this.ctrls[ctrlName][name] = val; }
    return this;
  }


  /**
   * Set the $httpClient and $baseURIhost property in all controllers.
   * The $httpClient is the default controller's HTTP client. It can be invoked with this.$httpClient in the controller.
   * The $httpClient is used in View.js.
   * For methods see lib/HttpClient.
   * @returns {App}
   */
  _httpClient() {
    const opts = {
      encodeURI: true,
      timeout: 21000,
      retry: 0,
      retryDelay: 1300,
      maxRedirects: 0,
      headers: {
        'authorization': '',
        'accept': '*/*', // 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        'content-type': 'text/html; charset=UTF-8'
      }
    };
    const httpClient = new lib_HTTPClient(opts);
    this._controllerProp('$httpClient', httpClient);

    const baseURIhost = `${window.location.protocol}//${window.location.host}`; // http://localhost:4400
    this._controllerProp('$baseURIhost', baseURIhost);

    return this;
  }


  /**
   * Set the subproperty of the controller's $fridge property in all controllers.
   * The $fridge object will be preserved during controller processing execution. Other controller's properties will be deleted.
   * @param {string} name - $fridge property name
   * @param {any} val - value
   * @returns {App}
   */
  fridge(name, val) {
    const controllersCount = Object.keys(this.ctrls).length;
    if (controllersCount === 0) { throw new Error(`The $fridge property "${name}" should be defined after the method controllers().`); }
    for (const ctrlName of Object.keys(this.ctrls)) { this.ctrls[ctrlName]['$fridge'][name] = val; }
    return this;
  }


  /**
   * Inject the auth library into the all controllers and use it as this.$auth in the controller.
   * Useful in apps where authentication guards are required in all routes, for example when building a web panel.
   * @param {Auth} auth - Auth class instance
   * @returns {App}
   */
  auth(auth) {
    this._controllerProp('$auth', auth);

    // bindings because of this in Auth:login, logout, getLoggedUserInfo, etc methods,
    // so the methods can be used in HTML, for example: data-rg-click="$auth.logout()"
    for (const ctrlName of Object.keys(this.ctrls)) {
      const $auth = this.ctrls[ctrlName]['$auth'];
      $auth.login = $auth.login.bind($auth);
      $auth.logout = $auth.logout.bind($auth);
      $auth.getLoggedUserInfo = $auth.getLoggedUserInfo.bind($auth);
      $auth.setLoggedUserInfo = $auth.setLoggedUserInfo.bind($auth);
      $auth.getJWTtoken = $auth.getJWTtoken.bind($auth);
    }

    return this;
  }


  /**
   * Define preflight functions which will be executed on every route, before the controller processing() i.e. before loader().
   * Never define $model in the preflight function because it will triger render() before loader().
   * Define it before the routes() method.
   * @param {Function[]} funcs - array of preflight functions (app, trx) => { ... }
   * @returns {App}
   */
  preflight(...funcs) {
    this._controllerProp('$preflight', funcs);
    return this;
  }


  /**
   * Define postflight functions which will be executed on every route, after the controller processing(), i.e. after the postrend().
   * Here the $model can be defined (what wil trigger the render()).
   * Define it before the routes() method.
   * @param {Function[]} funcs - array of preflight functions (app, trx) => { ... }
   * @returns {App}
   */
  postflight(...funcs) {
    this._controllerProp('$postflight', funcs);
    return this;
  }


  /**
   * Define routes
   * @param {string[][]} routesCnf
   * @returns {App}
   */
  routes(routesCnf) {
    const router = new router_Router(this.$debugOpts.router, this.$debugOpts.regochRouter);

    for (const routeCnf of routesCnf) {
      if (!routeCnf || (!!routeCnf && !Array.isArray(routeCnf)) || (!!routeCnf && !routeCnf.length)) { throw new Error(`Invalid route definition ${routeCnf}`); }

      const cmd = routeCnf[0]; // 'when', 'notfound', 'do', 'redirect'

      if (cmd === 'when') {
        const route = routeCnf[1]; // '/page1'
        const ctrlName = routeCnf[2]; // 'Page1Ctrl'
        const routeOpts = routeCnf[3]; // {authGuards: ['autoLogin', 'isLogged', 'hasRole']}
        if (!this.ctrls[ctrlName]) { throw new Error(`Controller "${ctrlName}" is not defined or not injected in the App.`); }
        const ctrl = this.ctrls[ctrlName];
        router._when(route, ctrl, routeOpts);

      } else if (cmd === 'notfound') {
        const ctrlName = routeCnf[1]; // 'NotfoundCtrl'
        if (!this.ctrls[ctrlName]) { throw new Error(`Controller "${ctrlName}" is not defined or not injected in the App.`); }
        const ctrl = this.ctrls[ctrlName];
        router._notfound(ctrl);

      } else if (cmd === 'do') {
        const funcs = routeCnf.filter((routeCnfElem, key) => { if (key !== 0) { return routeCnfElem; } });
        router._do(...funcs);

      } else if (cmd === 'redirect') {
        const fromRoute = routeCnf[1];
        const toRoute = routeCnf[2];
        router._redirect(fromRoute, toRoute);
      }
    }


    // test URI against routes when browser's Reload button is clicked
    router._exe();

    // A) test URI against routes when element with data-rg-href attribute is clicked --> 'pushstate'
    // B) test URI against routes when BACK/FORWARD button is clicked --> 'popstate'
    navig/* default.onUrlChange */.Z.onUrlChange(pevent => {
      router._exe(pevent); // pevent is popstate or pushstate event (see navig.onUrlChange())
    });

    return this;
  }


  /**
   * Inject the content of the client/_cache/views.json.
   * Useful to speed up the HTML view load, especially in data-rg-inc elements.
   * @param {object} viewsCached - the content of the client/_cache/views.json file
   * @returns {App}
   */
  viewsCached(viewsCached) {
    // this.controllerProp('viewsCached', viewsCached);
    window.regochWeber.viewsCached = viewsCached;
    return this;
  }


  /**
   * Define the debugging options. Set the controller's $debugOpts property.
   * @param {object} $debugOpts
   * @returns {App}
   */
  debugger($debugOpts) {
    if (!!$debugOpts) { this.$debugOpts = $debugOpts; }
    this._controllerProp('$debugOpts', this.$debugOpts);
    return this;
  }



  /********** EVENTS **********/
  /**
   * Fired when HTML doc with the all resources is loaded.
   * https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload
   * @param {Function} cb - callback, () => { ... }
   */
  onReady(cb) {
    window.onload = cb;
  }


  /**
   * Fired when HTML doc is loaded without CSS, IMG and other resources.
   * https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
   * @param {Function} cb - callback, event => { ... }
   */
  onDOMLoaded(cb) {
    document.addEventListener('DOMContentLoaded', cb);
  }


  /**
   * Listen for the DOM changes. Creates app.DOMObserver.
   * How to use:
   * app.createDOMObserver((mutationsList, observer) => { ... });
   * const targetNode = document.querySelector('p#my-id); const config = { attributes: true, childList: true, subtree: true };
   * app.DOMObserver.observe(targetNode, config);
   * To stop observing use: app.DOMObserver.disconnect();
   * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
   * @param {Function} cb - callback, (mutationsList, observer) => { ... }
   */
  createDOMObserver(cb) {
    this.DOMObserver = new MutationObserver(cb);
  }


}


/* harmony default export */ const sys_App = (App);

// EXTERNAL MODULE: ./sys/mvc/View.js
var View = __webpack_require__(961);
;// CONCATENATED MODULE: ./sys/mvc/Model.js



class Model extends View/* default */.Z {

  constructor() {
    super();
    this.$model = {};
    this.$modeler = {};
  }


  /**
   * Proxy the this.$model object.
   */
  proxifyModel() {
    const trapHandler = {
      set: (obj, prop, value) => {
        // console.log('obj-before::', { ...obj });
        // console.log('prop::', prop);
        // console.log('value::', value);
        const tf = Reflect.set(obj, prop, value);
        // console.log('obj-after::', obj);
        this.render('$model.' + prop);
        return tf;
      }
    };

    this.$model = new Proxy(this.$model, trapHandler);
  }



  /**
   * Define modeler (helper) methods, for example: this.$modeler.use('pets').mpush('dog');
   * @returns [any[]]
   */
  modeler() {
    /**
     * @param {string} moelName - the model name, for example in $model.company.name --> modelName is company
     */
    this.$modeler.use = (modelName) => {
      const methods = {
        /**
         * Set the model value
         * @param {any} val - the model value at certain path
         * @param {string} path - the $model property path, for example 'product.name'
         */
        setValue: (val, path) => {
          const mprop = !!path ? `${modelName}.${path}` : modelName;
          this._setModelValue(mprop, val); // see Aux class
        },

        getValue: (path) => {
          const mprop = !!path ? `${modelName}.${path}` : modelName;
          const val = this._getModelValue(mprop); // see Aux class
          return val;
        },

        mpush: (arrElem) => {
          this.$model[modelName].push(arrElem);
          this.render('$model.' + modelName);
        },

        mpop: () => {
          this.$model[modelName].pop();
          this.render('$model.' + modelName);
        },

        munshift: (arrElem) => {
          this.$model[modelName].unshift(arrElem);
          this.render('$model.' + modelName);
        },

        mshift: () => {
          this.$model[modelName].shift();
          this.render('$model.' + modelName);
        },

        mrender: () => {
          this.render('$model.' + modelName);
        },

      };

      return methods;
    };

  }



  /**
   * Delete all $model properties
   */
  emptyModel() {
    this.$model = {};
  }



  /**
   * Check if the this.$model is empty object
   * @returns {boolean}
   */
  isModelEmpty() {
    return !Object.keys(this.$model).length;
  }




}


/* harmony default export */ const mvc_Model = (Model);

;// CONCATENATED MODULE: ./sys/mvc/Controller.js




class Controller extends mvc_Model {

  // controller properties: $auth, $debugOpts, $fridge, $model, $modeler, $preflight, $postflight, $rg, $httpClient, $baseURIhost
  constructor() {
    super();
    this.$debugOpts = {}; // debug options, setup with App.debugger()
    this.$fridge = {}; // fridged properties will not be deleted during controller processing i.e. in the navig.resetPreviousController()
    this.$navig = navig/* default */.Z;
  }



  /************* LIFECYCLE HOOK METHODS ***********/
  /**
   * LOAD HTML
   * Load the page views, includes, lazy loads, etc... Use "View" methods here.
   * @param {object} trx - regoch router transitional variable
   * @returns {Promise<void>}
   */
  async loader(trx) { }

  /**
   * LOAD DATA
   * Init the controller properties (set initial values).
   * @param {object} trx - regoch router transitional variable
   * @returns {Promise<void>}
   */
  async init(trx) { }

  /**
   * REND HTML AND DATA
   * Render data-rg- elements.
   * @param {object} trx - regoch router transitional variable
   * @returns {Promise<void>}
   */
  async rend(trx) { await this.render(); }

  /**
   * Execute after rend.
   * @param {object} trx - regoch router transitional variable
   * @returns {Promise<void>}
   */
  async postrend(trx) { }

  /**
   * Destroy the controller when the data-rg-href element is clicked (see parse.href()).
   * - removes all data-rg-... element lsiteners
   * @param {Event} pevent - popstate or pushstate event which caused URL change
   * @returns {Promise<void>}
   */
  async destroy(trx) { }





  /**
   * Main router middleware.
   * 1) destroy() - execute the destroy() of the previous controller
   * 3) rgKILL() - kill the previous controller event listeners
   * 2)  $model = {} - reset the pevious and current $model
   * @param {object} navig - navigation stages {uri:string, ctrl:Controller}
   * @param {object} trx - regoch router transitional variable (defined in router.js -> _exe())
   * @returns {Promise<void>}
   */
  async processing(trx) {
    // navig processes
    navig/* default.setPrevious */.Z.setPrevious(); // set previous uri and ctrl
    await navig/* default.resetPreviousController */.Z.resetPreviousController(trx); // reset previous controller and execute destroy()
    navig/* default.setCurrent */.Z.setCurrent(this); // set the current uri and ctrl
    if (this._debug().navig) { console.log(`%c---navig---`, 'color:green; background:#D9FC9B;', navig/* default */.Z); }

    // model processes
    this.emptyModel(); // set $model to empty object
    this.proxifyModel(); // set $model as proxy object
    this.modeler(); // define this.$modeler methods

    // controller processes
    try { await this.loader(trx); } catch (err) { console.error(err); }
    await this.rgInc(true);
    this.rgSetinitial(); // parse data-rg-setinitial
    try { await this.init(trx); } catch (err) { console.error(err); }
    try { await this.rend(trx); } catch (err) { console.error(err); }
    try { await this.postrend(trx); } catch (err) { console.error(err); }

    // post-view processes
    await this.rgLazyjs();
  }




  /************ RENDER METHODS ***********/
  /**
   * Render the view i.e. the data-rg- elements with the attrValQuery.
   * For example: data-rg-print="first_name", where first_name is the controllerProp.
   * @param {string|RegExp} attrValQuery - query for the attribute value
   * @param {number} renderDelay - delay in miliseconds
   */
  async render(attrValQuery, renderDelay = 5) {
    if (!!attrValQuery) {
      /* - remove dynamic part of the attrValquery because dynamic part in the data-rg- elem is not same as solved attrValQuery
       - for example data-rg-print="$model.advert___{{ad_num}}" is resolved to $model.advert___3 */
      attrValQuery = attrValQuery.replace(/___.+$/, ''); // $model.advert___3 -> $model.advert
    }

    this._debug('render', `--------- render (start) -- attrValQuery: ${attrValQuery} -- renderDelay: ${renderDelay} -- ctrl: ${this.constructor.name} ------`, 'green', '#D9FC9B');

    // Render DataRg generators.
    this.rgFor(attrValQuery);
    this.rgRepeat(attrValQuery);
    this.rgPrint(attrValQuery);

    await new Promise(r => setTimeout(r, renderDelay));

    // Render DataRg non-generators.
    this.rgIf(attrValQuery);
    this.rgSpinner(attrValQuery);
    this.rgSwitch(attrValQuery);
    this.rgDisabled(attrValQuery);
    this.rgValue(attrValQuery);
    this.rgChecked(attrValQuery);
    this.rgClass(attrValQuery);
    this.rgStyle(attrValQuery);
    this.rgSrc(attrValQuery);
    this.rgAttr(attrValQuery);
    this.rgElem(attrValQuery);
    this.rgEcho();

    await new Promise(r => setTimeout(r, renderDelay));

    // Render DataRgListeners. First remove all listeners with the rgKILL() and after that associate listeners to data - rg - elements.
    await this.rgKILL();
    this.rgHref();
    this.rgClick();
    this.rgKeyup();
    this.rgChange();
    this.rgEvt();
    this.rgSet();
    this.rgModel();


    this._debug('render', `--------- render (end) -- attrValQuery: ${attrValQuery} ------`, 'green', '#D9FC9B');
  }



  /**
   * Use render() method multiple times.
   * @param {string[]|RegExp[]} attrValQuerys - array of the controller property names: ['company.name', /^company\.year/]
   * @param {number} renderDelay - delay in miliseconds
   */
  async renders(attrValQuerys = [], renderDelay = 5) {
    for (const attrValQuery of attrValQuerys) { await this.render(attrValQuery, renderDelay); }
  }



}

/* harmony default export */ const mvc_Controller = (Controller);

;// CONCATENATED MODULE: ./sys/lib/Cookie.js
/**
interface CookieOpts {
  domain?: string;
  path?: string;
  expires?: number | Date; // number of hours or exact date
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string; // 'strict' for GET and POST, 'lax' only for POST
}
 */

class Cookie {

  /**
   * @param {CookieOpts} cookieOpts - cookie options
   * @param {boolean} debug - show debug info
   */
  constructor(cookieOpts, debug) {
    this.cookieOpts = cookieOpts;
    this.debug = debug;
  }


  /**
   * Set cookie. Cookie value is string.
   * @param {string} name - cookie name
   * @param {string} value - cookie value (string)
   * @returns {void}
   */
  put(name, value) {
    if (!document) { throw new Error('The document is not available.'); }

    // encoding cookie value
    const valueStr = encodeURIComponent(value); // a b --> a%20b

    // name=value;
    let cookieStr = `${name}=${valueStr};`;

    // add cookie options: domain, path, expires, secure, HttpOnly, SameSite
    cookieStr = this._appendCookieOptions(cookieStr);
    document.cookie = cookieStr;

    if (this.debug) { console.log('cookie-put():cookieStr: ', cookieStr); }
  }



  /**
   * Set cookie. Cookie value is object.
   * @param {string} name - cookie name
   * @param {object} valueObj - cookie value (object)
   * @returns {void}
   */
  putObject(name, valueObj) {
    if (!document) { throw new Error('The document is not available.'); }

    // convert object to string and encode that string
    const valueStr = encodeURIComponent(JSON.stringify(valueObj)); // a b --> a%20b

    // name=value;
    let cookieStr = `${name}=${valueStr};`;

    // add cookie options: domain, path, expires, secure, HttpOnly, SameSite
    cookieStr = this._appendCookieOptions(cookieStr);
    document.cookie = cookieStr;

    if (this.debug) { console.log('cookie-putObject(): ', cookieStr); }
  }



  /**
   * Get all cookies in string format (cook1=jedan1; cook2=dva2;).
   * @returns {string} - example: cook1=jedan1; cook2=dva2;
   */
  getAll() {
    if (!document) { throw new Error('The document is not available.'); }
    const allCookies = document.cookie; // 'cook1=jedan1; cook2=dva2;'
    if (this.debug) { console.log('cookie-getAll(): ', allCookies); }
    return allCookies;
  }



  /**
   * Get a cookie by specific name. Returned value is string.
   * @param {string} name - cookie name
   * @returns {string}
   */
  get(name) {
    if (!document) { throw new Error('The document is not available.'); }

    const cookiesArr = this._toCookiesArr(); // ["authAPIInit1=jedan1", "authAPIInit2=dva2", "authAPI="]

    // extract cookie value for specific name
    let elemArr, cookieVal;
    cookiesArr.forEach(elem => {
      elemArr = elem.split('='); // ["authAPIInit1", "jedan1"]
      if (elemArr[0] === name) {
        cookieVal = elemArr[1];
      }
    });

    cookieVal = decodeURIComponent(cookieVal); // a%20b --> a b

    // debug
    if (this.debug) {
      console.log('cookie-get()-cookiesArr: ', cookiesArr);
      console.log('cookie-get()-cookieVal: ', name, '=', cookieVal);
    }

    return cookieVal;
  }



  /**
   * Get cookie by specific name. Returned value is object.
   * @param {string} name - cookie name
   * @returns {object}
   */
  getObject(name) {
    if (!document) { throw new Error('The document is not available.'); }

    const cookieVal = this.get(name); // %7B%22jen%22%3A1%2C%22dva%22%3A%22dvica%22%7D

    // convert cookie string value to object
    let cookieObj = null;
    try {
      if (cookieVal !== 'undefined' && !!cookieVal) {
        const cookieJson = decodeURIComponent(cookieVal);
        cookieObj = JSON.parse(cookieJson);
      }
    } catch (err) {
      console.error('cookie-getObject(): ', err);
    }

    // debug
    if (this.debug) {
      console.log('cookie-getObject():cookieVal: ', cookieVal);
      console.log('cookie-getObject():cookieObj: ', cookieObj);
    }

    return cookieObj;
  }



  /**
   * Remove cookie by specific name.
   * @param {string} name - cookie name
   * @returns {void}
   */
  remove(name) {
    if (!document) { throw new Error('The document is not available.'); }
    let dateOld = new Date('1970-01-01T01:00:00'); // set expires backward to delete cookie
    dateOld = dateOld.toUTCString(); // Thu, 01 Jan 1970 00:00:00 GMT
    document.cookie = `${name}=;expires=${dateOld};path=/;`;
    if (this.debug) { console.log('cookie-remove(): ', name, ' cookie is deleted.'); }
  }



  /**
   * Remove all cookies.
   * @returns {void}
   */
  removeAll() {
    if (!document) { throw new Error('The document is not available.'); }

    // set expires backward to delete cookie
    let dateOld = new Date('1970-01-01T01:00:00'); // set expires backward to delete cookie
    dateOld = dateOld.toUTCString(); // Thu, 01 Jan 1970 00:00:00 GMT

    // get cookies array
    const cookiesArr = this._toCookiesArr(); // ["authAPIInit1=jedan1", "authAPIInit2=dva2", "authAPI="]

    // extract cookie value for specific name
    let elemArr;
    const cookiesArr2 = [];
    cookiesArr.forEach(elem => {
      elemArr = elem.split('='); // ["authAPIInit1", "jedan1"]
      document.cookie = `${elemArr[0]}=;expires=${dateOld};path=/;`;
      cookiesArr2.push(document.cookie);
    });

    // debug
    if (this.debug) {
      console.log('cookie-removeAll():before:: ', cookiesArr);
      console.log('cookie-removeAll():after:: ', cookiesArr2);
    }
  }




  /**
   * Check if cookie exists.
   * @param {string} name - cookie name
   * @return boolean
   */
  exists(name) {
    if (!document) { throw new Error('The document is not available.'); }

    const cookiesArr = this._toCookiesArr(); // ["authAPIInit1=jedan1", "authAPIInit2=dva2", "authAPI="]

    // extract cookie value for specific name
    let elemArr, cookieExists = false;
    cookiesArr.forEach(elem => {
      elemArr = elem.split('='); // ["authAPIInit1", "jedan1"]
      if (elemArr[0] === name) {
        cookieExists = true;
      }
    });

    if (this.debug) { console.log('cookie-exists(): ', cookieExists); }

    return cookieExists;
  }



  /******* PRIVATES *******/
  /**
   * Add cookie options (domain, path, expires, secure, ...) to the cookie string.
   * @param {string} cookieStr - cookie string
   * @returns {string}
   */
  _appendCookieOptions(cookieStr) {

    if (!this.cookieOpts) {
      return cookieStr;
    }

    // domain=example.com;
    if (!!this.cookieOpts.domain) {
      const cDomain = `domain=${this.cookieOpts.domain};`;
      cookieStr += cDomain;
    }

    // path=/;
    if (!!this.cookieOpts.path) {
      const cPath = `path=${this.cookieOpts.path};`;
      cookieStr += cPath;
    }

    // expires=Fri, 3 Aug 2001 20:47:11 UTC;
    if (!!this.cookieOpts.expires) {
      let expires;
      if (typeof this.cookieOpts.expires === 'number') {
        const d = new Date();
        d.setTime(d.getTime() + (this.cookieOpts.expires * 60 * 60 * 1000));
        expires = d.toUTCString();
      } else {
        expires = this.cookieOpts.expires.toUTCString();
      }
      const cExpires = `expires=${expires};`;

      cookieStr += cExpires;
    }

    // secure;
    if (!!this.cookieOpts.secure) {
      const cSecure = 'secure;';
      cookieStr += cSecure;
    }

    // HttpOnly;
    if (!!this.cookieOpts.httpOnly) {
      const cHttpOnly = 'HttpOnly;';
      cookieStr += cHttpOnly;
    }

    // SameSite=lax; or SameSite=strict;
    if (!!this.cookieOpts.sameSite) {
      const cSameSite = `SameSite=${this.cookieOpts.sameSite};`;
      cookieStr += cSameSite;
    }

    return cookieStr;
  }



  /**
   * Get all cookies from document.cookie and convert it in the array format.
   * authAPIInit1=jedan1; authAPIInit2=dva2; authAPI=  --> ["authAPIInit1=jedan1", "authAPIInit2=dva2", "authAPI="]
   * @returns {string[]}
   */
  _toCookiesArr() {
    // fetch all cookies
    const allCookies = document.cookie; // authAPIInit1=jedan1; authAPIInit2=dva2; authAPI=

    // create cookie array
    const cookiesArr = allCookies.split(';'); // ["authAPIInit1=jedan1", " authAPIInit2=dva2", " authAPI="]

    // remove empty spaces from left and right side
    const cookiesArrMapped = cookiesArr.map(cookiesPair => { // cookiesPair: " authAPIInit2=dva2"
      return cookiesPair.trim();
    });

    return cookiesArrMapped; // ["authAPIInit1=jedan1", "authAPIInit2=dva2", "authAPI="]
  }



}


/* harmony default export */ const lib_Cookie = (Cookie);

;// CONCATENATED MODULE: ./sys/lib/Auth.js






/**
 * Authentication with the JWT token and cookie.
 */
class Auth {

  /**
   * authOpts:
   {
    apiLogin :string,       // API login URL: http://127.0.0.1:8001/users/login
    afterGoodLogin :string, // redirect after succesful login: '/{loggedUserRole}', (empty string => dont do anything, location.href => reload same URL)
    afterBadLogin :string,  // redirect after unsuccesful login: '/login', (empty string => dont do anything, location.href => reload same URL)
    afterLogout :string     // URL after logout: '/login', (empty string => dont do anything, location.href => reload same URL)
   }
   * NOTICE: If afterGoodLogin, afterBadLogin, afterLogout has falsy value then the URL will stay same i.e. location.href.
   * @param {object} authOpts - auth options
   */
  constructor(authOpts) {
    this.authOpts = authOpts;

    const cookieOpts = {
      // domain: 'localhost',
      path: '/',
      expires: 5, // number of hours or exact date
      secure: false,
      httpOnly: false,
      sameSite: 'strict' // 'strict' for GET and POST, 'lax' only for POST
    };
    this.cookie = new lib_Cookie(cookieOpts);

    const opts = {
      encodeURI: false,
      timeout: 8000,
      retry: 3,
      retryDelay: 5500,
      maxRedirects: 3,
      headers: {
        'authorization': '',
        'accept': '*/*', // 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        'content-type': 'text/html; charset=UTF-8'
      },
      responseType: '' // 'blob' for file download (https://developer.mozillfullnamea.org/en-US/docs/Web/API/XMLHttpRequest/responseType)
    };
    this.httpClient = new lib_HTTPClient(opts);

    this.jwtToken; // JWT Token string: 'JWT ...'
    this.loggedUser = this.getLoggedUserInfo(); // the user object: {first_name, last_name, username, ...}
  }




  /******* CONTROLLER METHODS - use in the controller's constructor as app.auth() ******/
  /**
   * Send login request to the API.
   * @param {object} creds - credentials object send as body to the API, for example: {username, password}
   * @returns {Promise<any>}
   */
  async login(creds) {
    const url = this.authOpts.apiLogin;
    const answer = await this.httpClient.askJSON(url, 'POST', creds);

    if (answer.status === 200) {
      const apiResp = answer.res.content;

      this.jwtToken = apiResp.jwtToken;
      this.loggedUser = apiResp.loggedUser;

      this.cookie.put('auth_jwtToken', apiResp.jwtToken); // set cookie 'auth_jwtToken': 'JWT xyz...'
      this.cookie.putObject('auth_loggedUser', apiResp.loggedUser); // set cookie 'auth_loggedUser' and class property 'this.loggedUser': {first_name: , last_name: , ...}

      // redirect to URL
      const afterGoodLoginURL = this._correctURL(this.authOpts.afterGoodLogin, apiResp.loggedUser);
      if (!!afterGoodLoginURL) { navig/* default.goto */.Z.goto(afterGoodLoginURL); }

      return apiResp;

    } else {
      this.loggedUser = null;
      this.cookie.removeAll();
      const errMSg = !!answer.res.content && (answer.res.content.message || answer.res.content.msg) ? answer.res.content.message || answer.res.content.msg : 'Bad Login';
      throw new Error(errMSg);
    }

  }


  /**
   * Logout. Remove login cookie, loggedUser and change the URL.
   * @param {number} ms - time period to redirect to afterLogoutURL
   * @returns {void}
   */
  async logout(ms) {
    this.cookie.removeAll(); // delete all cookies
    this.loggedUser = undefined; // remove class property
    await new Promise(r => setTimeout(r, ms));
    const afterLogoutURL = this._correctURL(this.authOpts.afterLogout, null);
    if (!!afterLogoutURL) { navig/* default.goto */.Z.goto(afterLogoutURL); } // change URL
  }


  /**
   * Get logged user info from the object property (faster) or from the cookie 'auth_loggedUser' (slower)
   * @returns {object} - {first_name, last_name, ...}
   */
  getLoggedUserInfo() {
    const loggedUser = this.loggedUser || this.cookie.getObject('auth_loggedUser');
    return loggedUser;
  }


  /**
   * Set logged user object.
   * @param {object} user_obj - {first_name, last_name, ...}
   * @returns {void}
   */
  setLoggedUserInfo(user_obj) {
    this.loggedUser = user_obj;
    this.cookie.putObject('auth_loggedUser', user_obj);
  }


  /**
   * Get JWT token from cookie
   * @return {string} - JWT eyJhbGciOiJIUzI1NiIsInR...
   */
  getJWTtoken() {
    const jwtToken = this.jwtToken || this.cookie.get('auth_jwtToken');
    return jwtToken;
  }





  /******* ROUTER METHODS (use in the router as authGuards) ******/
  /**
   * Check if user is logged and if yes do auto login e.g. redirect to afterGoodLogin URL.
   * @returns {boolean}
   */
  autoLogin() {
    const loggedUser = this.getLoggedUserInfo(); // get loggedUser info after successful username:password login

    // redirect to URL
    if (!!loggedUser && !!loggedUser.username) {
      const afterGoodLoginURL = this._correctURL(this.authOpts.afterGoodLogin, loggedUser);
      if (!!afterGoodLoginURL) { navig/* default.goto */.Z.goto(afterGoodLoginURL); }
      console.log(`%c AuthWarn:: Autologin to ${afterGoodLoginURL} is triggered.`, `color:Maroon; background:LightYellow`);
    }
  }


  /**
   * Check if user is logged and if not redirect to afterBadLogin URL.
   * @returns {boolean}
   */
  isLogged() {
    const loggedUser = this.getLoggedUserInfo(); // get loggedUser info after successful username:password login
    const isAlreadyLogged = !!loggedUser && !!loggedUser.username;

    // redirect to afterBadLogin URL
    if (!isAlreadyLogged) {
      const afterBadLoginURL = this._correctURL(this.authOpts.afterBadLogin, loggedUser);
      if (!!afterBadLoginURL) { navig/* default.goto */.Z.goto(afterBadLoginURL); }
      throw new Error('AuthWarn:: This route is blocked because the user is not logged in.');
    }
  }


  /**
   * Check if user has required role: admin, customer... which corresponds to the URL.
   * For example role "admin" must have URL starts with /admin/...
   * If not redirect to /login page.
   * @returns {boolean}
   */
  hasRole() {
    const loggedUser = this.getLoggedUserInfo(); // get loggedUser info after successful username:password login

    // get current URL and check if user's role (admin, customer) is contained in it
    const currentUrl = window.location.pathname + window.location.search; // browser address bar URL: /admin/product/23

    let urlHasRole = false;
    if (!!loggedUser && !!loggedUser.role) {
      urlHasRole = currentUrl.indexOf(loggedUser.role) !== -1;
    }

    if (!urlHasRole) {
      const afterBadLoginURL = this._correctURL(this.authOpts.afterBadLogin, loggedUser);
      if (!!afterBadLoginURL) { navig/* default.goto */.Z.goto(afterBadLoginURL); }
      throw new Error('AuthWarn:: This route is blocked because the user doesn\'t have valid role.');
    }
  }




  /**** PRIVATES ****/
  /**
   * Correct afterGoodLogin, afterBadLogin, afterLogout.
   * @param {string} url - original url: afterGoodLogin, afterBadLogin, afterLogout
   * @param {object} loggedUser - {first_name, last_name, ... role}
   * @returns
   */
  _correctURL(url, loggedUser) {
    let url_corrected;
    if (!!loggedUser && !!loggedUser.role) {
      url_corrected = !!url ? url.replace('{loggedUserRole}', loggedUser.role) : '';
    } else {
      url_corrected = !!url ? url : '';
    }
    return url_corrected;
  }



}



/* harmony default export */ const lib_Auth = (Auth);

// EXTERNAL MODULE: ./sys/lib/eventEmitter.js
var eventEmitter = __webpack_require__(632);
;// CONCATENATED MODULE: ./sys/lib/Form.js
/**
 * HTML Form Library
 * According to W3C Standard https://html.spec.whatwg.org/multipage/forms.html
 */
class Form {

  constructor(formName) {
    this.formName = formName;
    this.debugOptions = {
      setControl: false,
      setControls: false,
      getControl: false,
      getControls: false,
      delControl: false,
      delControls: false
    };
  }


  /**
   * Set the form control value.
   * @param {string} key - the value of the "name" HTML attribute
   * @param {any|string[]} val - the value
   * @returns {void}
   */
  setControl(key, val) {
    this._debug('setControl', `--------- setControl("${key}", "${val}") ------`, 'green', '#A1F8DC');
    const elems = document.querySelectorAll(`[data-rg-form="${this.formName}"] [name="${key}"]`);
    if (!elems.length) { console.log(`%c FormWarn:: Form "${this.formName}" doesn't have control with name="${key}" attribute.`, `color:Maroon; background:LightYellow`); return; }

    for (const elem of elems) {
      if (elem.type === 'text') { // INPUT[type="text"]
        if (typeof val === 'object') { val = JSON.stringify(val); }
        elem.value = val;
        elem.setAttribute('value', val);

      } else if (elem.type === 'number') { // INPUT[type="number"]
        if (val === '') { val = 0; }
        else if (typeof val === 'string') { val = +val; }
        elem.value = val;
        elem.setAttribute('value', val);

      } else if (elem.type === 'checkbox') { // CHECKBOX
        elem.checked = false;
        if (typeof val !== 'boolean' && val.indexOf(elem.value) !== -1) { elem.checked = true; }
        else if (typeof val === 'boolean') { elem.checked = val; }

      } else if (elem.type === 'radio') { // RADIO
        elem.checked = false;
        if (val === elem.value) { elem.checked = true; }

      } else if (elem.type === 'select-multiple') { // on SELECT with multiple, for example <select name="family" size="4" multiple>
        const options = elem; // all options
        for (const option of options) {
          option.selected = false;
          if (val.indexOf(option.value) !== -1) { option.selected = true; }  // val is array
        }

      } else if (elem.type === 'textarea') { // TEXTAREA
        if (typeof val === 'object') { val = JSON.stringify(val, null, 2); }
        elem.value = val;

      } else { // ALL OTHER: select-one
        elem.value = val;
      }
      this._debug('setControl', `${elem.type}[name="${key}"] got value="${val}"`, 'green');
    }

  }



  /**
   * Set the multiple form controls with one object.
   * @param {object} obj - the object which represent the object values, for example: {name:'John Doe', age:23, employed:true}
   * @returns {void}
   */
  setControls(obj) {
    this._debug('setControls', '--------- setControls ------', 'green', '#88DBC0');
    if (!obj) { return; }
    const keys = Object.keys(obj);
    for (const key of keys) {
      const elems = document.querySelectorAll(`[data-rg-form="${this.formName}"] [name^="${key}"]`);
      this._debug('setControls', `\nElems found: ${elems.length} in the form for name^="${key}".`, 'green');
      if (!elems.length) {
        this._debug('setControls', `FormWarn::setControls -> Form "${this.formName}" doesn't have control with name^="${key}" attribute.`, 'green');
        continue;
      }

      for (const elem of elems) {
        let val, attrVal;
        if (!!elem) {
          attrVal = elem.getAttribute('name'); // seller.name
          const keys = attrVal.split('.'); // ['seller', 'name']
          const key1 = keys[0]; // seller
          const key2 = keys[1]; // name
          if (key1 && !key2) { val = obj[key1]; }
          else if (key1 && key2) { val = obj[key1][key2]; }
        }

        if (!!attrVal) { this.setControl(attrVal, val); }

        if (this._debug().setControls) { console.log(`setControls:: obj-key:: ${key} , attrVal:: ${attrVal} , elem::`, elem); }
      }

    }
  }



  /**
   * Get the form control value.
   * @param {string} key - the value of the "name" HTML attribute
   * @param {boolean} convertType - default true
   * @returns {string|number}
   */
  getControl(key, convertType = true) {
    this._debug('getControl', '--------- getControl ------', 'green', '#A1F8DC');
    const elems = document.querySelectorAll(`[data-rg-form="${this.formName}"] [name="${key}"]`);
    if (!elems.length) { console.error(`Form "${this.formName}" doesn't have name="${key}" control.`); }

    let val;
    const valArr = [];
    let i = 1;
    for (const elem of elems) {
      if (elem.type === 'checkbox') {
        let v = elem.value;
        if (convertType) { v = this._typeConvertor(elem.value); }
        if (elem.checked) { valArr.push(v); val = valArr; }
        if (i === elems.length && !val) { val = []; }

      } else if (elem.type === 'select-multiple') {
        const opts = elem.selectedOptions; // selected options
        for (const opt of opts) {
          let v = opt.value;
          if (convertType) { v = this._typeConvertor(opt.value); }
          valArr.push(v);
          val = valArr;
        }
        if (i === elems.length && !val) { val = []; }

      } else if (elem.type === 'radio') {
        let v = elem.value;
        if (convertType) { v = this._typeConvertor(elem.value); }
        if (elem.checked) { val = v; }

      } else if (elem.type === 'number') {
        val = elem.valueAsNumber;

      } else if (elem.type === 'password') {
        val = elem.value;

      } else if (elem.type === 'file' && elem.multiple) {
        val = elem.files;

      } else if (elem.type === 'file') {
        val = elem.files[0];

      } else {
        let v = elem.value;
        if (convertType) { v = this._typeConvertor(elem.value); }
        val = v;
      }
      i++;
    }

    this._debug('getControl', `${val}`, 'green');
    return val;
  }


  /**
   * Get the form controll values and return corresponding object
   * @param {string[]} keys - the value of the "name" HTML attribute
   * @param {boolean} convertType - default true
   * @returns {object}
   */
  getControls(keys, convertType = true) {
    if (!keys) { console.error('getControlsErr: Argument "keys" is not defined. It should be an array.'); }
    this._debug('getControls', '--------- getControls ------', 'green', '#A1F8DC');
    this._debug('getControls', keys, 'green');
    const obj = {};
    for (const key of keys) {
      obj[key] = this.getControl(key, convertType);
    }
    return obj;
  }


  /**
   * Empty the form control value.
   * @param {string} key - the value of the "name" HTML attribute
   * @returns {void}
   */
  delControl(key) {
    this._debug('delControl', '--------- delControl ------', 'green', '#A1F8DC');
    this._debug('delControl', key, 'green');
    const elems = document.querySelectorAll(`[data-rg-form="${this.formName}"] [name^="${key}"]`);
    if (!elems.length) { console.error(`Form "${this.formName}" doesn't have name^="${key}" control.`); }

    for (const elem of elems) {
      if (elem.type === 'checkbox') {
        elem.checked = false;
      } else if (elem.type === 'select-multiple') {
        const options = elem; // all options
        for (const option of options) {
          option.selected = false;
        }
      } else if (elem.type === 'radio') {
        elem.checked = false;
      } else {
        elem.value = '';
      }
    }

  }


  /**
   * Empty the form control values.
   * @param {string[]} keys - the value of the "name" HTML attribute
   * @returns {void}
   */
  delControls(keys) {
    if (!keys) { console.error('delControlsErr: Argument "keys" is not defined. It should be an array.'); }
    this._debug('delControls', '--------- delControls ------', 'green', '#A1F8DC');
    this._debug('delControls', keys, 'green');
    for (const key of keys) {
      this.delControl(key);
    }
  }


  /**
   * Convert string into integer, float or boolean.
   * @param {string} value
   * @returns {string | number | boolean | object}
   */
  _typeConvertor(value) {
    function isJSON(str) {
      try { JSON.parse(str); }
      catch (err) { return false; }
      return true;
    }

    if (!!value && !isNaN(value) && !/\./.test(value)) { // convert string into integer (12)
      value = parseInt(value, 10);
    } else if (!!value && !isNaN(value) && /\./.test(value)) { // convert string into float (12.35)
      value = parseFloat(value);
    } else if (value === 'true' || value === 'false') { // convert string into boolean (true)
      value = JSON.parse(value);
    } else if (isJSON(value)) {
      value = JSON.parse(value);
    }

    return value;
  }


  _debug(tip, text, color, background) {
    if (this.debugOptions[tip]) { console.log(`%c ${text}`, `color: ${color}; background: ${background}`); }
    return this.debugOptions;
  }



}

/* harmony default export */ const lib_Form = (Form);

;// CONCATENATED MODULE: ./sys/lib/Paginator.js
class Paginator {

  /**
   * @param {number} linksSize - the number of links which will be shown
   * @param {string[]} currentPageClasses - the CSS classes which marks the active page, usually it's <li class="active">
   */
  constructor(linksSize, currentPageClasses) {
    this.linksSize = +linksSize || 5;
    this.currentPageClasses = currentPageClasses || ['active'];
  }


  /**
   * Calculate the page links and make current page active.
   * @param {number} currentPage - current page
   * @param {number} itemsTotal - the total number of items
   * @param {number} itemsPerPage - number of items on one page
   * @returns {{ pageLinks:{i:number, c:string[]}[], pagesTotal:number }}
   */
  async page(currentPage, itemsTotal, itemsPerPage) {
    currentPage = +currentPage; // convert to number
    const pagesTotal = Math.ceil(itemsTotal / itemsPerPage); // define total number of pages

    // define pagination numbers that will be shown from start to end
    const half = Math.ceil(this.linksSize / 2);
    let istart;
    let iend;
    if (pagesTotal >= this.linksSize) {
      if (currentPage >= 1 && currentPage < this.linksSize) {
        istart = 1;
        iend = this.linksSize;
      } else if (currentPage >= this.linksSize && currentPage <= pagesTotal - half) {
        istart = currentPage - half;
        iend = currentPage + half;
      } else {
        istart = pagesTotal - this.linksSize + 1;
        iend = pagesTotal;
      }
    } else {
      istart = 1;
      iend = pagesTotal;
    }

    // define pagelinks objects
    let i; // link number
    const pageLinks = [];
    for (i = istart; i <= iend; i++) {
      const c = i === currentPage ? this.currentPageClasses : []; // current (active) page CSS classes
      const obj = { i, c };
      pageLinks.push(obj);
    }

    return { pageLinks, pagesTotal };
  }


  /**
   * Calculate the skip number, i.e. how many items to skip.
   * @param {number} currentPage - current page number
   * @param {number} itemsPerPage - total items per one page
   * @returns {number}
   */
  skipCalc(currentPage, itemsPerPage) {
    const skip = (currentPage - 1) * itemsPerPage;
    return skip;
  }


  /**
   * Calculate the table ordinal number #.
   * @param {number} currentPage - current page number
   * @param {number} itemsPerPage - total items per one page
   * @param {number} i - table row number: 0, 1, 2, ...
   * @returns {number}
   */
  ordCalc(currentPage, itemsPerPage, i) {
    const ord = (currentPage - 1) * itemsPerPage + i + 1;
    return ord;
  }




}

/* harmony default export */ const lib_Paginator = (Paginator);

;// CONCATENATED MODULE: ./sys/lib/util.js
class Util {

  /**
   * Time delay
   * @param {number} ms - miliseconds
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


}


const util = new Util();

/* harmony default export */ const lib_util = (util);

;// CONCATENATED MODULE: ./sys/lib/index.js
/**
 * The system libraries which can be used in the controller.
 */












;// CONCATENATED MODULE: ./sys/index.js





window.regochWeber.sys = { App: sys_App, Controller: mvc_Controller, syslib: lib_namespaceObject };

;// CONCATENATED MODULE: ./client/_cache/views.js
/* harmony default export */ const views = ({
  "inc/navbar.html": "<div class=\"w3-bar w3-teal w3-card w3-left-align w3-large\"><a class=\"w3-bar-item w3-button w3-hide-medium w3-hide-large w3-right w3-padding-large w3-hover-white w3-large w3-teal\" href=\"javascript:void(0);\" onclick=\"myFunction()\" title=\"Toggle Navigation Menu\"><i class=\"fa fa-bars\"></i></a><a data-rg-href=\"/\" class=\"w3-bar-item w3-button w3-padding-large w3-hover-white\">Home</a><a data-rg-href=\"/quickstart\" class=\"w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white\">Quickstart</a><a data-rg-href=\"/docs\" class=\"w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white\">Docs</a><a data-rg-href=\"/examples\" class=\"w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white\">Examples</a><a href=\"http://www.regoch.org/contact\" target=\"_blank\" class=\"w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white\">Contact</a></div><div id=\"navDemo\" class=\"w3-bar-block w3-white w3-hide w3-hide-large w3-hide-medium w3-large\"><a data-rg-href=\"/\" class=\"w3-bar-item w3-button w3-padding-large\">Home</a><a data-rg-href=\"/quickstart\" class=\"w3-bar-item w3-button w3-padding-large\">Quickstart</a><a data-rg-href=\"/docs\" class=\"w3-bar-item w3-button w3-padding-large\">Docs</a><a data-rg-href=\"/examples\" class=\"w3-bar-item w3-button w3-padding-large\">Examples</a><a href=\"http://www.regoch.org/contact\" target=\"_blank\" class=\"w3-bar-item w3-button w3-padding-large\">Contact</a></div>",
  "inc/footer.html": "<div class=\"w3-xlarge w3-padding-32\"><i class=\"fa fa-facebook-official w3-hover-opacity\"></i><i class=\"fa fa-instagram w3-hover-opacity\"></i><i class=\"fa fa-snapchat w3-hover-opacity\"></i><i class=\"fa fa-pinterest-p w3-hover-opacity\"></i><i class=\"fa fa-twitter w3-hover-opacity\"></i><i class=\"fa fa-linkedin w3-hover-opacity\"></i></div><p>Powered by <a href=\"http://www.regoch.org\" target=\"_blank\">Regoch.org</a></p>"
});
;// CONCATENATED MODULE: ./client/env.js
/* harmony default export */ const env = ({
  api: 'http://127.0.0.1:3336'
});

;// CONCATENATED MODULE: ./client/conf/$debugOpts.js
const $debugOpts_$debugOpts = {
  // general
  warnings: false,

  // Router
  router: false,
  regochRouter: false,

  // Controller.js
  render: false,
  navig: false,

  // View.js
  rgInc: false,
  loadView: false,
  emptyView: false,
  loadHead: false,
  rgLazyjs: false,

  // DataRg.js
  rgFor: false,
  rgRepeat: false,
  rgPrint: false,

  rgIf: false,
  rgSpinner: false,
  rgSwitch: false,
  rgDisabled: false,
  rgValue: false,
  rgChecked: false,
  rgClass: false,
  rgStyle: false,
  rgSrc: false,
  rgAttr: false,
  rgElem: false,
  rgEcho: false,

  // DataRgListeners.js
  rgKILL: false,
  rgHref: false,
  rgClick: false,
  rgKeyup: false,
  rgChange: false,
  rgEvt: false,
  rgSet: false,
  rgModel: false
};




;// CONCATENATED MODULE: ./client/conf/authOpts.js
const authOpts = {
  apiLogin: 'http://localhost:8001/panel/users/login',
  afterGoodLogin: '/playground/{loggedUserRole}/dashboard', // redirect after succesful login:
  afterBadLogin: '/playground/login',  // redirect after unsuccesful login
  afterLogout: '/playground/login'     // URL after logout
};



;// CONCATENATED MODULE: ./client/conf/index.js



;// CONCATENATED MODULE: ./client/controllers/HomeCtrl.js


class HomeCtrl extends regochWeber.sys.Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    this.setTitle('Regoch Weber - JS Single Page App Framework');
    this.setDescription('The Regoch Weber is simple and intuitive JavaScript framework for browser single page applications and mobile applications.');
    this.setKeywords('regoch, weber, framework, javascript, js, single page app');
    this.setLang('en');

    await this.loadView('#layout', 'pages/home/layout.html');
    await this.loadViews([
      ['#main', 'pages/home/main.html'],
    ], true);
  }

}


/* harmony default export */ const controllers_HomeCtrl = (HomeCtrl);

;// CONCATENATED MODULE: ./client/controllers/QuickstartCtrl.js



class QuickstartCtrl extends mvc_Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    this.setTitle('Regoch Weber - Quickstart');
    this.setDescription('The Regoch Weber is simple and intuitive JavaScript framework for browser single page applications and mobile applications.');
    this.setKeywords('regoch, weber, framework, javascript, js, single page app');
    this.setLang('en');

    await this.loadViews([
      ['#layout', 'pages/quickstart/layout.html'],
      ['#main', 'pages/quickstart/main.html'],
    ], true);
  }


  async postrend() {
    this.showButtonBars = false;
    await this.rgIf('showButtonBars');
  }

}


/* harmony default export */ const controllers_QuickstartCtrl = (QuickstartCtrl);

;// CONCATENATED MODULE: ./client/controllers/DocsCtrl.js



class DocsCtrl extends mvc_Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    this.setTitle('Regoch Weber - Docs');
    this.setDescription('The Regoch Weber is simple and intuitive JavaScript framework for browser single page applications and mobile applications.');
    this.setKeywords('regoch, weber, framework, javascript, js, single page app');
    this.setLang('en');

    await this.loadView('#layout', 'pages/docs/layout.html');
    await this.loadViews([
      ['#main', 'pages/docs/main.html'],
    ], true);
  }

}


/* harmony default export */ const controllers_DocsCtrl = (DocsCtrl);

;// CONCATENATED MODULE: ./client/controllers/ExamplesCtrl.js



class ExamplesCtrl extends mvc_Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    this.setTitle('Regoch Weber - Examples');
    this.setDescription('The Regoch Weber is simple and intuitive JavaScript framework for browser single page applications and mobile applications.');
    this.setKeywords('regoch, weber, framework, javascript, js, single page app');
    this.setLang('en');

    await this.loadViews([
      ['#layout', 'pages/examples/layout.html'],
      ['#main', 'pages/examples/main.html'],
    ], true);
  }

}


/* harmony default export */ const controllers_ExamplesCtrl = (ExamplesCtrl);

;// CONCATENATED MODULE: ./client/controllers/NotfoundCtrl.js



class NotfoundCtrl extends mvc_Controller {

  async loader(trx) {
    this.setTitle('Regoch Weber - NOT FOUND');
    await this.loadViews([
      ['#layout', 'pages/notfound/layout.html'],
      ['#main', 'pages/notfound/main.html'],
    ]);
  }

  async postrend(trx) {
    // console.error(`404 not found: ${trx.uri}`);
    this.$model.uri = trx.uri;
  }

}


/* harmony default export */ const controllers_NotfoundCtrl = (NotfoundCtrl);

;// CONCATENATED MODULE: ./client/controllers/playground/Controller_hooksCtrl.js



class Controller_hooksCtrl extends mvc_Controller {

  constructor(app) {
    // console.log('This is playground test. Example: Controller Lifecycle Hooks. Controller_hooksCtrl::constructor(app)  --> param app:', app);
    super();
  }

  async loader(trx) {
    console.log('loader() -- trx::', trx);
    this.setTitle('Controller Hooks Test');
    this.loadCSS(['https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/themes/prism-coy.min.css']);
    this.unloadCSS(['/client/assets/css/switch-box.css']);

    await this.loadView('#layout', 'pages/playground/controller-hooks/main.html');
    this.lazyJS([
      'https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/prism.min.js'
    ]);
  }

  async init(trx) {
    console.log('init() -- trx::', trx);
    console.log('init() -- navig::', navig/* default */.Z);
    console.log('init() -- ctrl::', this);
    this.something = 'smthng';
  }

  // if rend() is not defined then this.render() is used
  async rend(trx) {
    console.log('rend() -- trx::', trx);
    await this.rgKILL();
    this.rgHref();
  }

  async postrend(trx) {
    console.log('postrend() -- trx::', trx);
  }

  async destroy(trx) {
    console.log('destroy() -- trx::', trx);
    console.log('destroy() -- navig::', navig/* default */.Z);
    console.log('destroy() -- ctrl::', this);
    this.unloadCSS(['https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/themes/prism-coy.min.css']);
    this.unlazyJS();
  }

}


/* harmony default export */ const playground_Controller_hooksCtrl = (Controller_hooksCtrl);

;// CONCATENATED MODULE: ./client/controllers/playground/ModelCtrl.js



class ModelCtrl extends mvc_Controller {

  constructor(app) {
    super();
    // this.$model.user = { name: 'John Doe2', age: 12 }; // this will cause the error. Don't use $model in the constructor
  }


  async loader(trx) {
    this.setTitle('Model Test');
    await this.loadView('#layout', 'pages/playground/model/main.html');
  }


  async init(trx) {
    this.$model.user = { name: 'John Doe', age: 11 }; // this is ok because $model is used after loader()
    console.log('this.$model::', this.$model);
  }




  async str() {
    this.$model.first_name = 'Saša';
    await new Promise(r => setTimeout(r, 1300));
    this.$modeler.use('first_name').setValue('Marko');
    await new Promise(r => setTimeout(r, 1300));
    this.$model.first_name = 'Petar'; // shortcut for  this.$model.use('first_name').setValue('Petar');
  }

  async obj() {
    this.$model.user = { name: 'John', age: 23, isActive: false };
    await new Promise(r => setTimeout(r, 1300));
    this.$model.user = { name: 'Peter', age: 28, isActive: true };
  }

  async arr() {
    this.$model.pets = ['dog', 'cat'];
    await new Promise(r => setTimeout(r, 1300));
    this.$modeler.use('pets').mpush('rabbit');
    await new Promise(r => setTimeout(r, 1300));
    this.$modeler.use('pets').mpop();
    await new Promise(r => setTimeout(r, 1300));
    this.$modeler.use('pets').munshift('anaconda');
    await new Promise(r => setTimeout(r, 1300));
    this.$modeler.use('pets').mshift();
  }


  async level5() {
    this.$model.car = { x: { y: { z: { w: { year: 2011 } } } } };
    await new Promise(r => setTimeout(r, 1300));
    this.$modeler.use('car').setValue(2015, 'x.y.z.w.year');
    await new Promise(r => setTimeout(r, 1300));
    const car = this.$modeler.use('car').getValue();
    console.log('car::', car);
    const year = this.$modeler.use('car').getValue('x.y.z.w.year');
    console.log('year::', year);

    this.$model.yearOfCar = year;
    await new Promise(r => setTimeout(r, 1300));
    delete this.$model.yearOfCar; // delete will not render the $model
  }


  modelSeeConsole() {
    console.log('myMdl1::', typeof this.$model.myMdl1, this.$model.myMdl1);
    console.log('myMdl2::', typeof this.$model.myMdl2, this.$model.myMdl2);
    console.log('myMdl3::', typeof this.$model.myMdl3, this.$model.myMdl3);
  }




}


/* harmony default export */ const playground_ModelCtrl = (ModelCtrl);

;// CONCATENATED MODULE: ./client/controllers/playground/View_rgIncCtrl.js



class View_rgIncCtrl extends mvc_Controller {

  constructor(app) {
    super();
  }

  async loader() {
    this.setTitle('rgInc() Test');
    this.setDescription('Page Test description');
    this.setKeywords('regoch, playground, test, page');
    this.setLang('en');
    await this.loadView('#layout', 'pages/playground/view-rginc/main.html'); // cheange here inner, outer, sibling, prepend, append
  }

  async rend() { }

}


/* harmony default export */ const playground_View_rgIncCtrl = (View_rgIncCtrl);

;// CONCATENATED MODULE: ./client/controllers/playground/View_loadViewsCtrl.js



class View_loadViewsCtrl extends mvc_Controller {

  constructor(app) {
    super();
  }


  async loader(trx) {
    this.setTitle('loadViews() Test');

    await this.loadViews([
      ['#layout', 'pages/playground/view-loadviews/main.html', 'sibling'],
      ['#part1', 'pages/playground/view-loadviews/part1.html'],
      ['#part2', 'pages/playground/view-loadviews/part2.html', 'append'],
      ['#part3', 'pages/playground/view-loadviews/part3.html', 'prepend']
    ], true); // isAsync is true
  }

}


/* harmony default export */ const playground_View_loadViewsCtrl = (View_loadViewsCtrl);

;// CONCATENATED MODULE: ./client/controllers/playground/View_lazyJSCtrl.js



class View_lazyJSCtrl extends mvc_Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    this.setTitle('lazyJS() Test');
    this.unloadCSS(['/client/assets/css/switch-box.css']);
    await this.loadView('#layout', 'pages/playground/view-lazyjs/main.html');
  }

  async destroy() {
    this.unlazyAllJS();
    this.emptyView('#layout');
  }


  popup() {
    window.swal({
      icon: 'success',
      text: 'Hello Regoč Weber !',
    });
    $.notify('Hello Regoč');
  }

  // button function
  async lazyAll() {
    console.info('Loading...');
    await this.lazyJS([
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js', // must be loaded before notify.min.js because notify require jQuery
      'https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js',
    ], 1300); // wait 1.3 seconds for next script to load
    console.info('Scripts are loded. Now click on the POPUP button.');
  }

  lazyTest() {
    this.lazyJS([
      '/client/assets/regoch/js/lazyTest2.js'
    ], 1000);
  }

  unlazyAll() {
    this.unlazyAllJS();
  }

  unlazySweetalert() {
    this.unlazyJS([
      'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js'
    ]);
  }


}



/* harmony default export */ const playground_View_lazyJSCtrl = (View_lazyJSCtrl);

;// CONCATENATED MODULE: ./client/controllers/playground/DataRgCtrl.js



class DataRgCtrl extends mvc_Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    this.setTitle('DataRg Test');
    this.addCSS(`
      .my-italic {
        font-style: italic;
      }
      .my-red {
        color: red;
      }
      .my-font-size {
        font-size: 21px;
      }
    `, '#myCSS');
    await this.loadView('#layout', 'pages/playground/datarg/main.html', 'inner');
  }

  async init(trx) {
    // initial values for the runFOR example
    this.$model.companies = [
      { name: 'Cloud Ltd', size: 3 },
      { name: 'Roto Ltd', size: 5 },
      { name: 'Zen Ltd', size: 8 },
      { name: 'Den Ltd', size: 9 },
      { name: 'Len Ltd', size: 10 },
      { name: 'Pen Ltd', size: 81 },
      { name: 'Gen Ltd', size: 82 },
      { name: 'Ren Ltd', size: 83 }
    ];

    // initial values for runFOR2
    this.$model.herbals = [];

    // initial for runFORnested
    // this.$model.fields = ['name', 'from', 'to', 'duration']; // data-rg-print="$model.trains.$i2.($model.fields.$i3) @@ append"
    this.fields = ['name', 'from', 'to', 'duration']; // data-rg-print="$model.trains.$i2.(fields.$i3) @@ append"
    this.$model.trains = [
      { name: 'TRAIN-A', from: 'DU', to: 'ST', duration: 55 },
      { name: 'TRAIN-B', from: 'ST', to: 'KN', duration: 66 }
    ];

    // initial value for runREPEAT
    this.$model.multiplikator = 3;
    this.repeat_var_name = 'multiplikator';

    // initial values for the runSWITCH example
    this.$model.myColor = 'green';

    // initail value for data-rg-print with the pipe
    this.$model.longText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard.';
    this.$model.obj4json = { x: 555 };

    // text with the HTML
    this.$model.htmlText = 'The best <b style="color:red">man</b> friend is: <i data-rg-if="$model.bestFriend $not()">NOBODY</i> <i data-rg-if="$model.bestFriend $eq(Dog)">DOG</i>';

    // initial value for the data-rg-model
    this.$model.myMDL = { name: 'Smokie', animal: 'horse', article: 'Lorem ipsumus ...' };

    // initial value for the data-rg-checked
    this.$model.checks1 = ['Tin'];

    this.$model.bander = {
      name: 'Johnny',
      animal: 'dog',
      article: 'Some article ...'
    };

  }


  // if rend() is not used then default render() is executed
  // async rend() {
  //   this.renderGens();
  //   await syslib.util.sleep(10);
  //   this.renderNonGens();
  //   await syslib.util.sleep(10);
  //   await this.renderLsns();
  // }






  /*********** GENERATORS **********/

  // show array elements by using data-rg-for
  async runFOR() {
    this.$model.companies = [
      { name: 'Cloud2 Ltd', size: 3 },
      { name: 'Roto2 Ltd', size: 5 },
      { name: 'Zen2 Ltd', size: 8 },
      { name: 'Den2 Ltd', size: 81 },
      { name: 'Len2 Ltd', size: 82 },
      { name: 'Pen2 Ltd', size: 83 },
      { name: 'Gen2 Ltd', size: 84 },
      { name: 'Ren2 Ltd', size: 855 }
    ];
  }

  // show array elements by using data-rg-for
  async runFOR2() {
    this.skipNum = 10;
    this.$model.herbals = ['corn', 'banana', 'plum', 'straw'];
  }


  // run data-rg-for inside data-rg-for
  async runFORnested() {
    this.$model.trains = [
      { name: 'TRAIN1', from: 'OS', to: 'NA', duration: 2 },
      { name: 'TRAIN2', from: 'OS', to: 'ZG', duration: 3 },
      { name: 'TRAIN3', from: 'SB', to: 'VK', duration: 5 }
    ];
  }


  // parse interpolated text in variable name
  async runFOR_solveInterpolated() {
    this.$model.kids = [
      { _id: 111, name: 'tom' },
      { _id: 222, name: 'jill' },
      { _id: 333, name: 'ben' }
    ];

    // await syslib.util.sleep(700);

    // print in the variable names with the interpolated text
    this.$model['kid_111'] = 'TOM';
    this.$model.kid_222 = 'JILL';
    this.$model.kid_333 = 'BEN';
  }



  // repeat the data-rg-repeat num times
  async runREPEAT(num) {
    this.$model.pets = [];
    this.$model.multiplikator = num;
  }


  // print initial value and after 1300ms the modified value
  async runPRINT() {
    this.$model.product = {
      name: 'Toyota',
      address: {
        city: 'London'
      },
      colors: ['red', 'green']
    };

    await lib_util.sleep(1300);

    this.$model.product = { ...this.$model.product, ...{ address: { city: 'Zagreb' } } };

    await lib_util.sleep(1300);

    this.$model.product.colors = ['blue', 'orange'];
    this.$modeler.use('product').mrender(); // call render() because this.$model.product.colors is not Proxy and render() will not be trigered
  }


  printHTML() {
    this.$model.bestFriend = 'Dog';
  }


  printHTML_solvemath(n) {
    this.ad_num = n;
    this.$model.advert___3 = '#3. I sell red Mercedes car.';
    this.$model.advert___4 = '#4. I sell chickens.';
  }




  /*********** NON-GENERATORS **********/
  runIF() {
    this.myNum = 5;
    this.myBool = false;
    this.myStr = 'some str';
    this.myArr = [5, 4, 'lorem'];
    this.$model.myStr_model = 'some str';

    this.$model.ifY = {
      bool: true,
      num: 5,
      str: 'some str'
    };
  }


  runIF2() {
    this.myNum2 = 5;
    this.myBool2 = false;
    this.myStr2 = 'some str';
    this.$model.myStr_model2 = 'some str';

    this.$model.ifY2 = {
      bool: true,
      num: 5,
      str: 'some str'
    };
  }


  // toggle if and show hide elements
  toggleIF() {
    this.$model.ifX = !this.$model.ifX;
    // console.log('toggleIF::', this.$model.ifX);
  }


  async toggleIF2() {
    this.$model.continent = !!this.$model.continent ? '' : 'Europe';
  }

  // toggle text color by using data-rg-elem
  runELEM() {
    this.toggle = !this.toggle;
    if (this.toggle) {
      this.$rg.elems.myElem.style.color = 'blue';
    } else {
      this.$rg.elems.myElem.style.color = 'silver';
    }
  }


  // Here are two tests. First will show only one switchcase when red, blue, green is typed in the input field. Another test will show multiple switchcases.
  runSWITCH() {
    this.$model.obj = { myColors: ['green2', 'blue2'] };
  }

  // add CSS classes 'my-red' and 'my-font-size' to the element data-rg-class="myKlases"
  runCLASS() {
    this.$model.myKlases = ['my-red', 'my-font-size'];
  }

  // add style attribute values
  runSTYLE(fontSize, color) {
    this.$model.myStajl = { fontSize, color };
  }

  // define image src attribute
  runSRC() {
    this.$model.imageURL = 'http://cdn.dex8.com/img/turnkey_tasks/scraper_free.png';
  }


  runATTR() {
    this.$model.someURL = 'https://www.adsuu.com';
  }


  toggleDISABLED() {
    this.$model.isDisabled = !this.$model.isDisabled;
  }


  setVALUES() {
    this.$model.input_text01 = 'some text';
    this.$model.input_text_undefined;
    this.$model.input_text_obj = { a: 22 };
    this.$model.input_numberAsString = '157';
    this.$model.input_text01 = 'some text';
  }


  setCHECKED() {
    this.$model.checks1 = ['Pin', 'Tin'];
  }


  toggleSPINNER() {
    this.$model.showSpinner = !this.$model.showSpinner;
  }


  showSetinitial() {
    console.log('someNum_1::', typeof this.someNum_1, this.someNum_1);
    console.log('someNum_2::', typeof this.someNum_2, this.someNum_2);
  }

}


/* harmony default export */ const playground_DataRgCtrl = (DataRgCtrl);

;// CONCATENATED MODULE: ./client/controllers/playground/DataRgListenersCtrl.js



class DataRgListenersCtrl extends mvc_Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    this.setTitle('DataRgListeners Test');
    await this.loadView('#layout', 'pages/playground/datarglisteners/main.html', 'inner');
  }


  async init(trx) {
    // test <button data-rg-click="print.inConsole.makeRed($element)">CLICK</button>
    this.print = {
      inConsole: {
        makeRed: (elem) => {
          console.log(elem);
          elem.style.color = 'orangered';
        }
      }
    };

    // test CLICK2
    this.products = [
      { name: 'Toy', price: 22.34 },
      { name: 'Flower', price: 88.56 },
    ];

    // test CLICK assignment
    this.$model.cats = ['Kiki', 'Pepa'];

  }




  // this is needed so that LINK2 work correctly
  async destroy() {
    this.loadCSS(['/assets/css/switch-box.css']);
    this.emptyView('#layout');
  }




  // show the history
  historyData() {
    console.log('window.history::', window.history);
  }


  async callAPI() {
    const answer = await this.$httpClient.askJSON('api.dex8.com');
    // const answer = await this.httpClient.askJSON('https://jsonplaceholder.typicode.com/todos/1', 'GET');
    // const answer = await this.httpClient.askJSON('https://jsonplaceholder.typicode.com/posts?userId=1', 'GET');
    // const answer = await this.httpClient.askJSON('https://jsonplaceholder.typicode.com/posts', 'POST', {title: 'foo', body: 'bar', userId: 1});
    // const answer = await this.httpClient.askJSON('https://jsonplaceholder.typicode.com/posts/1', 'PUT', {id: 1, title: 'foogoo', body: 'barboo', userId: 3});
    // const answer = await this.httpClient.askJSON('https://jsonplaceholder.typicode.com/posts/1', 'DELETE');
    // const answer = await this.httpClient.askJSON('https://api.dex8.com?q=my str'); // test encodeURI
    // const answer = await this.httpClient.ask('api.dex8.com'); // to test 408 timeout set opts:: timeout:10,retry:5,retryDelay:1300
    return answer;
  }


  // A) fetch the API response and show it in the data-rg-print element   B) change the clicked button color
  async runCLICK(n, str, ...rest) {
    console.log('This is a click. Params::', n, str, rest);
    this.$model.answer = await this.callAPI();
    console.log('answer::', this.$model.answer);

    // make the clicked button green
    if (rest[2]) {
      const elem = rest[2];
      elem.style.color = 'red';
      elem.style.backgroundColor = 'lightgreen';
    }
  }


  runCLICK2(prods) {
    console.log('this.products::', prods);
  }

  runCLICK3(str, num, bool, reg) {
    console.log('str::', typeof str, str);
    console.log('num::', typeof num, num);
    console.log('bool::', typeof bool, bool);
    console.log('reg::', typeof reg, reg, '--- reg.test("oglas")::', reg.test('oglas'));
  }

  // click on the INPUT tag
  runCLICK4(val) {
    console.log('val::', typeof val, val);
  }


  // run two methods by one click
  runCLICK5a(val) {
    console.log('runCLICK5a-val::', typeof val, val);
  }
  runCLICK5b(val) {
    console.log('runCLICK5b-val::', typeof val, val);
  }


  // run on keyup event
  runKEYUP(elem, val, evt) {
    console.log('runKEYUP $element::', elem);
    console.log('runKEYUP $value::', typeof val, val);
    console.log('runKEYUP $event::', evt);
  }


  // update data-rg-switch and data-rg-if every time the SELECT is changed
  async runCHANGE(n, val) {
    if (n === 1) {
      this.$model.change1 = val;
    } else if (n === 2) {
      this.$model.change2 = val;
    }
  }


  // change text collor on mouseover and click
  runEVT(elem, evt, boja) {
    // console.log('$element::', elem);
    // console.log('$event::', evt);
    elem.style.color = boja;
  }


  // change the controller value and affect data-rg-model element
  runMODEL() {
    this.$model.myMDL = 'I changed it !!!';
  }


  setSeeConsole() {
    console.log('mySet10::', typeof this.$model.mySet10, this.$model.mySet10);
    console.log('mySet11::', typeof this.$model.mySet11, this.$model.mySet11);
    console.log('mySet12::', typeof this.$model.mySet12, this.$model.mySet12);
  }


}


/* harmony default export */ const playground_DataRgListenersCtrl = (DataRgListenersCtrl);

;// CONCATENATED MODULE: ./client/controllers/playground/CookieCtrl.js



class CookieCtrl extends mvc_Controller {

  constructor(app) {
    super();
    this.input1;
    this.input2;
    this.cookieForm = new lib_Form('cookieF');

    const cookieOpts = {
      domain: location.hostname,
      path: '/',
      expires: 5, // number of days or exact date
      secure: false,
      httpOnly: false,
      sameSite: 'strict' // 'strict' for GET and POST, 'lax' only for POST
    };
    this.cookie = new lib_Cookie(cookieOpts, true);
  }



  async loader(trx) {
    this.setTitle('Cookie Test');
    await this.loadView('#layout', 'pages/playground/cookie/main.html', 'inner');
  }

  async postrend(trx) {
    this.showFields();
  }


  runCOOKIE() {
    const cookieName = this.cookieForm.getControl('cookieName');
    const cookieValue = this.cookieForm.getControl('cookieValue');
    const cookieMethod = this.cookieForm.getControl('cookieMethod');
    console.log('\n', cookieMethod, ':', cookieName, cookieValue);

    switch (cookieMethod) {
      case 'put': { this.cookie.put(cookieName, cookieValue); break; }
      case 'putObject': { this.cookie.putObject('someObj', { x: 22, y: 'str' }); break; }
      case 'getAll': { console.log(this.cookie.getAll()); break; }
      case 'get': { console.log(this.cookie.get(cookieName)); break; }
      case 'getObject': { console.log(this.cookie.getObject('someObj')); break; }
      case 'remove': { this.cookie.remove(cookieName); break; }
      case 'removeAll': { this.cookie.removeAll(); break; }
      case 'exists': { console.log(this.cookie.exists(cookieName)); break; }
    }

  }


  showFields() {
    const cookieMethod = this.cookieForm.getControl('cookieMethod');
    switch (cookieMethod) {
      case 'put': { this.$model.input1 = true; this.$model.input2 = true; break; }
      case 'putObject': { this.$model.input1 = false; this.$model.input2 = false; break; }
      case 'getAll': { this.$model.input1 = false; this.$model.input2 = false; break; }
      case 'get': { this.$model.input1 = true; this.$model.input2 = false; break; }
      case 'getObject': { this.$model.input1 = false; this.$model.input2 = false; break; }
      case 'remove': { this.$model.input1 = true; this.$model.input2 = false; break; }
      case 'removeAll': { this.$model.input1 = false; this.$model.input2 = false; break; }
      case 'empty': { this.$model.input1 = true; this.$model.input2 = false; break; }
      case 'exists': { this.$model.input1 = true; this.$model.input2 = false; break; }
    }
    this.rgIf();
  }



}


/* harmony default export */ const playground_CookieCtrl = (CookieCtrl);

;// CONCATENATED MODULE: ./client/controllers/playground/FormCtrl.js



class FormCtrl extends mvc_Controller {

  constructor(app) {
    super();
    this.testForm = new lib_Form('testF');
    this.testForm.debugOptions = {
      setControl: true,
      setControls: false,
      getControl: false,
      getControls: false,
      delControl: false,
      delControls: false
    };
  }

  async loader(trx) {
    this.setTitle('Form Test');
    await this.loadView('#layout', 'pages/playground/form/main.html');
  }



  async setFullName() {
    this.testForm.setControl('fullName', 'John');

    await lib_util.sleep(1300);
    this.testForm.setControl('fullName', 'Johnny');

    await lib_util.sleep(800);
    const fullName = this.testForm.getControl('fullName');
    console.log('fullName::', fullName);

    await lib_util.sleep(800);
    this.testForm.delControl('fullName');
  }
  async getFullName() {
    const fullName = this.testForm.getControl('fullName');
    console.log('fullName::', fullName);
  }


  async setAge() {
    this.testForm.setControl('age', 23);
  }
  async getAge() {
    const age = this.testForm.getControl('age');
    console.log('age::', typeof age, age);
  }


  async setCountry() {
    this.testForm.setControl('country', 'Croatia');
    await lib_util.sleep(1300);
    this.testForm.setControl('country', 'UK');
    await lib_util.sleep(1300);
    this.testForm.delControl('country');
  }
  async getCountry() {
    const country = this.testForm.getControl('country');
    console.log('country::', country);
  }


  async setFamily() {
    this.testForm.setControl('family', ['Betty', 'Lara']);
  }
  async getFamily() {
    const family = this.testForm.getControl('family');
    console.log('family::', family);
  }
  async emptyFamily() {
    this.testForm.delControl('family');
  }


  async setJobs() {
    this.testForm.setControl('jobs', ['IT', 'Marketing']);
  }
  async getJobs() {
    const jobs = this.testForm.getControl('jobs');
    console.log('selected jobs::', jobs);
  }
  async emptyJobs() {
    this.testForm.delControl('jobs');
  }


  async setPet() {
    this.testForm.setControl('pet', 'cat');
  }
  async getPet() {
    const pet = this.testForm.getControl('pet');
    console.log('selected pet::', pet);
  }
  async emptyPet() {
    this.testForm.delControl('pet');
  }


  // used data-rg-print
  async generateAutos() {
    this.$model.autos = [
      { id: 1, name: 'Toyota', price: 8000 },
      { id: 2, name: 'WV', price: 4000 },
      { id: 3, name: 'BMW', price: 6000 },
      { id: 4, name: 'Fiat', price: 1000 },
      { id: 5, name: 'Audi', price: 5000 }
    ];

    await new Promise(r => setTimeout(r, 400));
    this.testForm.setControl('autosN', 2);
  }

  // used data-rg-echo
  async generatePlants() {
    this.$model.plants = [
      { id: 1, name: 'Corn', price: 8000 },
      { id: 2, name: 'Ananas', price: 4000 },
      { id: 3, name: 'Banana', price: 6000 },
      { id: 4, name: 'Potato', price: 1000 },
      { id: 5, name: 'Apple', price: 5000 }
    ];

    await new Promise(r => setTimeout(r, 700));
    this.testForm.setControl('plantsN', 3);
  }



  async setAll() {
    this.testForm.setControls({
      fullName: 'John Doe',
      age: 48,
      country: 'Kenya',
      family: ['Mary', 'Betty'],
      jobs: ['IT'],
      pet: 'horse',
      autosN: 5,
      plantsN: 5,
    });
  }



  // set control with name="fruit.seller.name"
  async setFruit() {
    const fruit = {
      name: 'apple',
      price: 22,
      seller: {
        name: 'Drog Ltd',
        city: 'London'
      }
    };

    this.testForm.setControl('fruit.name', fruit.name);
    this.testForm.setControl('fruit.seller.name', fruit.seller.name);
  }



}


/* harmony default export */ const playground_FormCtrl = (FormCtrl);

;// CONCATENATED MODULE: ./client/controllers/playground/LoginCtrl.js



class LoginCtrl extends mvc_Controller {

  constructor(app) {
    super();
    this.$fridge.formLogin = new lib_Form('loginForm');
  }

  async loader(trx) {
    this.setTitle('Auth Login Test');
    await this.loadView('#layout', 'pages/playground/login/main.html');
  }

  async init() {
    // this.formLogin = new syslib.Form('loginForm');
  }

  async tryLogin() {
    const username = this.$fridge.formLogin.getControl('username', false); // false will not convert the type, for example: 12345 will stay string
    const password = this.$fridge.formLogin.getControl('password', false); // false will not convert the type, for example: 12345 will stay string
    try {
      const creds = { username, password };
      console.log('creds::', creds);
      const resp = await this.$auth.login(creds);
      console.log('tryLogin::', username, password, resp);
    } catch (err) {
      console.error(err);
    }
  }



}


/* harmony default export */ const playground_LoginCtrl = (LoginCtrl);

;// CONCATENATED MODULE: ./client/controllers/playground/LoginokCtrl.js



class LoginokCtrl extends mvc_Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    this.setTitle('Auth Login OK');
    await this.loadView('#layout', 'pages/playground/loginok/main.html');
  }

  async tryLogout() {
    try {
      await this.$auth.logout(100);
    } catch (err) {
      console.error(err);
    }
  }




}


/* harmony default export */ const playground_LoginokCtrl = (LoginokCtrl);

;// CONCATENATED MODULE: ./client/controllers/playground/Navig1Ctrl.js



class Navig1Ctrl extends mvc_Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    console.log('Navig1 loader::', trx);
    this.setTitle('Navig Test - Page 1');
    await this.loadView('#layout', 'pages/playground/navig/primary1.html', 'inner');
    console.log(this);
  }


  async destroy(pevent) {
    console.log('Navig1 destroy::', pevent);
  }


  runGOTO(url) {
    navig/* default.goto */.Z.goto(url);
  }

  runBACK() {
    navig/* default.back */.Z.back();
  }

  runFORWARD() {
    navig/* default.forward */.Z.forward();
  }

  runRELOAD() {
    navig/* default.reload */.Z.reload();
  }



}


/* harmony default export */ const playground_Navig1Ctrl = (Navig1Ctrl);

;// CONCATENATED MODULE: ./client/controllers/playground/Navig2Ctrl.js



class Navig2Ctrl extends mvc_Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    console.log('Navig2 loader::', trx);
    this.setTitle('Navig Test - Page 2');
    await this.loadView('#layout', 'pages/playground/navig/primary2.html', 'inner');
  }


  async destroy(pevent) {
    console.log('Navig2 destroy::', pevent);
  }


  runGOTO(url) {
    navig/* default.goto */.Z.goto(url);
  }

  runBACK() {
    navig/* default.back */.Z.back();
  }

  runFORWARD() {
    navig/* default.forward */.Z.forward();
  }

  runRELOAD() {
    navig/* default.reload */.Z.reload();
  }



}


/* harmony default export */ const playground_Navig2Ctrl = (Navig2Ctrl);

;// CONCATENATED MODULE: ./client/controllers/playground/PaginatorCtrl.js



class PaginatorCtrl extends mvc_Controller {

  constructor(app) {
    super();
  }


  async loader(trx) {
    this.setTitle('Paginator Test');
    await this.loadView('#layout', 'pages/playground/paginator/main.html');
  }


  async init(trx) {
    this.paginator = new lib_Paginator(3, ['w3-gray']);
    await this.openPage(1);
  }


  /**
   * Open new page when paginator links are clicked.
   * @param {number} pageNum - page number
   * @param {Element} element - HTML element when clicked will change the page
   */
  async openPage(pageNum, element) {
    if (!!element) { element.blur(); }

    this.currentPage = +pageNum;
    this.itemsPerPage = 5;
    await this.getResults();

    const { pageLinks, pagesTotal } = await this.paginator.page(pageNum, this.$model.itemsTotal, this.itemsPerPage);
    this.$model.pageLinks = pageLinks;
    this.pagesTotal = pagesTotal;
  }


  getResults() {
    const limit = this.itemsPerPage;
    const skip = this.paginator.skipCalc(this.currentPage, this.itemsPerPage);

    const results = [
      { name: 'John Doe 1', age: 1 },
      { name: 'John Doe 2', age: 2 },
      { name: 'John Doe 3', age: 3 },
      { name: 'John Doe 4', age: 4 },
      { name: 'John Doe 5', age: 5 },
      { name: 'John Doe 6', age: 6 },
      { name: 'John Doe 7 ', age: 7 },
      { name: 'John Doe 8', age: 8 },
      { name: 'John Doe 9', age: 9 },
      { name: 'John Doe 10', age: 10 },
      { name: 'John Doe 11', age: 11 },
      { name: 'John Doe 12', age: 12 },
      { name: 'John Doe 13', age: 13 },
      { name: 'John Doe 14', age: 14 },
      { name: 'John Doe 15', age: 15 },
      { name: 'John Doe 16', age: 16 },
      { name: 'John Doe 17', age: 17 },
      { name: 'John Doe 18', age: 18 },
      { name: 'John Doe 19', age: 19 },
      { name: 'John Doe 20', age: 20 },
      { name: 'John Doe 21', age: 21 },
      { name: 'John Doe 22', age: 22 },
    ];

    const start = skip;
    const end = limit + skip;
    this.$model.results = results.slice(start, end);
    this.$model.itemsTotal = 22;
  }




}


/* harmony default export */ const playground_PaginatorCtrl = (PaginatorCtrl);

;// CONCATENATED MODULE: ./client/controllers/playground/AntiflickCtrl.js



class AntiflickCtrl extends mvc_Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    this.showViews(false, true); // with spinner
    // this.showViews(false, false); // no spinner
    console.log('loader() -- trx::', trx);
    this.setTitle('Antiflick Test');

    await this.loadView('#layout', 'pages/playground/antiflick/main.html');
  }

  async init(trx) {
    await lib_util.sleep(2000);
    this.$model.showBtn = true;
    this.showViews(true, true); // with spinner
    // this.showViews(true, false); // no spinner
  }

  // if rend() is not defined then this.render() is used
  // async rend(trx) {
  // }

  async postrend(trx) {
    this.$model.showBtn = true;
  }

  async destroy(trx) {
  }

}


/* harmony default export */ const playground_AntiflickCtrl = (AntiflickCtrl);

;// CONCATENATED MODULE: ./client/controllers/playground/I18nCtrl.js



class I18nCtrl extends mvc_Controller {

  constructor(app) {
    super();
  }


  async loader(trx) {
    this.setTitle('i18n Test');
    await this.loadView('#layout', 'pages/playground/i18n/main.html');
  }


  async init(trx) {

  }


  changeLang() {
    console.log('selected language::', this.$model.lang);
  }


}


/* harmony default export */ const playground_I18nCtrl = (I18nCtrl);

;// CONCATENATED MODULE: ./client/app.js



console.log('env::', env);
// console.log('viewsCached::', viewsCached);


// conf



// controllers






/// playground























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
const auth = new lib_Auth(authOpts);

// preflight/postflight
const pref1 = async (trx) => { console.log('PREFLIGHT 1 - trx::', trx); };
const pref2 = async (trx) => { console.log('PREFLIGHT 2 - trx::', trx); };
const pref3 = (trx) => { trx.ctrl.showViews(false, true); };
const postf1 = async (trx) => { console.log('POSTFLIGHT 1 - trx::', trx); };
const postf2 = async (trx) => { console.log('POSTFLIGHT 2 - trx::', trx); };
const postf3 = (trx) => { trx.ctrl.showViews(true, true); };

// app
const app = new sys_App();

app
  .controllers([
    controllers_HomeCtrl,
    controllers_QuickstartCtrl,
    controllers_DocsCtrl,
    controllers_ExamplesCtrl,
    controllers_NotfoundCtrl,

    // playground controllers
    playground_Controller_hooksCtrl,
    playground_ModelCtrl,
    playground_View_rgIncCtrl,
    playground_View_loadViewsCtrl,
    playground_View_lazyJSCtrl,
    playground_DataRgCtrl,
    playground_DataRgListenersCtrl,
    playground_CookieCtrl,
    playground_FormCtrl,

    playground_LoginCtrl,
    playground_LoginokCtrl,

    playground_Navig1Ctrl,
    playground_Navig2Ctrl,

    playground_PaginatorCtrl,
    playground_AntiflickCtrl,
    playground_I18nCtrl
  ]);

app
  .auth(auth) // needed for route authGuards
  // .preflight(pref3)
  // .postflight(postf3)
  .debugger($debugOpts_$debugOpts);

app
  .routes(routes)
  .viewsCached(views);

})();

/******/ })()
;
//# sourceMappingURL=app.js.map