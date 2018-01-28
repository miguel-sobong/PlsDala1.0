var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
/*
  Generated class for the CommonProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var CommonProvider = /** @class */ (function () {
    function CommonProvider(alertController, loadingController) {
        this.alertController = alertController;
        this.loadingController = loadingController;
        console.log('Hello CommonProvider Provider');
    }
    CommonProvider.prototype.isMissingInput = function () {
        this.alertController.create({
            message: "Please fill all the input fields.",
            buttons: [
                {
                    text: "Ok",
                    role: 'cancel'
                }
            ]
        }).present();
    };
    CommonProvider.prototype.wrongEmailOrPassword = function () {
        this.alertController.create({
            message: "Wrong email address or password credentials. Please try again",
            buttons: [
                {
                    text: "Ok",
                    role: 'cancel'
                }
            ]
        }).present();
    };
    CommonProvider.prototype.emailNotValid = function () {
        this.alertController.create({
            message: "Email address is not valid",
            buttons: [
                {
                    text: "Ok",
                    role: 'cancel'
                }
            ]
        }).present();
    };
    CommonProvider.prototype.emailNotValidAndPassword = function () {
        this.alertController.create({
            message: "Email address is not valid or password doesn't match",
            buttons: [
                {
                    text: "Ok",
                    role: 'cancel'
                }
            ]
        }).present();
    };
    CommonProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AlertController, LoadingController])
    ], CommonProvider);
    return CommonProvider;
}());
export { CommonProvider };
//# sourceMappingURL=common.js.map