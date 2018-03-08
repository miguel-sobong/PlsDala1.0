import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Observable } from 'rxjs/Observable';
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
	profileUsername: string;
	profileDescription: string;
	editProfile: boolean = false;
	fname: string;
	lname: string;
	description: string;
  reviewList$: Observable<any>;
  ListOfitems: Array<any>;
  userRating: any;
  userNode: any;
  changePassword: any;
  password1: any;
  password2: any;

  constructor(public actionSheetCtrl: ActionSheetController, public camera: Camera, 
  	public toastCtrl: ToastController , public plsdala: PlsdalaProvider, 
  	public navCtrl: NavController, public navParams: NavParams) {
  	this.currentUser = firebase.auth().currentUser.uid;
    this.userNode = firebase.database().ref('users/').child(firebase.auth().currentUser.uid);
    this.userNode.on('value', user => {
    	console.log(user.val());
    	this.profileName = user.val().firstname + ' ' + user.val().lastname;
    	this.profileUsername = user.val().username;
    	this.profileDescription = user.val().description;
    	this.profileimage = user.val().profileimage;
    	this.fname = user.val().firstname;
    	this.lname = user.val().lastname;
    	this.description = user.val().description;
      this.userRating = user.val().rating / user.val().totalrate
    });

    this.reviewList$ = this.plsdala.getReviews(firebase.auth().currentUser.uid)
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
          this.ListOfitems.push({username: snapshot.val().username, firstname:snapshot.val().firstname, lastname: snapshot.val().lastname, 
            email:snapshot.val().email, review: res[i].description, rating: res[i].rating, timestamp: res[i].timestamp});
          });
      }
      console.log(this.ListOfitems);
    })
  }

  ionViewDidLeave(){
    this.userNode.off();
  }

  Round(number){
    return Math.round(number);
  }

  ChangePassword(){
    this.changePassword = !this.changePassword;
  }

  submitChangePass(){
    // if(this.password1 == this.password2){
    //   firebase.auth().currentUser.updatePassword(this.password1).then(res=>{
    //     this.toastCtrl.create({
    //       message: 'Password successfully changed',
    //       duration: 3000
    //     }).present();
    //   })
    // }
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
    console.log(this.profileDescription);
  }

  submitEdit(){
    var editData = {};
    if(this.description){
    	editData = {
    		// firstname: this.fname,
    		// lastname: this.lname,
    		description: this.description
    	}
    }
    else{
      editData = {
        description: ""
      }
    }
    this.plsdala.editProfile(this.currentUser, editData).then(success=>{
    	this.editProfile = !this.editProfile;
    	this.toastCtrl.create({
    		message: 'Successfully edited your profile',
    		duration: 3000
    	}).present();
    });

    this.profileDescription = this.description;
  }
}
