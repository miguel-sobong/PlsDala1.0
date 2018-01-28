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
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { ViewprofilePage } from '../viewprofile/viewprofile';
import * as firebase from 'firebase';
var ChoosereceiverPage = /** @class */ (function () {
    function ChoosereceiverPage(viewCtrl, loadingCtrl, plsdala, navCtrl, navParams) {
        this.viewCtrl = viewCtrl;
        this.loadingCtrl = loadingCtrl;
        this.plsdala = plsdala;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        var loader = this.loadingCtrl.create({
            content: 'Getting user list'
        });
        this.user = firebase.auth().currentUser.uid;
        loader.present();
        this.userlist = this.plsdala.getUserList()
            .snapshotChanges()
            .map(function (changes) {
            return changes.map(function (c) { return (__assign({ key: c.payload.key }, c.payload.val())); });
        });
        loader.dismiss();
    }
    ChoosereceiverPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ChoosereceiverPage');
    };
    ChoosereceiverPage.prototype.viewProfile = function (key) {
        this.navCtrl.push(ViewprofilePage, { item: key });
    };
    ChoosereceiverPage.prototype.AddReceiver = function (item) {
        this.viewCtrl.dismiss({
            name: item.firstname + " " + item.lastname + "(" + item.email + ")",
            uid: item.id
        });
    };
    ChoosereceiverPage.prototype.Cancel = function () {
        this.navCtrl.pop();
    };
    ChoosereceiverPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-choosereceiver',
            templateUrl: 'choosereceiver.html',
        }),
        __metadata("design:paramtypes", [ViewController, LoadingController, PlsdalaProvider,
            NavController, NavParams])
    ], ChoosereceiverPage);
    return ChoosereceiverPage;
}());
export { ChoosereceiverPage };
//# sourceMappingURL=choosereceiver.js.map