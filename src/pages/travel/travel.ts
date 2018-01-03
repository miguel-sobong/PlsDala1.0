import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AdditemPage } from '../additem/additem';
import { ChatPage } from '../chat/chat';

declare var google;

@IonicPage()
@Component({
  selector: 'page-travel',
  templateUrl: 'travel.html',
})
export class TravelPage {
  @ViewChild('map') mapElement: ElementRef;
  selectedItem: any;
  map;
  poster = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    this.selectedItem = navParams.get('item');
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

  ionViewDidLoad() {
    if(localStorage.getItem('email')===this.selectedItem.email){
      this.poster = true;
    }
  	this.initMap();
    console.log('ionViewDidLoad TravelPage');
  }

  addItem(event){
    this.navCtrl.push(AdditemPage);
  }

  messageUser(event){
    this.navCtrl.push(ChatPage,{
      item: this.selectedItem
    });
  }
}
