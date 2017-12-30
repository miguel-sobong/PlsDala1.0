import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { MapPage } from '../map/map';
import { CommonProvider } from '../../providers/common/common';

@IonicPage()
@Component({
  selector: 'page-addtravel',
  templateUrl: 'addtravel.html',
})
export class AddtravelPage {

  toData: any;
  fromData: any;
  addTravelForm: FormGroup;

  constructor(public common: CommonProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, 
    public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, 
    public modalCtrl: ModalController, public plsdala: PlsdalaProvider, public alertCtrl: AlertController) {
  	this.addTravelForm = formBuilder.group({
  		toLocation: '',
      toDate: '',
      fromLocation: '',
      fromDate: ''
  	});
  }

  addTravel(){
    var toDate = new Date(this.addTravelForm.value.toDate);
    var fromDate = new Date(this.addTravelForm.value.fromDate);
    // console.log(toDate.getTime() == fromDate.getTime());
    // console.log(toDate.getTime() > fromDate.getTime())
    var a = new Date(toDate.toLocaleString("en-US", {
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
      })
    );
    console.log(a.getTime());
    if(this.addTravelForm.value.toLocation == '' || this.addTravelForm.value.toDate == '' 
      || this.addTravelForm.value.fromLocation == '' || this.addTravelForm.value.fromDate == ''){
      this.common.isMissingInput();
    }
    else if(toDate.getTime() < fromDate.getTime()){
      let alert = this.alertCtrl.create({
        message: "Arrival date is earlier than departure date",
        buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]});
      alert.present();
    }
    else{
      var loader = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loader.present();
      this.plsdala.addTravel(this.toData, this.fromData, this.addTravelForm.value.toDate, this.addTravelForm.value.fromDate).then(added=>{
        let toast = this.toastCtrl.create({
          message: 'Added to travel list!',
          duration: 3000
        });
        loader.dismiss();
        toast.present();
        this.navCtrl.pop();
      }, error => {
        let toast = this.toastCtrl.create({
          message: error,
          duration: 3000,
          });
          loader.dismiss();
          toast.present();
      });
    }
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
      if(data!=null){
      this.toData = data;
      this.addTravelForm.value.toLocation = data.address;
      console.log(this.addTravelForm.value.toLocation);
      }
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
      if(data!=null){
      console.log(data);
      this.fromData = data;
      this.addTravelForm.value.fromLocation = data.address;
      console.log(this.addTravelForm.value.fromLocation);
      }
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
