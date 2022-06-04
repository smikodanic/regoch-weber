import { Controller, syslib } from '../../sys/index.js';


class LoginCtrl extends Controller {

  constructor(app) {
    super();
    this.$fridge.formLogin = new syslib.Form('loginForm');
  }

  async loader(trx) {
    this.setTitle('Auth Login Test');
    await this.loadView('#layout', 'pages/playground/login/main.html');
  }

  async init() {
    // this.formLogin = new syslib.Form('loginForm');
  }

  async tryLogin() {
    const username = this.$fridge.formLogin.getControl('username', false); // false will not convert the type, for example: 12345 will stay string
    const password = this.$fridge.formLogin.getControl('password', false); // false will not convert the type, for example: 12345 will stay string
    try {
      const creds = { username, password };
      console.log('creds::', creds);
      const resp = await this.$auth.login(creds);
      console.log('tryLogin::', username, password, resp);
    } catch (err) {
      console.error(err);
    }
  }



}


export default LoginCtrl;
