import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { ViewprofilePage } from '../viewprofile/viewprofile';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-choosereceiver',
  templateUrl: 'choosereceiver.html',
})
export class ChoosereceiverPage {

	userlist: Observable<any>;
	selectedUser;
	user;

  constructor(public viewCtrl: ViewController, public loadingCtrl: LoadingController, public plsdala: PlsdalaProvider, 
    public navCtrl: NavController, public navParams: NavParams) {
  	var loader = this.loadingCtrl.create({
  		content: 'Getting user list'
  	});
  	this.user = firebase.auth().currentUser.uid;
  	loader.present();
    this.userlist = this.plsdala.getUserList()
    .snapshotChanges()
    .map(
      changes => {
        return changes.map(c=>({
          key: c.payload.key, ...c.payload.val()
        }));
      })
    loader.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChoosereceiverPage');
  }

  viewProfile(key){
      this.navCtrl.push(ViewprofilePage, {item: key});
  }

  AddReceiver(item){
    this.viewCtrl.dismiss({
      name: `${item.firstname} ${item.lastname}(${item.email})`,
      uid: item.id
    });
  }

  Cancel(){
    this.navCtrl.pop();
  }

}
