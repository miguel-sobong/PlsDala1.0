import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AdditemPage } from '../additem/additem';
import { ChatPage } from '../chat/chat';
import { ViewprofilePage } from '../viewprofile/viewprofile';
import { ProfilePage } from '../profile/profile';
import { HelpfortravelPage } from '../helpfortravel/helpfortravel'
import * as firebase from 'firebase';

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
  user;
  UserIsVerified;
  help: any;
  posterName: string;
  posterImage: string;

  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    var loader = this.loadingCtrl.create({
      content: 'Getting user information'
    });
    this.help = HelpfortravelPage;
    firebase.database().ref('users/' + firebase.auth().currentUser.uid)
    .child('isVerified')
    .on('value', isVerified => {
        this.UserIsVerified = isVerified.val()
    });
    loader.present();
    this.selectedItem = navParams.get('item');
    console.log(this.selectedItem);
    this.user = firebase.auth().currentUser.uid;
    firebase.database().ref('users/')
    .child(this.selectedItem['userId'])
    .once('value', user => {
      this.posterName = user.val().firstname + ' ' + user.val().lastname + ' (' + user.val().username + ')';
      this.posterImage = user.val().profileimage;
      loader.dismiss();
    });
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
  	this.initMap();
    console.log('ionViewDidLoad TravelPage');
  }

  addItem(event){
    this.navCtrl.push(AdditemPage, {item: this.selectedItem});
  }

  messageUser(event){
    console.log(this.selectedItem);
    this.navCtrl.push(ChatPage,{
      item: this.selectedItem
    });
  }

  viewProfile(){
    if(this.selectedItem['userId'] == this.user)
      this.navCtrl.push(ProfilePage);
    else
      this.navCtrl.push(ViewprofilePage, {item: this.selectedItem['userId']});
  }
}
