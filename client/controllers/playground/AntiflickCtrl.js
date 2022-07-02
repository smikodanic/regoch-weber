import { Controller, syslib } from '/sys/index.js';


class AntiflickCtrl extends Controller {

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
    await syslib.util.sleep(2000);
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


export default AntiflickCtrl;
