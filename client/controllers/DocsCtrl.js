import { Controller } from '/sys/index.js';


class DocsCtrl extends Controller {

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


export default DocsCtrl;
