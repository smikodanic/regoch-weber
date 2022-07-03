import { Controller } from '/sys/index.js';


class View_loadViewsCtrl extends Controller {

  constructor(app) {
    super();
  }


  async loader(trx) {
    this.setTitle('loadViews() Test');

    await this.loadViews([
      ['#layout', 'pages/playground/view-loadviews/main.html', 'sibling'],
      ['#part1', 'pages/playground/view-loadviews/part1.html'],
      ['#part2', 'pages/playground/view-loadviews/part2.html', 'append'],
      ['#part3', 'pages/playground/view-loadviews/part3.html', 'prepend']
    ], true); // isAsync is true
  }

}


export default View_loadViewsCtrl;
