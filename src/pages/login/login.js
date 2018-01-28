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
import { IonicPage, Events, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterPage } from '../register/register';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CommonProvider } from '../../providers/common/common';
import { HomePage } from '../../pages/home/home';
import { EmailValidator } from '../../validator/email-validator';
var LoginPage = /** @class */ (function () {
    function LoginPage(events, common, navCtrl, navParams, formBuilder, authenticationProvider, alertController, loadingController, toastController) {
        this.events = events;
        this.common = common;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.authenticationProvider = authenticationProvider;
        this.alertController = alertController;
        this.loadingController = loadingController;
        this.toastController = toastController;
        //validate if input is email
        this.loginForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['']
        });
    }
    LoginPage.prototype.loginUser = function () {
        var _this = this;
        if ((this.loginForm.value.email) == '' || this.loginForm.value.password == '') {
            this.common.isMissingInput();
        }
        else {
            var loader = this.loadingController.create({
                content: 'Please wait...'
            });
            loader.present();
            if (this.loginForm.valid) {
                this.authenticationProvider.loginUser(this.loginForm.value).then(function (success) {
                    console.log(success);
                    loader.dismiss();
                    _this.navCtrl.setRoot(HomePage);
                }, function (fail) {
                    loader.dismiss();
                    _this.toastController.create({
                        message: fail.message,
                        duration: 3000
                    }).present();
                });
            }
            else {
                loader.dismiss();
                this.common.emailNotValid();
            }
        }
    };
    LoginPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LoginPage');
    };
    LoginPage.prototype.goToRegister = function () {
        this.navCtrl.push(RegisterPage);
    };
    LoginPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-login',
            templateUrl: 'login.html',
        }),
        __metadata("design:paramtypes", [Events, CommonProvider, NavController, NavParams,
            FormBuilder, AuthenticationProvider, AlertController, LoadingController, ToastController])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map