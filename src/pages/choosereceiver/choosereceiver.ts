
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { ViewprofilePage } from '../viewprofile/viewprofile';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-choosereceiver',
  templateUrl: 'choosereceiver.html',
})
export class ChoosereceiverPage {

  userlist: Observable<any>;
  selectedUser;
  selectedItem;
  user;
  listOfUsersforFilter:Array<any>;
  listOfUsersforFilter2nd:Array<any>;
  constructor(public viewCtrl: ViewController, public loadingCtrl: LoadingController, public plsdala: PlsdalaProvider, 
    public navCtrl: NavController, public navParams: NavParams) {
    this.selectedItem = navParams.get('data').courierId;
    this.listOfUsersforFilter = [];
    this.listOfUsersforFilter2nd = [];
    var loader = this.loadingCtrl.create({  
      content: 'Getting user list'
    });
    
    this.user = firebase.auth().currentUser.uid;
    this.initialize(loader);
   
  }//end of constructor

initialize(loader){
  loader.present();
    this.userlist = this.plsdala.getUserList()
    .snapshotChanges()
    .map(
      changes => {
        return changes.map(c=>({
          key: c.payload.key, ...c.payload.val()
        }));
      })
   this.userlist.subscribe(res =>{
      this.listOfUsersforFilter = [];
      this.listOfUsersforFilter2nd = [];
         for(let i=0;i<res.length;i++){
            if(this.user != res[i].key && this.user != this.selectedItem){
               this.listOfUsersforFilter.push({firstname:res[i].firstname,lastname:res[i].lastname,id:res[i].id,
                 username:res[i].username,fnln:res[i].lastname+" "+res[i].firstname,fnln2:res[i].firstname+" "+res[i].lastname});
             
              this.listOfUsersforFilter2nd=this.listOfUsersforFilter;

            }}
    })  
  
    
    loader.dismiss();
}


   ListofReceiver(){
     this.listOfUsersforFilter=this.listOfUsersforFilter2nd;
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChoosereceiverPage');
  }

  viewProfile(key){
      this.navCtrl.push(ViewprofilePage, {item: key});
  }


  AddReceiver(item){
    this.viewCtrl.dismiss({
      name: `${item.firstname} ${item.lastname} (${item.username})`,
      uid: item.id
    });
  }

  Cancel(){
    this.navCtrl.pop();
  }

     getItems(ev: any) {
  console.log("filtered",this.listOfUsersforFilter);
        this.ListofReceiver();  
      let val = ev.target.value;
      console.log(val);
     if (val && val.trim() !='') {
       this.listOfUsersforFilter = this.listOfUsersforFilter.filter((ListOfitem) => {
          return ( ListOfitem.fnln2.toLowerCase().indexOf(val.toLowerCase()) >-1 ||
            ListOfitem.fnln.toLowerCase().indexOf(val.toLowerCase()) >-1 ||
            ListOfitem.username.toLowerCase().indexOf(val.toLowerCase()) >-1);
       })
      }
 
  }

}