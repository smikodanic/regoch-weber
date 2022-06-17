import { Controller, syslib } from '/sys/index.js';


class I18nCtrl extends Controller {

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


export default I18nCtrl;
