import { Controller, syslib } from '/sys/index.js';


class AntiflickCtrl extends Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    console.log('loader() -- trx::', trx);
    this.setTitle('Antiflick Test');

    await this.loadView('#layout', 'pages/playground/antiflick/main.html');
  }

  async init(trx) {
    await syslib.util.sleep(5500);
    this.$model.showBtn = true;
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
