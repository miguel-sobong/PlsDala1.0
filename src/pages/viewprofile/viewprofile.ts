import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ViewphotoPage } from '../viewphoto/viewphoto'
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-viewprofile',
  templateUrl: 'viewprofile.html',
})
export class ViewprofilePage {

	selectedItem: any;
	profileName: any;
	profileEmail: any;
	profileDescription: any;
	profileImage: any;
  user: any;

  constructor(public modal: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    this.selectedItem = navParams.get('item');
    this.user = this.selectedItem;
    console.log(this.selectedItem);

    firebase.database().ref('users/')
    .child(this.selectedItem)
    .once('value', user => {
      console.log(user.val());
      this.profileName = user.val().firstname + ' ' + user.val().lastname;
      this.profileEmail = user.val().email;
      this.profileDescription = user.val().description;
      this.profileImage = user.val().profileimage;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewprofilePage');
  }

 openModal(images){
  this.modal.create(ViewphotoPage, {imgurl: images}).present();
 }

}
