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
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ViewphotoPage } from '../viewphoto/viewphoto';
import * as firebase from 'firebase';
var ViewprofilePage = /** @class */ (function () {
    function ViewprofilePage(modal, navCtrl, navParams) {
        var _this = this;
        this.modal = modal;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.selectedItem = navParams.get('item');
        this.user = this.selectedItem;
        console.log(this.selectedItem);
        firebase.database().ref('users/')
            .child(this.selectedItem)
            .once('value', function (user) {
            console.log(user.val());
            _this.profileName = user.val().firstname + ' ' + user.val().lastname;
            _this.profileEmail = user.val().email;
            _this.profileDescription = user.val().description;
            _this.profileImage = user.val().profileimage;
        });
    }
    ViewprofilePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ViewprofilePage');
    };
    ViewprofilePage.prototype.openModal = function (images) {
        this.modal.create(ViewphotoPage, { imgurl: images }).present();
    };
    ViewprofilePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-viewprofile',
            templateUrl: 'viewprofile.html',
        }),
        __metadata("design:paramtypes", [ModalController, NavController, NavParams])
    ], ViewprofilePage);
    return ViewprofilePage;
}());
export { ViewprofilePage };
//# sourceMappingURL=viewprofile.js.map