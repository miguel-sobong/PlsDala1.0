import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ViewphotoPage } from '../viewphoto/viewphoto'
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';

@IonicPage()
@Component({
  selector: 'page-viewprofile',
  templateUrl: 'viewprofile.html',
})
export class ViewprofilePage {

	selectedItem: any;
	profileName: any;
	profileUsername: any;
	profileDescription: any;
	profileImage: any;
  user: any;
  reviewList$: Observable<any>;
  ListOfitems: Array<any>;
  userRating: any;

  constructor(public plsdala: PlsdalaProvider, public modal: ModalController, 
    public navCtrl: NavController, public navParams: NavParams) {
    this.selectedItem = navParams.get('item');
    this.user = this.selectedItem;
    console.log(this.selectedItem);

    firebase.database().ref('users/')
    .child(this.selectedItem)
    .once('value', user => {
      console.log(user.val());
      this.profileName = user.val().firstname + ' ' + user.val().lastname;
      this.profileUsername = user.val().username;
      this.profileDescription = user.val().description;
      this.profileImage = user.val().profileimage;
      this.userRating = user.val().rating / user.val().totalrate
    });

    this.reviewList$ = this.plsdala.getReviews(this.selectedItem)
    .snapshotChanges()
    .map(
      changes => {
        return changes.map(c=>({
          key: c.payload.key, ...c.payload.val()
        })).slice().reverse();
      });

      this.reviewList$.subscribe(res => {
      this.ListOfitems = [];
      for(let i=0;i<res.length;i++){
        console.log(res[i].reviewer);
        firebase.database().ref('users').child(res[i].reviewer).once("value", snapshot=>{
          console.log(snapshot.val());
          this.ListOfitems.push({username:snapshot.val().username,firstname:snapshot.val().firstname, lastname: snapshot.val().lastname, 
            email:snapshot.val().email, review: res[i].description, rating: res[i].rating, timestamp: res[i].timestamp});
          });
      }
      console.log(this.ListOfitems);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewprofilePage');
  }

 openModal(images){
  this.modal.create(ViewphotoPage, {imgurl: images}).present();
 }

  Round(number){
    return Math.round(number);
  }
}
