import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { ContinuechatPage } from '../../pages/continuechat/continuechat';
@IonicPage()
@Component({
  selector: 'page-chatlist',
  templateUrl: 'chatlist.html',
})
export class ChatlistPage {
  items: any;
  chatList$: Observable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public plsdala: PlsdalaProvider) {
  	this.chatList$ = this.plsdala.getChatList()
    .snapshotChanges()
    .map(
      changes => {
        return changes.map(c=>({
          key: c.payload.key, ...c.payload.val()
        })).slice().reverse();
      });
  }

  ionViewDidLoad() {
    firebase.database().ref('user_notifications').child(firebase.auth().currentUser.uid).remove();
  }

  messageUser(event, item){
    console.log(item);
    this.plsdala.getUserInChatList(item.key);

    this.navCtrl.push(ContinuechatPage, {
      item: item
    });

    firebase.database().ref('threads/').child(firebase.auth().currentUser.uid)
    .child(item.key).update({seen:true});
  }
}