import { Controller, syslib } from '../../sys/index.js';


class Navig1Ctrl extends Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    console.log('Navig1 loader::', trx);
    this.setTitle('Navig Test - Page 1');
    await this.loadView('#layout', 'pages/playground/navig/primary1.html', 'inner');
    console.log(this);
  }


  async destroy(pevent) {
    console.log('Navig1 destroy::', pevent);
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


export default Navig1Ctrl;
