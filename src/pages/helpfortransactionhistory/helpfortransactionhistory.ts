import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HelpfortransactionhistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-helpfortransactionhistory',
  templateUrl: 'helpfortransactionhistory.html',
})
export class HelpfortransactionhistoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  slider = [
    
    {
      image:"assets/imgs/j.png"
    }
    

  ];

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpfortransactionhistoryPage');
  }

}
