import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AddtravelPage } from '../addtravel/addtravel';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { TravelPage } from '../../pages/travel/travel';
import { LoginPage } from '../../pages/login/login'
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { Geolocation } from '@ionic-native/geolocation';


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
  
 
  constructor(public geo: Geolocation, public alert: AlertController, public navCtrl: NavController, public navParams: NavParams, 
    public plsdala: PlsdalaProvider, public toastCtrl: ToastController, private datepipe:DatePipe) {
    this.ListOfitems = [];
    this.ListOfitems2nd = [];
    var checked = false;
    this.currentUserId = firebase.auth().currentUser.uid;
    this.initializeItems();
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).child('isVerified')
    .once('value', isVerified => {
      this.UserIsVerified = isVerified.val();
    });      

    firebase.database().ref('users/' + firebase.auth().currentUser.uid)
    .on('child_changed', changes => {
      if(changes.key == "isVerified"){
        this.UserIsVerified = changes.val();
        if(changes.val() == true && localStorage.getItem("verified") == "false"){
              this.alert.create({
                title: "Congratulations! You are now verified :)",
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
    });      
  }

  addTravel(event){
    this.navCtrl.push(AddtravelPage);
  }

  Round(number){
    return Math.round(number);
  }

  itemTapped(event, item) {
    // console.log(item);
    // console.log(this.UserIsVerified);
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
        for(let i=0;i<res.length;i++){
          firebase.database().ref('users').child(res[i].userId).once("value", snapshot=>{
            if(snapshot.val().totalrate > 0){
              var rating = snapshot.val().rating / snapshot.val().totalrate;
            }
            this.ListOfitems.push({firstname:snapshot.val().firstname, lastname: snapshot.val().lastname, email:snapshot.val().email, 
              fromAddress:res[i].fromAddress, fromDate:res[i].fromDate, toAddress:res[i].toAddress, toDate:res[i].toDate, 
              fromX:res[i].fromX, fromY:res[i].fromY, key:res[i].key, toX:res[i].toX, toY:res[i].toY, userId:res[i].userId, 
              rating: rating});
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
       //console.log("awdaw");
      // console.log("awdaw",this.ListOfitems);
      // console.log("otin");
     //  console.log((this.datepipe.transform(this.ListOfitems[1].fromDate *1000,'mediumDate')));
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

  ionViewDidLoad(){
    this.geo.getCurrentPosition().then(pos=>{
      alert(pos.coords.latitude);
      alert(pos.coords.longitude);
    }).catch(err=>alert("error: " + err));
  }
}
