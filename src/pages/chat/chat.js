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
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
var ChatPage = /** @class */ (function () {
    function ChatPage(afd, navCtrl, navParams, plsdala) {
        var _this = this;
        this.afd = afd;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.plsdala = plsdala;
        this.user = this.navParams.get('item');
        firebase.database().ref('users/')
            .child(firebase.auth().currentUser.uid)
            .once('value', function (user) {
            console.log(user.val());
            _this.loggedInUser = user;
            console.log(user.key);
            _this.userInChat = user.key;
            var users = {
                user1: _this.loggedInUser.key,
                user2: _this.user.userId
            };
            _this.plsdala.getMessages(users)
                .then(function (data) {
                _this.items = _this.afd.list('messages/' + data).snapshotChanges()
                    .map(function (changes) {
                    console.log('here');
                    _this.content.scrollToBottom();
                    _this.newmessage = '';
                    return changes.map(function (c) { return (__assign({ key: c.payload.key }, c.payload.val())); });
                });
            });
        });
    }
    ChatPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ChatPage');
    };
    ChatPage.prototype.addMessage = function () {
        console.log(this.items);
        if (this.newmessage) {
            var details = {
                content: this.newmessage,
                senderFirstname: this.loggedInUser.val().firtname,
                senderLastname: this.loggedInUser.val().lastname,
                receiverFirstname: this.user.firstname,
                receiverLastname: this.user.lastname
            };
            var users = {
                senderId: this.loggedInUser.key,
                receiverId: this.user.userId,
            };
            // {
            //   content: this.newmessage,
            //   sentBy: this.user.userId,
            //   name: localStorage.getItem('name'),
            // }
            this.plsdala.addMessage(details, users);
            // this.newmessage = '';
            // this.content.scrollToBottom();
        }
    };
    __decorate([
        ViewChild('content'),
        __metadata("design:type", Content)
    ], ChatPage.prototype, "content", void 0);
    ChatPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-chat',
            templateUrl: 'chat.html',
        }),
        __metadata("design:paramtypes", [AngularFireDatabase, NavController,
            NavParams, PlsdalaProvider])
    ], ChatPage);
    return ChatPage;
}());
export { ChatPage };
//# sourceMappingURL=chat.js.map