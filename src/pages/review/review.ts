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
  public isHover: boolean =  false;

  selectedItem;
  firstname: any;
  lastname: any;
  email: any;
  inputText: string;
  description: any;
  temp;
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams) {
    var timestamp;
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


rate = (r) => (this.rating = r);

  // rate(index){
  //   this.rating = index;
  //   console.log(this.rating);
  // }

  submit(){
    this.temp = firebase.database().ref("temp").child(firebase.auth().currentUser.uid).push({timestamp: firebase.database.ServerValue.TIMESTAMP});
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
    }).then(_=>{
      new Promise(resolve=>{
        firebase.database().ref('transactions').child(this.selectedItem.dbkey).child("timestampDone").once("value", snap=>{
          firebase.database().ref("temp").child(this.temp.key).once("value", time =>{
            if(snap.val() + 604800000 > time.val()){
              resolve(true);
            }
            else{
              this.toastCtrl.create({
                message: 'Cannot review user anymore. One week has already passed',
                duration: 3000
              }).present();
              resolve(false)
            }
          });
        })
      }).then(data=>{
        firebase.database().ref("temp").child(firebase.auth().currentUser.uid).remove();
        if(data){
          if(check == true){
            if(this.rating && this.inputText){
              firebase.database().ref('reviews').child(this.selectedItem.uid).push({})
              .set({rating: this.rating, transaction: this.selectedItem.dbkey, 
                reviewer: firebase.auth().currentUser.uid, description: this.inputText,
                timestamp: firebase.database.ServerValue.TIMESTAMP});
              
              firebase.database().ref('users').child(this.selectedItem.uid).once("value", snap=>{
                firebase.database().ref('users').child(this.selectedItem.uid).update({
                  rating: snap.val().rating + this.rating,
                  totalrate: snap.val().totalrate + 1
                })
              })

              this.toastCtrl.create({
                message: 'Successfully reviewed user',
                duration: 3000
              }).present();

              this.navCtrl.pop();
            }
            else{
              this.toastCtrl.create({
                message: 'Please have input in all fields',
                duration: 3000
              }).present();
            }
          }
          else{
            this.toastCtrl.create({
              message: 'You have already reviewed this user for this transaction.',
              duration: 3000
            }).present();
          }
        }
      });
    })
  }
}
