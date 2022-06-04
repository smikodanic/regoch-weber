import { Controller } from '../../sys/index.js';


class QuickstartCtrl extends Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    this.setTitle('Regoch Weber - JS Single Page App Framework');
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


export default QuickstartCtrl;
