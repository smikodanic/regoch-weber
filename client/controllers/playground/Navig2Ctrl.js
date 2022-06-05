import { Controller, syslib } from '/sys/index.js';


class Navig2Ctrl extends Controller {

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
    syslib.navig.goto(url);
  }

  runBACK() {
    syslib.navig.back();
  }

  runFORWARD() {
    syslib.navig.forward();
  }

  runRELOAD() {
    syslib.navig.reload();
  }



}


export default Navig2Ctrl;
