import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AddtravelPage } from '../addtravel/addtravel';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { TravelPage } from '../../pages/travel/travel';
import { LoginPage } from '../../pages/login/login'
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage 
{
  currentUserId;
  travelList$: Observable<any>;
  UserIsVerified: any;
  searchTravel = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public plsdala: PlsdalaProvider, public toastCtrl: ToastController) {
    this.currentUserId = firebase.auth().currentUser.uid;
    this.initializeItems();
    firebase.database().ref('users/' + firebase.auth().currentUser.uid)
    .child('isVerified')
    .on('value', isVerified => {
        this.UserIsVerified = isVerified.val();
        console.log(isVerified.val());
    });
 }

  addTravel(event){
    this.navCtrl.push(AddtravelPage);
  }

  itemTapped(event, item) {
    console.log(this.UserIsVerified);
    this.navCtrl.push(TravelPage, {
      item: item
    });
  }

  initializeItems(){
    this.travelList$ = this.plsdala.getTravelList()
    .snapshotChanges()
    .map(
      changes => {
        return changes.map(c=>({
          key: c.payload.key, ...c.payload.val()
        })).slice().reverse(); //to reverse order
      });
  }
}
