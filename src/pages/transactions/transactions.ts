import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, AlertController } from 'ionic-angular';
import { ViewphotoPage } from '../viewphoto/viewphoto';
import { ViewprofilePage } from '../viewprofile/viewprofile';
import { ProfilePage } from '../profile/profile';
import { TravelPage } from '../travel/travel';
import { ViewmapPage } from '../viewmap/viewmap'
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { HelpfortransactionPage } from '../helpfortransaction/helpfortransaction';
import { TrackPage } from '../track/track';
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

  constructor(public alert: AlertController, public afd: AngularFireDatabase, public modal: ModalController, public loading: LoadingController, 
  	public navCtrl: NavController, public navParams: NavParams) {
    this.help = HelpfortransactionPage;
  	this.courier = true;
  	this.loggedInUser = firebase.auth().currentUser.uid;
  	var loader = this.loading.create({
  		content: 'Loading transactions',
  	});
  	loader.present();
	this.transactionList$ = this.afd.list('transactions/ongoing', ref=>ref.orderByChild("timestamp"))
	.snapshotChanges()
	    .map(
	      changes => {
			loader.dismiss();
	        return changes.map(c=>({
	          key: c.payload.key, ...c.payload.val()
	        })).slice().reverse();
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

  receiverConfirm(transaction){
    firebase.database().ref('transactions').child('ongoing').child(transaction.key).update({
      itemAt: transaction.receiverId
    });

    firebase.database().ref('transactions').child('ongoing').child(transaction.key).once("value", transaction=>{
      firebase.database().ref('transactions').child('done').set(transaction.key);
      var trans =  firebase.database().ref('transactions').child('done').child(transaction.key)
      trans.update({
          travelkey: transaction.val().travelkey,
          senderId: transaction.val().senderId,
          courierId: transaction.val().courierId,
          receiverId: transaction.val().receiverId,
          itemName: transaction.val().itemName,
          images: transaction.val().images,
          senderName: transaction.val().senderName,
          receiverName: transaction.val().receiverName,
          courierName: transaction.val().courierName,
          fromAddress: transaction.val().fromAddress,
          toAddress: transaction.val().toAddress,
          itemAt: transaction.val().senderId,
          timestamp: transaction.val().timestamp,
          timestampDone: firebase.database.ServerValue.TIMESTAMP,
          senderReviewed: false,
          receiverReviewed: false
      })
      if(transaction.val().itemDescription){
        trans.update({
          itemDescription: transaction.val().itemDescription
        });
      }
    }).then(()=>{
      firebase.database().ref('transactions').child('ongoing').child(transaction.key).remove();
    })
  }

  track(courierId){
    this.navCtrl.push(TrackPage, { item: courierId });
  }

  senderCourier(transaction){
    firebase.database().ref('transactions').child('ongoing').child(transaction.key).update({
      itemAt: transaction.courierId
    })
  }

  courierConfirm(transaction){
    this.alert.create({
      title: "Please make sure the item is not illegal",
      message: "<b>By clicking '<i>Yes</i>', you are agreeing that PlsDala will not be liable if the item you are delivering is illegal</b>",
      buttons: [{
        text: "Yes",
        role: 'cancel',
        handler: ()=>{
          this.senderCourier(transaction);
        }
      },
      {
        text: "No",
        role: 'cancel',
      }]
    }).present();
  }

  startTravel(transaction){
    firebase.database().ref('transactions').child('ongoing').once("value", snapshot=>{
      snapshot.forEach(snap=>{
        if(snap.val().travelkey == transaction.travelkey){
          firebase.database().ref('transactions').child('ongoing').child(snap.key).update({
            travelstarted: true
          });
        }
        return false;
      })
    });

    firebase.database().ref('users').child(firebase.auth().currentUser.uid).update({
      isTrackable: true
    });
  }
}
