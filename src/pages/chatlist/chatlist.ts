import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { ContinuechatPage } from '../../pages/continuechat/continuechat';
/**
 * Generated class for the ChatlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
    console.log('ionViewDidLoad ChatlistPage');
  }

  messageUser(event, item){
    console.log(item);
    this.plsdala.getUserInChatList(item.key).then(data=>{
      console.log(data);
    });

    this.navCtrl.push(ContinuechatPage, {
      item: item
    });
  }
    // this.user = this.navParams.get('item');
    // var users = {
    //   user1: localStorage.getItem('id'), 
    //   user2: this.user.userId
    // };
    
}
