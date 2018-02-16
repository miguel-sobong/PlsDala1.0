import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HelpfortravelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-helpfortravel',
  templateUrl: 'helpfortravel.html',
})
export class HelpfortravelPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  slider = [
    {
      image:"assets/imgs/h.png"
    },
    {
      image:"assets/imgs/i.png"
    }
    

  ];

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpfortravelPage');
  }

}
