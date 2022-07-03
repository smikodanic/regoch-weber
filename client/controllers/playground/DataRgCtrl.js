import { Controller, syslib } from '/sys/index.js';


class DataRgCtrl extends Controller {

  constructor(app) {
    super();
  }

  async loader(trx) {
    this.setTitle('DataRg Test');
    this.addCSS(`
      .my-italic {
        font-style: italic;
      }
      .my-red {
        color: red;
      }
      .my-font-size {
        font-size: 21px;
      }
    `, '#myCSS');
    await this.loadView('#layout', 'pages/playground/datarg/main.html', 'inner');
  }

  async init(trx) {
    // initial values for the runFOR example
    this.$model.companies = [
      { name: 'Cloud Ltd', size: 3 },
      { name: 'Roto Ltd', size: 5 },
      { name: 'Zen Ltd', size: 8 },
      { name: 'Den Ltd', size: 9 },
      { name: 'Len Ltd', size: 10 },
      { name: 'Pen Ltd', size: 81 },
      { name: 'Gen Ltd', size: 82 },
      { name: 'Ren Ltd', size: 83 }
    ];

    // initial values for runFOR2
    this.$model.herbals = [];

    // initial for runFORnested
    // this.$model.fields = ['name', 'from', 'to', 'duration']; // data-rg-print="$model.trains.$i2.($model.fields.$i3) @@ append"
    this.fields = ['name', 'from', 'to', 'duration']; // data-rg-print="$model.trains.$i2.(fields.$i3) @@ append"
    this.$model.trains = [
      { name: 'TRAIN-A', from: 'DU', to: 'ST', duration: 55 },
      { name: 'TRAIN-B', from: 'ST', to: 'KN', duration: 66 }
    ];

    // initial value for runREPEAT
    this.$model.multiplikator = 3;

    // initial values for the runSWITCH example
    this.$model.myColor = 'green';

    // initail value for data-rg-print with the pipe
    this.$model.longText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard.';
    this.$model.obj4json = { x: 555 };

    // text with the HTML
    this.$model.htmlText = 'The best <b style="color:red">man</b> friend is: <i data-rg-if="$model.bestFriend $not()">NOBODY</i> <i data-rg-if="$model.bestFriend $eq(Dog)">DOG</i>';

    // initial value for the data-rg-model
    this.$model.myMDL = { name: 'Smokie', animal: 'horse', article: 'Lorem ipsumus ...' };

    // initial value for the data-rg-checked
    this.$model.checks1 = ['Tin'];

    this.$model.bander = {
      name: 'Johnny',
      animal: 'dog',
      article: 'Some article ...'
    };

    console.log(this.someNum_1, this.$model.obj4json);
  }


  // if rend() is not used then default render() is executed
  // async rend() {
  //   this.renderGens();
  //   await syslib.util.sleep(10);
  //   this.renderNonGens();
  //   await syslib.util.sleep(10);
  //   await this.renderLsns();
  // }






  /*********** GENERATORS **********/

  // show array elements by using data-rg-for
  async runFOR() {
    this.$model.companies = [
      { name: 'Cloud2 Ltd', size: 3 },
      { name: 'Roto2 Ltd', size: 5 },
      { name: 'Zen2 Ltd', size: 8 },
      { name: 'Den2 Ltd', size: 81 },
      { name: 'Len2 Ltd', size: 82 },
      { name: 'Pen2 Ltd', size: 83 },
      { name: 'Gen2 Ltd', size: 84 },
      { name: 'Ren2 Ltd', size: 855 }
    ];
  }

  // show array elements by using data-rg-for
  async runFOR2() {
    this.skipNum = 10;
    this.$model.herbals = ['corn', 'banana', 'plum', 'straw'];
  }


  // run data-rg-for inside data-rg-for
  async runFORnested() {
    this.$model.trains = [
      { name: 'TRAIN1', from: 'OS', to: 'NA', duration: 2 },
      { name: 'TRAIN2', from: 'OS', to: 'ZG', duration: 3 },
      { name: 'TRAIN3', from: 'SB', to: 'VK', duration: 5 }
    ];
  }


  // parse interpolated text in variable name
  async runFOR_parseInterpolated() {
    this.$model.kids = [
      { _id: 111, name: 'tom' },
      { _id: 222, name: 'jill' },
      { _id: 333, name: 'ben' }
    ];

    // await syslib.util.sleep(700);

    // print in the variable names with the interpolated text
    this.$model['kid_111'] = 'TOM';
    this.$model.kid_222 = 'JILL';
    this.$model.kid_333 = 'BEN';
  }



  // repeat the data-rg-repeat num times
  async runREPEAT(num) {
    this.$model.pets = [];
    this.$model.multiplikator = num;
  }


  // print initial value and after 1300ms the modified value
  async runPRINT() {
    this.$model.product = {
      name: 'Toyota',
      address: {
        city: 'London'
      },
      colors: ['red', 'green']
    };

    await syslib.util.sleep(1300);

    this.$model.product = { ...this.$model.product, ...{ address: { city: 'Zagreb' } } };

    await syslib.util.sleep(1300);

    this.$model.product.colors = ['blue', 'orange'];
    this.$modeler.use('product').mrender(); // call render() because this.$model.product.colors is not Proxy and render() will not be trigered
  }


  printHTML() {
    this.$model.bestFriend = 'Dog';
  }




  /*********** NON-GENERATORS **********/

  // toggle if and show hide elements
  toggleIF() {
    this.$model.ifX = !this.$model.ifX;
    console.log('toggleIF::', this.$model.ifX);
  }

  // toggle text color by using data-rg-elem
  runELEM() {
    this.toggle = !this.toggle;
    if (this.toggle) {
      this.$rg.elems.myElem.style.color = 'blue';
    } else {
      this.$rg.elems.myElem.style.color = 'silver';
    }
  }

  runIF() {
    this.myNum = 5;
    this.myStr = 'some str';
    this.myArr = [5, 4, 'lorem'];

    this.$model.ifY = {
      bool: true,
      num: 5,
      str: 'some str'
    };
  }

  async toggleIF2() {
    this.$model.continent = !!this.$model.continent ? '' : 'Europe';
  }


  // Here are two tests. First will show only one switchcase when red, blue, green is typed in the input field. Another test will show multiple switchcases.
  runSWITCH() {
    this.$model.obj = { myColors: ['green2', 'blue2'] };
  }

  // add CSS classes 'my-red' and 'my-font-size' to the element data-rg-class="myKlases"
  runCLASS() {
    this.$model.myKlases = ['my-red', 'my-font-size'];
  }

  // add style attribute values
  runSTYLE(fontSize, color) {
    this.$model.myStajl = { fontSize, color };
  }

  // define image src attribute
  runSRC() {
    this.$model.imageURL = 'http://cdn.dex8.com/img/turnkey_tasks/scraper_free.png';
  }


  runATTR() {
    this.$model.someURL = 'https://www.adsuu.com';
  }


  toggleDISABLED() {
    this.$model.isDisabled = !this.$model.isDisabled;
  }


  setVALUES() {
    this.$model.input_text01 = 'some text';
    this.$model.input_text_undefined;
    this.$model.input_text_obj = { a: 22 };
    this.$model.input_numberAsString = '157';
    this.$model.input_text01 = 'some text';
  }


  setCHECKED() {
    this.$model.checks1 = ['Pin', 'Tin'];
  }


  toggleSPINNER() {
    this.$model.showSpinner = !this.$model.showSpinner;
  }


  showSetinitial() {
    console.log('someNum_1::', typeof this.someNum_1, this.someNum_1);
    console.log('someNum_2::', typeof this.someNum_2, this.someNum_2);
  }

}


export default DataRgCtrl;
