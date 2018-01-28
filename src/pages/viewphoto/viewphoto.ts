import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ViewphotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewphoto',
  templateUrl: 'viewphoto.html',
})
export class ViewphotoPage {
	imgurl: any;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  	this.imgurl = navParams.get('imgurl');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewphotoPage');
  }

  goBack(){
  	this.viewCtrl.dismiss();
  }

}
