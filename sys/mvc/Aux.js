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
   * Get true/false directly from the controller/model value: data-rg-if="is_active", data-rg-if="$model.is_active"
   * Caclulate comparison with $ operators, simillar to mongoDB: data-rg-if="age $eq(18)", data-rg-if="age $eq(this.myAge)", data-rg-if="age $eq($model.myAge)"
   * @param {any} attrVal - data-rg-if attribute value, for example: is_active, age $gt(this.ctrlProp), age $eq($model.myAge)
   * @returns {boolean}
   */
  _calcComparison_B(attrVal) {
    const propCompSplitted = attrVal.split(/\s+\$/); // ['age', 'eq($model.myAge)']

    const prop = propCompSplitted[0].trim(); // age
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


export default Aux;
