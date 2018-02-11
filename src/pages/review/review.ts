import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {

  rating: number = 0;
  selectedItem;
  firstname: any;
  lastname: any;
  email: any;
  inputText: string;
  description: any;
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams) {
    this.selectedItem = navParams.get('item');
    console.log(this.selectedItem.dbkey, this.selectedItem.uid);
    this.getUser(this.selectedItem.uid);
  }

  getUser(key){
    firebase.database().ref('users').child(key).once("value", user=>{
      this.firstname = user.val().firstname;
      this.lastname = user.val().lastname;
      this.email = user.val().email;
      this.description = user.val().description;
    });
  }

  rate(index){
    this.rating = index;
    console.log(this.rating);
  }

  submit(){
    var check = true;
    firebase.database().ref('reviews').child(this.selectedItem.uid).once("value",user=>{
      user.forEach(snapshot=>{
        console.log(snapshot.val().transaction);
        snapshot.forEach(snap=>{
          if(((snapshot.val().transaction == this.selectedItem.dbkey) 
            && (snap.key == "reviewer" && snap.val() == firebase.auth().currentUser.uid))){
            check = false;
            return true;
          }
          return false;
        });
        return false;
      })
      // if(user.val().transaction == this.selectedItem.dbkey && user.val().reviewer == this.selectedItem.uid){
      //   this.modalCtrl.create({
      //     message: 'Already reviewed',
      //     duration: 3000
      //   }).present();
      // }
      // else{

      // }
    }).then(_=>{
      if(check == true){
        firebase.database().ref('reviews').child(this.selectedItem.uid).push({})
        .set({rating: this.rating, transaction: this.selectedItem.dbkey, 
          reviewer: firebase.auth().currentUser.uid, description: this.inputText,
          timestamp: firebase.database.ServerValue.TIMESTAMP});
      }
      else{
        firebase.database().ref('reviews').child(this.selectedItem.uid).push({})
        .set({rating: this.rating, transaction: this.selectedItem.dbkey, 
          reviewer: firebase.auth().currentUser.uid, description: this.inputText,
          timestamp: firebase.database.ServerValue.TIMESTAMP});
        this.toastCtrl.create({
          message: 'You have already reviewed this user.',
          duration: 3000
        }).present();
      }
    })

  }
}
