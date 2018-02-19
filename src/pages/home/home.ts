import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AddtravelPage } from '../addtravel/addtravel';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { TravelPage } from '../../pages/travel/travel';
import { LoginPage } from '../../pages/login/login'
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { HelpPage } from '../help/help';

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
  ListOfitems: Array<any>;
  ListOfitems2nd: Array<any>;  
  helpPage;

  constructor(public authenticationProvider: AuthenticationProvider, public alert: AlertController,
   public navCtrl: NavController, public navParams: NavParams, 
    public plsdala: PlsdalaProvider, public toastCtrl: ToastController, private datepipe:DatePipe) {
    this.helpPage = HelpPage;
    this.ListOfitems = [];
    this.ListOfitems2nd = [];
    var checked = false;
    this.currentUserId = firebase.auth().currentUser.uid;
    this.initializeItems();
    this.checkVerification();
  }

  addTravel(event){
    this.navCtrl.push(AddtravelPage);
  }

  Round(number){
    return Math.round(number);
  }

  checkVerification(){
   var userRef = firebase.database().ref('users').child(firebase.auth().currentUser.uid);

   userRef.child('isVerified')
    .once('value', isVerified => {
      this.UserIsVerified = isVerified.val();
    });

   var verificationNode = firebase.database().ref('users').child(firebase.auth().currentUser.uid);
   verificationNode.on("child_changed", changes =>{
   	console.log(changes.key);
     if(changes.key == "isVerified"){
       this.UserIsVerified = changes.val();
       if(changes.val() == true && localStorage.getItem("verified") == "false"){
             this.alert.create({
               title: "Congratulations! You are now verified",
               message: "You can now add a travel plan and send items for other users to deliver!",
               inputs: [{
                 type: 'checkbox',
                 label: 'Don\'t show this again',
                 handler: data=>{
                   localStorage.setItem("verified", ""+data.checked+"");
                 }
               }], 
               buttons: [{
                 text: "Ok",
                 role: 'cancel',
               }]
             }).present();
       }
     }
     else if(changes.key == "isDeclined"){
       if(changes.val() == true && localStorage.getItem("decline") == "false"){
             this.alert.create({
               title: "Sorry, your verification is declined",
               inputs: [{
                 type: 'checkbox',
                 label: 'Don\'t show this again',
                 handler: data=>{
                   localStorage.setItem("decline", ""+data.checked+"");
                 }
               }], 
               buttons: [{
                 text: "Ok",
                 role: 'cancel',
               }]
             }).present();
       }
     }
    verificationNode.off();
   });
  }

  itemTapped(event, item) {
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
          })).slice().reverse();//to reverse order
        })

        this.travelList$.subscribe(res => {
          this.ListOfitems = [];
          this.ListOfitems2nd=[];
          var date = new Date();
          var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          var today = new Date(today);
          for(let i=0;i<res.length;i++){
            var checkDate = new Date(res[i].fromDate);
            if(checkDate < today) { continue };
              firebase.database().ref('users').child(res[i].userId).once("value", snapshot=>{
                if(snapshot.val().totalrate > 0){
                  var rating = snapshot.val().rating / snapshot.val().totalrate;
                }
                this.ListOfitems.push({firstname:snapshot.val().firstname, lastname: snapshot.val().lastname, email:snapshot.val().email, 
                  fromAddress:res[i].fromAddress, fromDate:res[i].fromDate, toAddress:res[i].toAddress, toDate:res[i].toDate, 
                  fromX:res[i].fromX, fromY:res[i].fromY, key:res[i].key, toX:res[i].toX, toY:res[i].toY, userId:res[i].userId, 
                  rating: rating, isTerminated: snapshot.val().isTerminated});
                this.ListOfitems2nd = this.ListOfitems;
                console.log(this.ListOfitems2nd);
            });       
          }
        })
    }

   ListofItems(){
     this.ListOfitems = this.ListOfitems2nd;
   }


     getItems(ev: any) {
        this.ListofItems();  
      let val = ev.target.value;
      console.log(val);
     if (val && val.trim() != '') {
       this.ListOfitems = this.ListOfitems.filter((ListOfitem) => {
          return (ListOfitem.fromAddress.toLowerCase().indexOf(val.toLowerCase()) > -1||
            ListOfitem.toAddress.toLowerCase().indexOf(val.toLowerCase()) >-1 ||
            this.datepipe.transform(ListOfitem.fromDate, 'mediumDate').toLowerCase().indexOf(val.toLowerCase()) > -1 ||
            this.datepipe.transform(ListOfitem.toDate, 'mediumDate').toLowerCase().indexOf(val.toLowerCase()) > -1);
           
         
       })
      }
  }

  openHelp(curr){
    this.navCtrl.push(HelpPage, {item: curr});
  }
}
