var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { Camera } from '@ionic-native/camera';
import * as firebase from 'firebase';
var ProfilePage = /** @class */ (function () {
    function ProfilePage(actionSheetCtrl, camera, toastCtrl, plsdala, navCtrl, navParams) {
        var _this = this;
        this.actionSheetCtrl = actionSheetCtrl;
        this.camera = camera;
        this.toastCtrl = toastCtrl;
        this.plsdala = plsdala;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.editProfile = false;
        this.currentUser = firebase.auth().currentUser.uid;
        firebase.database().ref('users/')
            .child(this.currentUser)
            .on('value', function (user) {
            console.log(user.val());
            _this.profileName = user.val().firstname + ' ' + user.val().lastname;
            _this.profileEmail = user.val().email;
            _this.profileDescription = user.val().description;
            _this.profileimage = user.val().profileimage;
            _this.fname = user.val().firstname;
            _this.lname = user.val().lastname;
            _this.description = user.val().description;
        });
    }
    ProfilePage.prototype.presentActionSheet = function () {
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
    ProfilePage.prototype.takePhoto = function () {
        var _this = this;
        this.camera.getPicture({
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.CAMERA,
            encodingType: this.camera.EncodingType.JPEG,
            targetHeight: 450,
            targetWidth: 450,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: false
        }).then(function (imageData) {
            _this.plsdala.uploadProfilePhoto(imageData);
        }, function (error) {
            console.log(error);
        });
    };
    ProfilePage.prototype.OpenGallery = function () {
        var _this = this;
        var options = {
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL,
            quality: 75,
            targetWidth: 500,
            targetHeight: 500,
            encodingType: this.camera.EncodingType.JPEG,
            correctOrientation: true,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.plsdala.uploadProfilePhoto(imageData);
        }, function (err) {
            console.log(err);
        });
    };
    ProfilePage.prototype.EditProfile = function () {
        this.editProfile = !this.editProfile;
    };
    ProfilePage.prototype.submitEdit = function () {
        var _this = this;
        var editData = {
            firstname: this.fname,
            lastname: this.lname,
            description: this.description
        };
        this.plsdala.editProfile(this.currentUser, editData).then(function (success) {
            _this.editProfile = !_this.editProfile;
            _this.toastCtrl.create({
                message: 'Successfully edited your profile',
                duration: 3000
            }).present();
        });
    };
    ProfilePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-profile',
            templateUrl: 'profile.html',
        }),
        __metadata("design:paramtypes", [ActionSheetController, Camera,
            ToastController, PlsdalaProvider,
            NavController, NavParams])
    ], ProfilePage);
    return ProfilePage;
}());
export { ProfilePage };
//# sourceMappingURL=profile.js.map