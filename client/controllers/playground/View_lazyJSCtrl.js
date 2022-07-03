import { Controller } from '/sys/index.js';


class View_lazyJSCtrl extends Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    this.setTitle('lazyJS() Test');
    this.unloadCSS(['/client/assets/css/switch-box.css']);
    await this.loadView('#layout', 'pages/playground/view-lazyjs/main.html');
  }

  async destroy() {
    this.unlazyAllJS();
    this.emptyView('#layout');
  }


  popup() {
    window.swal({
      icon: 'success',
      text: 'Hello Regoč Weber !',
    });
    $.notify('Hello Regoč');
  }

  // button function
  async lazyAll() {
    console.info('Loading...');
    await this.lazyJS([
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js', // must be loaded before notify.min.js because notify require jQuery
      'https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js',
    ], 1300); // wait 1.3 seconds for next script to load
    console.info('Scripts are loded. Now click on the POPUP button.');
  }

  lazyTest() {
    this.lazyJS([
      '/client/assets/regoch/js/lazyTest2.js'
    ], 1000);
  }

  unlazyAll() {
    this.unlazyAllJS();
  }

  unlazySweetalert() {
    this.unlazyJS([
      'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js'
    ]);
  }


}



export default View_lazyJSCtrl;
