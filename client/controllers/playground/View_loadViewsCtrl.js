import { Controller } from '/sys/index.js';


class View_loadViewsCtrl extends Controller {

  constructor(app) {
    super();
  }


  async loader(trx) {
    this.setTitle('loadViews() Test');

    await this.loadViews([
      ['#layout', 'pages/playground/view-loadviews/main.html', 'sibling'],
      ['#layout.html#part1', 'pages/playground/view-loadviews/part1.html'],
      ['#layout.html#part2', 'pages/playground/view-loadviews/part2.html', 'append'],
      ['#layout.html#part3', 'pages/playground/view-loadviews/part3.html', 'prepend']
    ], true); // isAsync is true
  }

}


export default View_loadViewsCtrl;
