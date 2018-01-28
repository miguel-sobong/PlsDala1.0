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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddtravelPage } from '../addtravel/addtravel';
import { MytravelPage } from '../../pages/mytravel/mytravel';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import * as firebase from 'firebase';
var MytravelsPage = /** @class */ (function () {
    function MytravelsPage(plsdala, navCtrl, navParams) {
        var _this = this;
        this.plsdala = plsdala;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.travelList = [];
        this.currentUserId = firebase.auth().currentUser.uid;
        firebase.database().ref('users').child(this.currentUserId).child('travels').on('value', function (snapshot) {
            snapshot.forEach(function (snap) {
                firebase.database().ref('travels').child(snap.key).once('value', function (data) {
                    _this.travelList.push(data.val());
                });
                return false;
            });
        });
        // this.travelList$ = this.plsdala.getTravelList()
        // .snapshotChanges()
        // .map(
        //   changes => {
        //     return changes.map(c=>({
        //       key: c.payload.key, ...c.payload.val()
        //     })).slice().reverse(); //to reverse order
        //   });
    }
    MytravelsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad MytravelsPage');
    };
    MytravelsPage.prototype.addTravel = function (event) {
        this.navCtrl.push(AddtravelPage);
    };
    MytravelsPage.prototype.itemTapped = function (event, item) {
        this.navCtrl.push(MytravelPage, {
            item: item
        });
    };
    MytravelsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-mytravels',
            templateUrl: 'mytravels.html',
        }),
        __metadata("design:paramtypes", [PlsdalaProvider, NavController, NavParams])
    ], MytravelsPage);
    return MytravelsPage;
}());
export { MytravelsPage };
//# sourceMappingURL=mytravels.js.map