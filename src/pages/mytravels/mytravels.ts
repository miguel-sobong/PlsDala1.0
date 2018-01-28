import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddtravelPage } from '../addtravel/addtravel';
import { MytravelPage } from '../../pages/mytravel/mytravel';
import { Observable } from 'rxjs/Observable';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-mytravels',
  templateUrl: 'mytravels.html',
})
export class MytravelsPage {

  travelList$: Observable<any>;
  currentUserId;

  constructor(public plsdala: PlsdalaProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.currentUserId = firebase.auth().currentUser.uid;
    this.travelList$ = this.plsdala.getTravelList()
    .snapshotChanges()
    .map(
      changes => {
        return changes.map(c=>({
          key: c.payload.key, ...c.payload.val()
        })).slice().reverse(); //to reverse order
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MytravelsPage');
  }

  addTravel(event){
    this.navCtrl.push(AddtravelPage);
  }

  itemTapped(event, item) {
    this.navCtrl.push(MytravelPage, {
      item: item
    });
  }
}
