import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, ToastController, ModalController } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { ChatPage } from '../chat/chat';
import { ChoosereceiverPage } from '../choosereceiver/choosereceiver';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import * as firebase from 'firebase';

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
  public picurl:any;      //for downloadable url ni
  public mypicref:any;    //reference for upload sa firebase storage
  public picdata:any; 
  public imageName:any;
  public maximage:any;
  username: any;
  public FirstName:any;
  userData = { user_id: "", token: "", imageB64: "" };
	@ViewChild('textArea') textArea: ElementRef;
  selectedItem: string;
  ItemName;
  ItemDescription;
  receiver;
  receiverId;

  constructor(public modalCtrl: ModalController, public toastCtrl: ToastController, public camera: Camera, 
    public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController, public plsdala: PlsdalaProvider) {
    firebase.database().ref('users').child(firebase.auth().currentUser.uid).once("value", snapshot=>{
      this.username = `${snapshot.val().firstname} ${snapshot.val().lastname} (${snapshot.val().username})`;
    });
    this.selectedItem = navParams.get('item');
    var users = {
      user1: firebase.auth().currentUser.uid,
      user2: this.selectedItem['userId']
    }
    this.plsdala.getMessages(users);
  }

  ngOnInit() 
  {
    this.photos = [];
    this.maximage=3;
    this.picurl = [];
    this.picdata = [];
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

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 450,
      targetHeight: 450,
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.photos.push(this.base64Image);
        this.photos.reverse();
        this.picdata.push(imageData);
        this.maxImage();
      },
      err => {
        console.log(err);
      });
  }

  OpenGallery(){
    const options: CameraOptions = {
     sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
     destinationType:this.camera.DestinationType.DATA_URL, 
     quality:100,
     targetWidth:450,
     targetHeight:450,
     encodingType:this.camera.EncodingType.JPEG,
     correctOrientation:true,
     mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.photos.push(this.base64Image);
        this.photos.reverse();
        this.picdata.push(imageData); 
        this.maxImage(); 
      },
      err => {
        console.log(err);
      });
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

  addItem(){
    if(this.photos.length > 0){
      if(this.receiverId){
        if(this.ItemName){
          var data = {
            receiverName: this.receiver,
            receiverId: this.receiverId,
            name: this.ItemName, 
            description: this.ItemDescription
          };
          this.navCtrl.pop();
          this.navCtrl.push(ChatPage,{
            item: this.selectedItem
          }).then(_=>{
            this.toastCtrl.create({
              message: 'Adding item',
              duration: 3000
            }).present();
            var users = {
              user1: firebase.auth().currentUser.uid,
              user2: this.selectedItem['userId']
            }
            this.plsdala.addItem(users, data, this.selectedItem).then(keyData=>{
              for (let i in this.picdata){
                this.plsdala.uploadItemPhoto(this.picdata[i], i, this.selectedItem['key'], keyData);
              };
            }).then(()=>{
              this.plsdala.sendNotifs(this.selectedItem['userId'], 'Delivery Request', `${this.username} has requested to send an item`); 
            })
          });
        }else{
          this.alertCtrl.create({
            message: 'Please add an item name',
            buttons: [{
              text: 'Ok',
              role: 'cancel'
            }]
          }).present();
        }
      }else{
        this.alertCtrl.create({
          message: 'Please add a receiver',
            buttons: [{
              text: 'Ok',
              role: 'cancel'
            }]
        }).present();
      }
    }else{
      this.alertCtrl.create({
        message: 'Please add photos of your item',
            buttons: [{
              text: 'Ok',
              role: 'cancel'
            }]
      }).present();
    }
  }



  chooseReceiver(){
    let modal = this.modalCtrl.create(ChoosereceiverPage, {
      data: {
        courierId: this.selectedItem['userId'],
        name: '',
        uid: ''
      }
    });
    modal.onDidDismiss(data=>{
      console.log(data);
      if(data!=null){
        this.receiver = data.name;
        this.receiverId = data.uid
      }
    });
    modal.present();
  }

  deletePhoto(index)    //index, refer home.html line 19
   {
    this.alertCtrl.create({
      title: "Are you sure you want to delete this photo?",
      buttons: [
        {
          text: "Yes",
          handler: () => {
            this.photos.splice(index, 1);     ///DELETE ELEMENT IN AN ARRAY NING SPLICE // PHOTOS VARIABLE NA DECLARE SA TAAS 
            this.picdata.splice(index, 1);
            this.maxImage();
          }
        },
        {
          text: "No",
          role: 'cancel'
        }
      ]
    }).present();
  }

}
