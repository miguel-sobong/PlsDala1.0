import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-transactionhistory',
  templateUrl: 'transactionhistory.html',
})
export class TransactionhistoryPage {

	loggedInUser: any;
	transactionList$: Observable<any>;
  constructor(public afd: AngularFireDatabase, public loading: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
  	  	this.loggedInUser = firebase.auth().currentUser.uid;
  	var loader = this.loading.create({
  		content: 'Loading transactions',
  	});
  	loader.present();
	this.transactionList$ = this.afd.list('transactions/')
	.snapshotChanges()
	    .map(
	      changes => {
			loader.dismiss();
	        return changes.map(c=>({
	          key: c.payload.key, ...c.payload.val()
	        }));
	      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionhistoryPage');
  }

}
