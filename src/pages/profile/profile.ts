import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
	currentUser: string;
	profileimage: string;
	profileName: string;
	profileEmail: string;
	profileDescription: string;
	editProfile: boolean = false;
	fname: string;
	lname: string;
	description: string;

  constructor(public actionSheetCtrl: ActionSheetController, public camera: Camera, 
  	public toastCtrl: ToastController , public plsdala: PlsdalaProvider, 
  	public navCtrl: NavController, public navParams: NavParams) {
  	this.currentUser = firebase.auth().currentUser.uid;
    firebase.database().ref('users/')
    .child(this.currentUser)
    .on('value', user => {
    	console.log(user.val());
    	this.profileName = user.val().firstname + ' ' + user.val().lastname;
    	this.profileEmail = user.val().email;
    	this.profileDescription = user.val().description;
    	this.profileimage = user.val().profileimage;
    	this.fname = user.val().firstname;
    	this.lname = user.val().lastname;
    	this.description = user.val().description;
    });
  }

  presentActionSheet() {
    this.actionSheetCtrl.create({
      title: 'Choose or take a picture',
      buttons: [
        {
          text: 'Take a picture',
          handler: () => {
            this.takePhoto();
          }
        },
        {
          text: 'Choose pictures',
          handler: () => {
            this.OpenGallery();
          }
        }
      ]
    }).present();
  }

  takePhoto(){
  	this.camera.getPicture({
  		quality: 100,
  		destinationType: this.camera.DestinationType.DATA_URL,
  		sourceType: this.camera.PictureSourceType.CAMERA,
  		encodingType: this.camera.EncodingType.JPEG,
  		targetHeight: 450,
  		targetWidth: 450,
      	mediaType: this.camera.MediaType.PICTURE,
      	saveToPhotoAlbum: false
  	}).then(imageData=>{
  		this.plsdala.uploadProfilePhoto(imageData);
  	}, error=>{
  		console.log(error);
  	})
  }

  OpenGallery(){
    const options: CameraOptions = {
     sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
     destinationType:this.camera.DestinationType.DATA_URL, 
     quality:75,
     targetWidth:500,
     targetHeight:500,
     encodingType:this.camera.EncodingType.JPEG,
     correctOrientation:true,
     mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then(
      imageData => {
  		  this.plsdala.uploadProfilePhoto(imageData);
      },
      err => {
        console.log(err);
      }
    );
  }

  EditProfile(){
  	this.editProfile = !this.editProfile;
  }

  submitEdit(){
  	var editData = {
  		firstname: this.fname,
  		lastname: this.lname,
  		description: this.description
  	}
  	this.plsdala.editProfile(this.currentUser, editData).then(success=>{
  		this.editProfile = !this.editProfile;
  		this.toastCtrl.create({
  			message: 'Successfully edited your profile',
  			duration: 3000
  		}).present();
  	})
  }
}
