import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild('content') content: Content;

  user: any;
  loggedInUser: any;
  newmessage: string;
  items: Observable<any>;
  link: any;
  check: boolean;
    
  constructor(public afd:  AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, public plsdala: PlsdalaProvider) {
    
    this.loggedInUser = localStorage.getItem('name');
    this.user = this.navParams.get('item');

    this.plsdala.getMessages({user1: localStorage.getItem('id'), user2: this.user.userId})
    .then(data=>{
      this.items = this.afd.list('messages/' + data).snapshotChanges()
      .map(
        changes => {
          this.content.scrollToBottom();
          return changes.map(c=>({
            key: c.payload.key, ...c.payload.val()
          }))
        }
        );
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  addMessage(){
    console.log(this.items);
    if(this.newmessage){
      this.plsdala.addMessage({
        content: this.newmessage,
        sentBy: this.user.userId,
        name: localStorage.getItem('name'),
      }, {
        user1: localStorage.getItem('id'),
        user2: this.user.userId
      });
      this.content.scrollToBottom();
      this.newmessage = '';
      }
    }
  }  