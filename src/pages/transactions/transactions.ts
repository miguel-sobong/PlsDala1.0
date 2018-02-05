import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ViewphotoPage } from '../viewphoto/viewphoto';
import { ViewprofilePage } from '../viewprofile/viewprofile';
import { ProfilePage } from '../profile/profile';
import { TravelPage } from '../travel/travel';
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
	transactionList: Array<any>;

  constructor(public modal: ModalController, public loading: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
	this.transactionList = [];
  	this.receiver = true;
  	var loader = this.loading.create({
  		content: 'Loading transactions',
  	});
  	loader.present();
	firebase.database().ref('user_transactions').child(firebase.auth().currentUser.uid)
	.child("receiver").once("value", snapshot=>{
		loader.dismiss();
		if(snapshot.val()){
			snapshot.forEach(snap=>{
				snap.forEach(transactionkey=>{
					firebase.database().ref('transactions').child(transactionkey.key)
					.once("value", data=>{
						this.transactionList.push(data.val());
					});
					console.log(transactionkey.key);
					return false;
				})
				return false;
			})
			console.log(this.transactionList);
		}else{
			return;
		}
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
	  	var loader = this.loading.create({
	  		content: 'Loading transactions'
	  	})
	  	loader.present();
	  	this.receiver = false;
	  	this.courier = false;
	  	this.sender = false;
	  	if(tab == 'sender'){
	  		this.sender = true;
		  	firebase.database().ref('user_transactions').child(firebase.auth().currentUser.uid)
		  	.child("sender").once("value", snapshot=>{
		  		loader.dismiss();
		  		if(snapshot.val()){
		  			console.log(snapshot.val());

		  		}else{
		  			return;
		  		}
		  	});
	  	}
	  	else if(tab == 'courier'){
	  		this.courier = true;
		  	firebase.database().ref('user_transactions').child(firebase.auth().currentUser.uid)
		  	.child("courier").once("value", snapshot=>{
		  		loader.dismiss();
		  		if(snapshot.val()){
		  			console.log(snapshot.val());
		  		}else{
		  			return;
		  		}
		  	});
	  	}
	  	else{
	  		this.receiver = true;
		  	firebase.database().ref('user_transactions').child(firebase.auth().currentUser.uid)
		  	.child("receiver").once("value", snapshot=>{
		  		loader.dismiss();
		  		if(snapshot.val()){
		  			console.log(snapshot.val());

		  		}else{
		  			return;
		  		}
		  	});
	  	}
  	}
  }

  viewProfile(key){
    if(firebase.auth().currentUser.uid == key)
      this.navCtrl.push(ProfilePage);
    else
      this.navCtrl.push(ViewprofilePage, {item: key});
  }

}
