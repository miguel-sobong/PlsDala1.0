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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { ContinuechatPage } from '../../pages/continuechat/continuechat';
/**
 * Generated class for the ChatlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ChatlistPage = /** @class */ (function () {
    function ChatlistPage(navCtrl, navParams, plsdala) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.plsdala = plsdala;
        this.chatList$ = this.plsdala.getChatList()
            .snapshotChanges()
            .map(function (changes) {
            return changes.map(function (c) { return (__assign({ key: c.payload.key }, c.payload.val())); });
        });
    }
    ChatlistPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ChatlistPage');
    };
    ChatlistPage.prototype.messageUser = function (event, item) {
        console.log(item);
        this.plsdala.getUserInChatList(item.key).then(function (data) {
            console.log(data);
        });
        this.navCtrl.push(ContinuechatPage, {
            item: item
        });
        // this.navCtrl.push(ChatPage,{
        //    item: item.user1
        //  });
    };
    ChatlistPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-chatlist',
            templateUrl: 'chatlist.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, PlsdalaProvider])
    ], ChatlistPage);
    return ChatlistPage;
}());
export { ChatlistPage };
//# sourceMappingURL=chatlist.js.map