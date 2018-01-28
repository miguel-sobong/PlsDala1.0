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
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
var ContinuechatPage = /** @class */ (function () {
    function ContinuechatPage(afd, navCtrl, navParams) {
        var _this = this;
        this.afd = afd;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        firebase.database().ref('users/')
            .child(firebase.auth().currentUser.uid)
            .once('value', function (user) {
            _this.user = user;
            _this.loggedInUser = user.key;
            _this.selectedItem = navParams.get('item');
            console.log(_this.selectedItem);
            _this.chatName = _this.selectedItem['title'];
            _this.items = _this.afd.list('messages/' + _this.selectedItem['key']).snapshotChanges()
                .map(function (changes) {
                _this.content.scrollToBottom();
                return changes.map(function (c) { return (__assign({ key: c.payload.key }, c.payload.val())); });
            });
        });
    }
    ContinuechatPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ContinuechatPage');
    };
    ContinuechatPage.prototype.addMessage = function () {
        var _this = this;
        if (this.newmessage) {
            var newMessage = this.afd.list('messages/' + this.selectedItem['key']).push({});
            newMessage.set({
                content: this.newmessage,
                senderFirstname: this.user.val().firstname,
                senderLastname: this.user.val().lastname,
                senderId: this.user.key,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            var check = firebase.database().ref('threads');
            check.once('value', function (snapshot) {
                snapshot.forEach(function (snap) {
                    if (snap.hasChild(_this.selectedItem['key'])) {
                        firebase.database().ref().child('threads/').child(snap.key).child(_this.selectedItem['key']).update({
                            lastMessage: _this.user.val().firstname + ' ' + _this.user.val().lastname + ': ' + _this.newmessage,
                            seen: false,
                            timestamp: firebase.database.ServerValue.TIMESTAMP
                        }).then(function (_) {
                            firebase.database().ref('threads/').child(_this.loggedInUser).child(_this.selectedItem['key']).update({
                                seen: true
                            });
                            return true;
                        });
                    }
                    return false;
                });
                _this.newmessage = '';
            });
        }
    };
    __decorate([
        ViewChild('content'),
        __metadata("design:type", Content)
    ], ContinuechatPage.prototype, "content", void 0);
    ContinuechatPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-continuechat',
            templateUrl: 'continuechat.html',
        }),
        __metadata("design:paramtypes", [AngularFireDatabase, NavController, NavParams])
    ], ContinuechatPage);
    return ContinuechatPage;
}());
export { ContinuechatPage };
//# sourceMappingURL=continuechat.js.map