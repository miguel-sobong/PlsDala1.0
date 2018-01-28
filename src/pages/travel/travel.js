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
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AdditemPage } from '../additem/additem';
import { ChatPage } from '../chat/chat';
import { ViewprofilePage } from '../viewprofile/viewprofile';
import { ProfilePage } from '../profile/profile';
import * as firebase from 'firebase';
var TravelPage = /** @class */ (function () {
    function TravelPage(loadingCtrl, navCtrl, navParams, toastCtrl) {
        var _this = this;
        this.loadingCtrl = loadingCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        var loader = this.loadingCtrl.create({
            content: 'Getting user information'
        });
        loader.present();
        this.selectedItem = navParams.get('item');
        console.log(this.selectedItem);
        this.user = firebase.auth().currentUser.uid;
        firebase.database().ref('users/')
            .child(this.selectedItem['userId'])
            .once('value', function (user) {
            console.log(user.val());
            _this.posterName = user.val().firstname + ' ' + user.val().lastname;
            _this.posterEmail = user.val().email;
            _this.posterDescription = user.val().description;
            _this.posterImage = user.val().profileimage;
            loader.dismiss();
        });
    }
    TravelPage.prototype.initMap = function () {
        var _this = this;
        //change to user location later
        var from = new google.maps.LatLng(this.selectedItem.fromX, this.selectedItem.fromY);
        var to = new google.maps.LatLng(this.selectedItem.toX, this.selectedItem.toY);
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: from
        });
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(this.map);
        directionsService.route({
            origin: from,
            destination: to,
            travelMode: google.maps.TravelMode['DRIVING']
        }, function (res, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(res);
            }
            else {
                _this.toastCtrl.create({
                    message: 'Cannot get directions',
                    duration: 3000
                }).present();
            }
        });
    };
    TravelPage.prototype.ionViewDidLoad = function () {
        this.initMap();
        console.log('ionViewDidLoad TravelPage');
    };
    TravelPage.prototype.addItem = function (event) {
        this.navCtrl.push(AdditemPage, { item: this.selectedItem });
    };
    TravelPage.prototype.messageUser = function (event) {
        console.log(this.selectedItem);
        this.navCtrl.push(ChatPage, {
            item: this.selectedItem
        });
    };
    TravelPage.prototype.viewProfile = function () {
        if (this.selectedItem['userId'] == this.user)
            this.navCtrl.push(ProfilePage);
        else
            this.navCtrl.push(ViewprofilePage, { item: this.selectedItem['userId'] });
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], TravelPage.prototype, "mapElement", void 0);
    TravelPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-travel',
            templateUrl: 'travel.html',
        }),
        __metadata("design:paramtypes", [LoadingController, NavController, NavParams, ToastController])
    ], TravelPage);
    return TravelPage;
}());
export { TravelPage };
//# sourceMappingURL=travel.js.map