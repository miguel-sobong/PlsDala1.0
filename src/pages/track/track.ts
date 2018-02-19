import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

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

  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams) {
  	this.selectedItem = navParams.get('item');
  }

  ionViewDidLoad() {
  	this.initMap();
  }

   initMap() {
      //change to user location later
      let from = new google.maps.LatLng(this.selectedItem.fromX, this.selectedItem.fromY);
      let to = new google.maps.LatLng(this.selectedItem.toX, this.selectedItem.toY);
      this.map = new google.maps.Map(document.getElementById('map'), {
          center: from
      });
      let directionsService = new google.maps.DirectionsService;
      let directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(this.map);
      directionsService.route({
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode['DRIVING']
      }, (res, status) => {
        if(status == google.maps.DirectionsStatus.OK){
          directionsDisplay.setDirections(res);
        } else {
          this.toastCtrl.create({
            message: 'Cannot get directions',
            duration: 3000
          }).present();
        }
      });
    }

  back(){
  	this.navCtrl.pop();
  }

}
