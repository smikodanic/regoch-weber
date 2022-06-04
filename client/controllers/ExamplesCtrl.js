import { Controller } from '../../sys/index.js';


class ExamplesCtrl extends Controller {

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


export default ExamplesCtrl;
