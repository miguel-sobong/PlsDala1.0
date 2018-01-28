var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, ToastController, ModalController } from 'ionic-angular';
import { Camera } from "@ionic-native/camera";
import { ChatPage } from '../chat/chat';
import { ChoosereceiverPage } from '../choosereceiver/choosereceiver';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
var AdditemPage = /** @class */ (function () {
    function AdditemPage(modalCtrl, toastCtrl, camera, navCtrl, navParams, actionSheetCtrl, alertCtrl, plsdala) {
        this.modalCtrl = modalCtrl;
        this.toastCtrl = toastCtrl;
        this.camera = camera;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;
        this.plsdala = plsdala;
        this.disabled = false;
        this.userData = { user_id: "", token: "", imageB64: "" };
        this.selectedItem = navParams.get('item');
    }
    AdditemPage.prototype.ngOnInit = function () {
        this.photos = [];
        this.maximage = 3;
        this.picurl = [];
        this.picdata = [];
    };
    AdditemPage.prototype.presentActionSheet = function () {
        var _this = this;
        this.actionSheetCtrl.create({
            title: 'Choose or take a picture',
            buttons: [
                {
                    text: 'Take a picture',
                    handler: function () {
                        _this.takePhoto();
                    }
                },
                {
                    text: 'Choose pictures',
                    handler: function () {
                        _this.OpenGallery();
                    }
                }
            ]
        }).present();
    };
    AdditemPage.prototype.takePhoto = function () {
        var _this = this;
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetWidth: 450,
            targetHeight: 450,
            saveToPhotoAlbum: false
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.base64Image = "data:image/jpeg;base64," + imageData;
            _this.photos.push(_this.base64Image);
            _this.photos.reverse();
            _this.picdata.push(imageData);
            _this.maxImage();
        }, function (err) {
            console.log(err);
        });
    };
    AdditemPage.prototype.OpenGallery = function () {
        var _this = this;
        var options = {
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL,
            quality: 100,
            targetWidth: 450,
            targetHeight: 450,
            encodingType: this.camera.EncodingType.JPEG,
            correctOrientation: true,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.base64Image = "data:image/jpeg;base64," + imageData;
            _this.photos.push(_this.base64Image);
            _this.photos.reverse();
            _this.picdata.push(imageData);
            _this.maxImage();
        }, function (err) {
            console.log(err);
        });
    };
    AdditemPage.prototype.maxImage = function () {
        if (this.photos.length == "3")
            this.disabled = true;
        else if (this.photos.length < "3") {
            this.disabled = false;
            if (this.photos.length == "0")
                this.maximage = 3;
            else if (this.photos.length == "1")
                this.maximage = 2;
            else
                this.maximage = 1;
        }
    };
    AdditemPage.prototype.addItem = function () {
        var _this = this;
        console.log(this.selectedItem['key']);
        // if(this.photos > 0){
        if (this.receiverId) {
            if (this.ItemName) {
                var data = {
                    receiverName: this.receiver,
                    receiverId: this.receiverId,
                    name: this.ItemName,
                    description: this.ItemDescription
                };
                this.navCtrl.pop();
                this.navCtrl.push(ChatPage, {
                    item: this.selectedItem
                }).then(function (_) {
                    _this.toastCtrl.create({
                        message: 'Adding item',
                        duration: 3000
                    }).present();
                    _this.plsdala.addItem(data, _this.selectedItem).then(function (keyData) {
                        for (var i in _this.picdata) {
                            _this.plsdala.uploadItemPhoto(_this.picdata[i], i, _this.selectedItem['key'], keyData);
                        }
                        _this.plsdala.addItemMessage(_this.selectedItem);
                    }, function (error) {
                        console.log(error);
                    });
                });
            }
            else {
                this.toastCtrl.create({
                    message: 'Please add an item name',
                    duration: 3000
                }).present();
            }
        }
        else {
            this.toastCtrl.create({
                message: 'Please add a receiver',
                duration: 3000
            }).present();
        }
        // }else{
        //   this.toastCtrl.create({
        //     message: 'Please add photos of your item',
        //     duration: 3000
        //   }).present();
        // }
    };
    AdditemPage.prototype.chooseReceiver = function () {
        var _this = this;
        var modal = this.modalCtrl.create(ChoosereceiverPage, {
            data: {
                name: '',
                uid: ''
            }
        });
        modal.onDidDismiss(function (data) {
            console.log(data);
            if (data != null) {
                _this.receiver = data.name;
                _this.receiverId = data.uid;
            }
        });
        modal.present();
    };
    // uploadFirebase(){
    //   this.plsdala.uploadPhoto(this.picdata, {
    //     imageName: this.photoId(),
    //   });
    // }
    AdditemPage.prototype.deletePhoto = function (index) {
        var _this = this;
        this.alertCtrl.create({
            title: "Are you sure you want to delete this photo?",
            message: "",
            buttons: [
                {
                    text: "Yes",
                    handler: function () {
                        _this.photos.splice(index, 1); ///DELETE ELEMENT IN AN ARRAY NING SPLICE // PHOTOS VARIABLE NA DECLARE SA TAAS 
                        _this.maxImage();
                    }
                },
                {
                    text: "No",
                    role: 'cancel'
                }
            ]
        }).present();
    };
    __decorate([
        ViewChild('textArea'),
        __metadata("design:type", ElementRef)
    ], AdditemPage.prototype, "textArea", void 0);
    AdditemPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-additem',
            templateUrl: 'additem.html',
        }),
        __metadata("design:paramtypes", [ModalController, ToastController, Camera,
            NavController, NavParams, ActionSheetController,
            AlertController, PlsdalaProvider])
    ], AdditemPage);
    return AdditemPage;
}());
export { AdditemPage };
//# sourceMappingURL=additem.js.map