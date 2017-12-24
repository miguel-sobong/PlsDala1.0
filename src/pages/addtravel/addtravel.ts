import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapPage } from '../map/map';
/**
 * Generated class for the AddtravelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addtravel',
  templateUrl: 'addtravel.html',
})
export class AddtravelPage {

  addTravelForm: FormGroup;

  constructor(public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  	this.addTravelForm = formBuilder.group({
  		toLocation: '',
      aDate: '',
      fromLocation: '',
      dDate: ''
  	})
  }

  toLocation(){
    let modal = this.modalCtrl.create(MapPage, {
      data: {
        x: '',
        y: '',
        address: ''
      }
    });
    modal.onDidDismiss(data=>{
      console.log(data);
      var x = data.x;
      var y = data.y;
      var address = data.address;
      this.addTravelForm.value.toLocation = address;
      console.log(this.addTravelForm.value.toLocation);
    });
    modal.present();
  }

  fromLocation(){
    let modal = this.modalCtrl.create(MapPage, {
      data: {
        x: '',
        y: '',
        address: ''
      }
    });
    modal.onDidDismiss(data=>{
      console.log(data);
      var x = data.x;
      var y = data.y;
      var address = data.address;
      this.addTravelForm.value.fromLocation = address;
      console.log(this.addTravelForm.value.fromLocation);
    });
    modal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewiDydLoad AddtravelPage');
  }

  Cancel(){
    this.navCtrl.pop();
  }
  // change(location){
  // 	this.addTravelForm.value.location = location;
  // }

}
