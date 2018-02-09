import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AddtravelPage } from '../addtravel/addtravel';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { TravelPage } from '../../pages/travel/travel';
import { LoginPage } from '../../pages/login/login'
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';


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
  
 
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public plsdala: PlsdalaProvider, public toastCtrl: ToastController, private datepipe:DatePipe) {
    console.log("called again 1st");
    this.ListOfitems = [];
    this.ListOfitems2nd = [];
    this.currentUserId = firebase.auth().currentUser.uid;
    this.initializeItems();
    firebase.database().ref('users/' + firebase.auth().currentUser.uid)
    .child('isVerified')
    .on('value', isVerified => {
        this.UserIsVerified = isVerified.val();
        console.log(isVerified.val());

    });
 }

  addTravel(event){
    this.navCtrl.push(AddtravelPage);
  }

  itemTapped(event, item) {
    console.log(item);
    console.log(this.UserIsVerified);
    this.navCtrl.push(TravelPage, {
      item: item
    });
  }

    initializeItems(){
      console.log("called again");
      
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
           console.log("1sst",res[i]);
      
               this.ListOfitems.push({firstname:res[i].firstname, lastname: res[i].lastname, email:res[i].email, fromAddress:res[i].fromAddress,
                fromDate:res[i].fromDate, toAddress:res[i].toAddress, toDate:res[i].toDate, fromX:res[i].fromX,
                 fromY:res[i].fromY, key:res[i].key, toX:res[i].toX, toY:res[i].toY, userId:res[i].userId});
               this.ListOfitems2nd = this.ListOfitems;
                
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
}
