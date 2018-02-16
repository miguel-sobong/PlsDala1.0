import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HelpfortransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-helpfortransaction',
  templateUrl: 'helpfortransaction.html',
})
export class HelpfortransactionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
  slider = [
    
    {
      image:"assets/imgs/l.png"
    },
    {
      image:"assets/imgs/n.png"
    },
    {
      image:"assets/imgs/o.png"
    }
    

  ];

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpfortransactionPage');
  }

}
