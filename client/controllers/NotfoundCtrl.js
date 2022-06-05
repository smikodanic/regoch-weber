import { Controller } from '/sys/index.js';


class NotfoundCtrl extends Controller {

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


export default NotfoundCtrl;
