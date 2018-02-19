import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
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
  marker: any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams) {
  	this.selectedItem = navParams.get('item');
  }

  ionViewDidLoad() {
    this.initMap();
  }

  getData(){
    console.log("ini");
    return new Promise(resolve=>{
      firebase.database().ref('user_location').child(this.selectedItem.courierId).on("value", snap=>{
        console.log(snap, snap.key, snap.val());
        if(snap.val()){
          // this.updateMarkerPosition(snap.val().lat, snap.val().long);
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
    })
  }

    updateMarkerPosition(x, y){
      console.log("up mark");
      this.marker.setPosition({
        lat: x,
        lng: y
      });
    }

   initMap() {
      let departure = new google.maps.LatLng(9.3068, 123.3054);
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: departure
      });
      
      this.marker = new google.maps.Marker({map: this.map});
      this.directionsDisplay.setMap(this.map);

      this.getData();
    }

  back(){
  	this.navCtrl.pop();
  }

}
