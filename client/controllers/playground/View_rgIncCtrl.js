import { Controller } from '/sys/index.js';


class View_rgIncCtrl extends Controller {

  constructor(app) {
    super();
  }

  async loader() {
    this.setTitle('rgInc() Test');
    this.setDescription('Page Test description');
    this.setKeywords('regoch, playground, test, page');
    this.setLang('en');
    await this.loadView('#layout', 'pages/playground/view-rginc/main.html'); // cheange here inner, outer, sibling, prepend, append
  }

  async rend() { }

}


export default View_rgIncCtrl;
