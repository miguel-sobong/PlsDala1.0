import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, Platform } from 'ionic-angular';
import { AddtravelPage } from '../addtravel/addtravel';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { TravelPage } from '../../pages/travel/travel';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { HelpPage } from '../help/help';
import { Diagnostic } from '@ionic-native/diagnostic';

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
  verifyViewer;
  UserIsDeclined: any;

  constructor(public diagnostic: Diagnostic, public authenticationProvider: AuthenticationProvider, public alert: AlertController,
   public navCtrl: NavController, public navParams: NavParams, 
    public plsdala: PlsdalaProvider, public platform: Platform, public toastCtrl: ToastController, private datepipe:DatePipe) {
    this.helpPage = HelpPage;
    this.ListOfitems = [];
    this.ListOfitems2nd = [];
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

   userRef.child('isDeclined')
    .once('value', isDeclined => {
      this.UserIsDeclined = isDeclined.val();
    });

    var verifyViewer = firebase.database().ref('users').child(firebase.auth().currentUser.uid);
    verifyViewer.on('child_changed', changes=>{
      console.log(changes.key, changes.val());
      if(changes.val() == true){
        this.UserIsVerified = changes.val();
      }
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
        today = new Date(today);
        for(let i=0;i<res.length;i++){
          var checkDate = new Date(res[i].fromDate);
          if(checkDate < today) { continue };
            firebase.database().ref('users').child(res[i].userId).once("value", snapshot=>{
              if(snapshot.val().totalrate > 0){
                var rating = snapshot.val().rating / snapshot.val().totalrate;
              }
              this.ListOfitems.push({firstname:snapshot.val().firstname, lastname: snapshot.val().lastname, username:snapshot.val().username, 
                fromAddress:res[i].fromAddress, fromDate:res[i].fromDate, toAddress:res[i].toAddress, toDate:res[i].toDate, 
                fromX:res[i].fromX, fromY:res[i].fromY, key:res[i].key, toX:res[i].toX, toY:res[i].toY, userId:res[i].userId, 
                rating: rating, isTerminated: snapshot.val().isTerminated});
              this.ListOfitems2nd = this.ListOfitems;
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
            this.datepipe.transform(ListOfitem.fromDate, 'longDate').toLowerCase().indexOf(val.toLowerCase()) > -1 ||
            this.datepipe.transform(ListOfitem.toDate, 'longDate').toLowerCase().indexOf(val.toLowerCase()) > -1);
           
         
       })
      }
  }

  openHelp(curr){
    this.navCtrl.push(HelpPage, {item: curr});
  }
}
