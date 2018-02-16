import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ViewphotoPage } from '../viewphoto/viewphoto';
import { ViewprofilePage } from '../viewprofile/viewprofile';
import { ProfilePage } from '../profile/profile';
import { TravelPage } from '../travel/travel';
import { ViewmapPage } from '../viewmap/viewmap'
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { HelpfortransactionPage } from '../helpfortransaction/helpfortransaction';
import * as firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {
	sender: any;
	courier: any;
	receiver: any;
	transactionList$: Observable<any>;
	loggedInUser;
  help: any;

  constructor(public afd: AngularFireDatabase, public modal: ModalController, public loading: LoadingController, 
  	public navCtrl: NavController, public navParams: NavParams) {
    this.help = HelpfortransactionPage;
  	this.courier = true;
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

  openModal(imgurl){
    this.modal.create(ViewphotoPage, {imgurl: imgurl}).present();
  }

  active(tab){
  	if(this.receiver == true && tab == 'receiver'){
  		return;
  	}
  	else if(this.courier == true && tab == 'courier'){
  		return;
  	}
  	else if(this.sender == true && tab == 'sender'){
  		return;
  	}
  	else{
	  	this.receiver = false;
	  	this.courier = false;
	  	this.sender = false;
	  	if(tab == 'sender'){
	  		this.sender = true;
	  	}
	  	else if(tab == 'courier'){
	  		this.courier = true;
	  	}
	  	else{
	  		this.receiver = true;
	  	}
  	}
  }

  viewProfile(key){
    if(firebase.auth().currentUser.uid == key)
      this.navCtrl.push(ProfilePage);
    else
      this.navCtrl.push(ViewprofilePage, {item: key});
  }

  itemTapped(transaction){
  	this.navCtrl.push(ViewmapPage, {
  		item: transaction
  	});
  }

  senderConfirm(transaction){
  	firebase.database().ref('transactions').child(transaction.key).once("value", snap=>{
  		console.log(snap.key, snap.val());
  		if(snap.val().itemAt == snap.val().senderId && snap.val().courierConfirm == true){
  			firebase.database().ref('transactions').child(transaction.key).update({
  				senderConfirm: false,
  				itemAt: snap.val().courierId,
  				courierConfirm: false
  			});

        firebase.database().ref('users').child(snap.val().courierId).update({
          isTrackable: true
        });
  		}
  		else{
		  	firebase.database().ref('transactions').child(transaction.key).update({
		  		senderConfirm: true
		  	});
		  }
  	});
  }

  courierConfirm(transaction){
  	firebase.database().ref('transactions').child(transaction.key).once("value", snap=>{
  		if(snap.val().itemAt == snap.val().senderId && snap.val().senderConfirm == true){
  			firebase.database().ref('transactions').child(transaction.key).update({
  				senderConfirm: false,
  				itemAt: snap.val().courierId,
  				courierConfirm: false
  			})

        firebase.database().ref('users').child(snap.val().courierId).update({
          isTrackable: true
        });
  		}
  		else if(snap.val().itemAt == snap.val().courierId && snap.val().receiverConfirm == true){
  			firebase.database().ref('transactions').child(transaction.key).update({
  				isDone: true,
  				courierConfirm: true
  			})

        firebase.database().ref('users').child(snap.val().courierId).update({
          isTrackable: false
        });
  		}
  		else{
		  	firebase.database().ref('transactions').child(transaction.key).update({
		  		courierConfirm: true
		  	});
  		}
  	});
  }

  receiverConfirm(transaction){
  	firebase.database().ref('transactions').child(transaction.key).once("value", snap=>{
  		console.log(snap.key, snap.val());
  		if(snap.val().courierConfirm == true){
  			firebase.database().ref('transactions').child(transaction.key).update({
  				isDone: true
  			});


        firebase.database().ref('users').child(snap.val().courierId).update({
          isTrackable: false
        });
  			
  		}
  		else{
		  	firebase.database().ref('transactions').child(transaction.key).update({
		  		receiverConfirm: true
		  	});	
  		}
  	});
  }
}
