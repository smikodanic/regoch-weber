import { Controller } from '/sys/index.js';


class LoginokCtrl extends Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    this.setTitle('Auth Login OK');
    await this.loadView('#layout', 'pages/playground/loginok/main.html');
  }

  async tryLogout() {
    try {
      await this.$auth.logout(100);
    } catch (err) {
      console.error(err);
    }
  }




}


export default LoginokCtrl;
