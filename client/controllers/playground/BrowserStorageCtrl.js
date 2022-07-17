import { Controller, syslib } from '/sys/index.js';


class BrowserStorageCtrl extends Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    this.setTitle('BrowserStorage Test');
    await this.loadView('#layout', 'pages/playground/browserstorage/main.html', 'inner');
  }

  async init() {
    this.sLocal = new syslib.BrowserStorage({ storageType: 'local' }, true);
    this.sSess = new syslib.BrowserStorage({ storageType: 'session' }, true);
  }


  test_put() {
    console.log(this.first_name);
    this.sLocal.put('first_name', this.first_name);
    this.sSess.put('first_name', this.first_name);
  }

  test_putObject() {
    console.log(this.some_obj);
    this.sLocal.putObject('some_obj', this.some_obj);
    this.sSess.putObject('some_obj', this.some_obj);
  }

  test_getAll() {
    this.$model.localStorageValues = this.sLocal.getAll();
    console.log('LOCAL:', this.$model.localStorageValues);
    this.$model.sessionStorageValues = this.sSess.getAll();
    console.log('SESS:', this.$model.sessionStorageValues);
  }

  test_get() {
    this.$model.localStorageVal = this.sLocal.get(this.storageName);
    this.$model.sessionStorageVal = this.sSess.get(this.storageName);
  }

  test_getObject() {
    this.$model.localStorageVal2 = this.sLocal.getObject(this.storageName2);
    this.$model.sessionStorageVal2 = this.sSess.getObject(this.storageName2);
  }

  test_remove() {
    this.sLocal.remove(this.storageName3);
    this.sSess.remove(this.storageName3);
  }

  test_removeAll() {
    this.sLocal.removeAll();
    this.sSess.removeAll();
  }




}


export default BrowserStorageCtrl;
