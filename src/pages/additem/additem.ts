import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';

@IonicPage()
@Component({
  selector: 'page-additem',
  templateUrl: 'additem.html',
})
export class AdditemPage {
  public disabled:boolean=false;
  public photos: any;
  public base64Image: string;
  public fileImage: string;
  public responseData: any;
  public picurl:any;      //for downloadable url ni
  public mypicref:any;    //reference for upload sa firebase storage
  public picdata:any; 
  public imageName:any;
  public maximage:any;
  public FirstName:any;
  userData = { user_id: "", token: "", imageB64: "" };
	@ViewChild('textArea') textArea: ElementRef;
	addItemForm: FormGroup;

  constructor(public camera: Camera, public formBuilder: FormBuilder, 
    public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController, public plsdala: PlsdalaProvider) {
  	this.addItemForm = formBuilder.group({
  		photo: [''],
  		name: [''],
  		description: ['']
  	});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdditemPage');
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

  ngOnInit() {
    this.photos = [];
    this.maximage=3;
    this.picurl = [];
    this.picdata = [];
    }

  takePhoto() {
    console.log("Take photo");
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 450,
      targetHeight: 450,
      saveToPhotoAlbum: false        //PICTURE WONT BE SAVED IN PHOTO LIBRARY
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.photos.push(this.base64Image);
        this.photos.reverse();
        this.picdata.push(imageData);
        //change this 
        this.maxImage();
      },
      err => {
        console.log(err);
      }
    );
  }

  maxImage(){
    if(this.photos.length == "3")
      this.disabled=true;
    else if(this.photos.length < "3"){
      this.disabled=false;
      if(this.photos.length =="0")
        this.maximage=3;
      else if(this.photos.length == "1")
        this.maximage=2;
      else
        this.maximage=1;
    }            
  }

  OpenGallery(){
    // console.log("opengallery");
    // const options: CameraOptions = {
    //  sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
    //  destinationType:this.camera.DestinationType.DATA_URL, 
    //  quality:50,
    //  targetWidth:450,
    //  targetHeight:450,
    //  encodingType:this.camera.EncodingType.JPEG,
    //  correctOrientation:true,
    //  mediaType: this.camera.MediaType.PICTURE
    // };

    // this.camera.getPicture(options).then(
    //   imageData => {
    //     this.base64Image = "data:image/jpeg;base64," + imageData;
    //     this.photos.push(this.base64Image);
    //     this.photos.reverse();
    //     this.sendData(imageData);
    //     this.picdata.push(imageData); 
    //     this.maxImage();     
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
  }

  uploadFirebase(){
    this.plsdala.uploadPhoto(this.picdata, {
      imageName: this.uid(),
    });
  }

  deletePhoto(index)    //index, refer home.html line 19
   {
    let confirm = this.alertCtrl.create({
      title: "Are you sure you want to delete this photo?",
      message: "",
      buttons: [
        {
          text: "No",
          handler: () => {
            console.log("Disagree clicked");
          }
        },
        {
          text: "Yes",
          handler: () => {
            console.log("Agree clicked");
            this.photos.splice(index, 1);     ///DELETE ELEMENT IN AN ARRAY NING SPLICE // PHOTOS VARIABLE NA DECLARE SA TAAS 
            this.maxImage();
          }
        }
      ]
    }).present();
  }

  sendData(imageData) { //PARA NIS AUTHSERVICE
    this.userData.imageB64 = imageData;
    this.userData.user_id = "1";
    this.userData.token = "222";
    console.log(this.userData);
    this.plsdala.postData(this.userData, "userImage").then(
      result => {
        this.responseData = result;
      },
      err => {
      }
    );
  }

  uid(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

}
