import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { ReviewPage } from '../review/review';
import { ViewprofilePage } from '../viewprofile/viewprofile';
import { ProfilePage } from '../profile/profile';
import { ViewphotoPage } from '../viewphoto/viewphoto';
import { HelpfortransactionhistoryPage } from '../helpfortransactionhistory/helpfortransactionhistory';

@IonicPage()
@Component({
  selector: 'page-transactionhistory',
  templateUrl: 'transactionhistory.html',
})


export class TransactionhistoryPage {

  helpForTransactionHistory: any;
	loggedInUser: any;
	transactionList$: Observable<any>;
  constructor(public modal: ModalController, public afd: AngularFireDatabase, public loading: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
  	this.helpForTransactionHistory = HelpfortransactionhistoryPage;
    this.loggedInUser = firebase.auth().currentUser.uid;
  	var loader = this.loading.create({
  		content: 'Loading transactions',
  	});
  	loader.present();
	this.transactionList$ = this.afd.list('transactions/done', ref=>ref.orderByChild("timestampDone"))
	.snapshotChanges()
	    .map(
	      changes => {
			loader.dismiss();
	        return changes.map(c=>({
	          key: c.payload.key, ...c.payload.val()
	        })).slice().reverse();
	      });
  }

  review(uid, dbkey){
    this.navCtrl.push(ReviewPage, {item: {uid: uid, dbkey: dbkey}});
  }

    openModal(imgurl){
    this.modal.create(ViewphotoPage, {imgurl: imgurl}).present();
  }

    viewProfile(key){
    if(firebase.auth().currentUser.uid == key)
      this.navCtrl.push(ProfilePage);
    else
      this.navCtrl.push(ViewprofilePage, {item: key});
  }

}
