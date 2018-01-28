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
import { IonicPage, NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonProvider } from '../../providers/common/common';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { EmailValidator } from '../../validator/email-validator';
import { HomePage } from '../../pages/home/home';
var RegisterPage = /** @class */ (function () {
    function RegisterPage(common, toastController, loadingController, navCtrl, formBuilder, authenticationProvider, alertController) {
        this.common = common;
        this.toastController = toastController;
        this.loadingController = loadingController;
        this.navCtrl = navCtrl;
        this.formBuilder = formBuilder;
        this.authenticationProvider = authenticationProvider;
        this.alertController = alertController;
        this.registerForm = formBuilder.group({
            lastname: [''],
            firstname: [''],
            birthdate: [''],
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password1: ['', Validators.compose([Validators.minLength(6), Validators.required])],
            password2: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });
    }
    RegisterPage.prototype.registerUser = function () {
        var _this = this;
        if (this.registerForm.value.lastname == '' || this.registerForm.value.firstname == '' || this.registerForm.value.birthdate == ''
            || this.registerForm.value.email == '' || this.registerForm.value.password1 == '' || this.registerForm.value.password2 == '') {
            this.common.isMissingInput();
        }
        else {
            var loader = this.loadingController.create({
                content: 'Please wait...'
            });
            loader.present();
            if (this.registerForm.valid && this.registerForm.value.password1 == this.registerForm.value.password2) {
                this.authenticationProvider.registerUser(this.registerForm.value)
                    .then(function (success) {
                    loader.dismiss();
                    _this.toastController.create({
                        message: 'Account registered!',
                        duration: 3000,
                    }).present();
                    _this.navCtrl.setRoot(HomePage);
                }, function (fail) {
                    loader.dismiss();
                    _this.toastController.create({
                        message: fail.message,
                        duration: 3000,
                    }).present();
                });
            }
            else {
                loader.dismiss();
                this.common.emailNotValidAndPassword();
            }
        }
    };
    RegisterPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-register',
            templateUrl: 'register.html',
        }),
        __metadata("design:paramtypes", [CommonProvider, ToastController,
            LoadingController, NavController,
            FormBuilder, AuthenticationProvider, AlertController])
    ], RegisterPage);
    return RegisterPage;
}());
export { RegisterPage };
//# sourceMappingURL=register.js.map