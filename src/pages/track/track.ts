import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';

declare var google;

@IonicPage()
@Component({
  selector: 'page-track',
  templateUrl: 'track.html',
})
export class TrackPage {
 	@ViewChild('map') mapElement: ElementRef;
	selectedItem: any;
 	map;
  from;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  trackNode: any;
  doneNode: any;

  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, public alert: AlertController) {
  	this.selectedItem = navParams.get('item');
    this.doneNode = firebase.database().ref('transactions/ongoing');
    this.doneNode.on("child_removed", snapshot=>{
      if(snapshot.key  == this.selectedItem.key){
        this.navCtrl.pop();
        this.alert.create({
          title: 'Receiver has the item',
          message: 'Tracking is now done',
          buttons: [{
            text: 'Ok',
            role: 'cancel'
          }]
        }).present();
      }      
    });
  }

  ionViewDidLoad() {
    this.initMap();
  }

  getData(){

     this.trackNode = firebase.database().ref('user_location').child(this.selectedItem.courierId);
     this.trackNode.on("value", snap=>{
          if(snap.val()){
            this.directionsService.route({
              origin: {lat: snap.val().lat, lng: snap.val().long},
              destination: {lat: this.selectedItem.toX, lng: this.selectedItem.toY},
              travelMode: google.maps.TravelMode['DRIVING']
            }, (res, status) => {
              if(status == google.maps.DirectionsStatus.OK){
                this.directionsDisplay.setDirections(res);
              } else {
                this.toastCtrl.create({
                  message: 'Cannot get directions',
                  duration: 3000
                }).present();
              }
            });
          }
          else{
            this.toastCtrl.create({
              message: "Could not get courier location",
              duration: 3000
            }).present();
          }
        });
   }

   ionViewDidLeave(){
     this.trackNode.off();
     this.doneNode.off();
   }


   initMap() {
      let departure = new google.maps.LatLng(9.3068, 123.3054);
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: departure
      });
      
      this.directionsDisplay.setOptions({map: this.map, preserveViewport: true});

      this.getData();
    }

    ionV

  back(){
  	this.navCtrl.pop();
  }

}
