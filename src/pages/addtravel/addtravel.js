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
import { IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { MapPage } from '../map/map';
import { CommonProvider } from '../../providers/common/common';
import { MytravelsPage } from '../mytravels/mytravels';
var AddtravelPage = /** @class */ (function () {
    function AddtravelPage(common, loadingCtrl, formBuilder, toastCtrl, navCtrl, navParams, modalCtrl, plsdala, alertCtrl) {
        this.common = common;
        this.loadingCtrl = loadingCtrl;
        this.formBuilder = formBuilder;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.plsdala = plsdala;
        this.alertCtrl = alertCtrl;
        this.today = new Date();
        this.addTravelForm = formBuilder.group({
            toLocation: '',
            toDate: '',
            fromLocation: '',
            fromDate: ''
        });
    }
    AddtravelPage.prototype.addTravel = function () {
        var _this = this;
        var toDate = new Date(this.addTravelForm.value.toDate);
        var fromDate = new Date(this.addTravelForm.value.fromDate);
        // var options = {month: 'short', day: 'numeric', year: 'numeric'};
        // console.log(toDate.getTime() == fromDate.getTime());
        // console.log(toDate.getTime() > fromDate.getTime())
        // var a = new Date(toDate.toLocaleString("en-US", options));
        // var b = new Date(fromDate.toLocaleString("en-US", options));
        // console.log(a.getTime());
        if (this.addTravelForm.value.toLocation == '' || this.addTravelForm.value.toDate == ''
            || this.addTravelForm.value.fromLocation == '' || this.addTravelForm.value.fromDate == '') {
            this.common.isMissingInput();
        }
        else if (toDate.getTime() < fromDate.getTime()) {
            this.alertCtrl.create({
                message: "Arrival date is earlier than departure date",
                buttons: [
                    {
                        text: "Ok",
                        role: 'cancel'
                    }
                ]
            }).present();
        }
        else {
            var loader = this.loadingCtrl.create({
                content: 'Please wait...'
            });
            loader.present();
            this.plsdala.addTravel(this.toData, this.fromData, this.addTravelForm.value.toDate, this.addTravelForm.value.fromDate).then(function (added) {
                _this.toastCtrl.create({
                    message: 'Added to travel list!',
                    duration: 3000
                }).present();
                loader.dismiss();
                _this.navCtrl.pop();
                _this.navCtrl.setRoot(MytravelsPage);
            }, function (error) {
                _this.toastCtrl.create({
                    message: error,
                    duration: 3000,
                }).present();
                loader.dismiss();
            });
        }
    };
    AddtravelPage.prototype.toLocation = function () {
        var _this = this;
        var modal = this.modalCtrl.create(MapPage, {
            data: {
                x: '',
                y: '',
                address: ''
            }
        });
        modal.onDidDismiss(function (data) {
            console.log(data);
            if (data != null) {
                _this.toData = data;
                _this.addTravelForm.value.toLocation = data.address;
                console.log(_this.addTravelForm.value.toLocation);
            }
        });
        modal.present();
    };
    AddtravelPage.prototype.fromLocation = function () {
        var _this = this;
        var modal = this.modalCtrl.create(MapPage, {
            data: {
                x: '',
                y: '',
                address: ''
            }
        });
        modal.onDidDismiss(function (data) {
            if (data != null) {
                console.log(data);
                _this.fromData = data;
                _this.addTravelForm.value.fromLocation = data.address;
                console.log(_this.addTravelForm.value.fromLocation);
            }
            else {
                _this.toastCtrl.create({
                    message: 'Error getting information from marker',
                    duration: 3000
                }).present();
            }
        });
        modal.present();
    };
    AddtravelPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewiDydLoad AddtravelPage');
    };
    AddtravelPage.prototype.Cancel = function () {
        this.navCtrl.pop();
    };
    AddtravelPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-addtravel',
            templateUrl: 'addtravel.html',
        }),
        __metadata("design:paramtypes", [CommonProvider, LoadingController, FormBuilder,
            ToastController, NavController, NavParams,
            ModalController, PlsdalaProvider, AlertController])
    ], AddtravelPage);
    return AddtravelPage;
}());
export { AddtravelPage };
//# sourceMappingURL=addtravel.js.map