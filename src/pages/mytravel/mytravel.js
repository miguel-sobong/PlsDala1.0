var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { ViewphotoPage } from '../viewphoto/viewphoto';
var MytravelPage = /** @class */ (function () {
    function MytravelPage(modal, plsdala, toastCtrl, navCtrl, navParams) {
        this.modal = modal;
        this.plsdala = plsdala;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.selectedItem = navParams.get('item');
        this.items$ = this.plsdala.getItemsAtTravel(this.selectedItem['key'])
            .snapshotChanges()
            .map(function (changes) {
            return changes.map(function (c) { return (__assign({ key: c.payload.key }, c.payload.val())); });
        });
    }
    MytravelPage.prototype.ionViewDidLoad = function () {
        this.initMap();
        console.log('ionViewDidLoad MytravelPage');
    };
    MytravelPage.prototype.initMap = function () {
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
    MytravelPage.prototype.openModal = function (imgurl) {
        this.modal.create(ViewphotoPage, { imgurl: imgurl }).present();
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], MytravelPage.prototype, "mapElement", void 0);
    MytravelPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-mytravel',
            templateUrl: 'mytravel.html',
        }),
        __metadata("design:paramtypes", [ModalController, PlsdalaProvider, ToastController,
            NavController, NavParams])
    ], MytravelPage);
    return MytravelPage;
}());
export { MytravelPage };
//# sourceMappingURL=mytravel.js.map