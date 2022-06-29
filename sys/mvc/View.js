import DataRg from './DataRg.js';


class View extends DataRg {

  constructor() {
    super();
    // window.regochGlob.viewsCached is defined by the App:controllerViewsCached()
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
      if (!!window && !!window.regochGlob && !!window.regochGlob.viewsCached && !!window.regochGlob.viewsCached[viewPath]) { // HTML content from the cached file /cache/views.json
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
    if (!!window && !!window.regochGlob && !!window.regochGlob.viewsCached && !!window.regochGlob.viewsCached[viewPath]) { // HTML content from the cached file /cache/views.json
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
    const doc = parser.parseFromString(window.regochGlob.viewsCached[viewPath], 'text/html');

    // define nodes and string
    let nodes; // array of DOM nodes (Node[])
    let str; // HTML content as string (string)
    if (!cssSel) {
      nodes = /\<title|\<meta|\<link\<base/.test(window.regochGlob.viewsCached[viewPath]) ? doc.head.childNodes : doc.body.childNodes;
      str = window.regochGlob.viewsCached[viewPath];
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
    if (!!window.regochGlob.viewsCached[viewPath]) { // HTML content from the cached file /cache/views.json
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




export default View;
