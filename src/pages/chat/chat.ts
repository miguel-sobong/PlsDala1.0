import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import * as firebase from 'firebase';
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
  userInChat: any;
  newmessage: string;
  items: Observable<any>;
  link: any;
  check: boolean;
    
  constructor(public afd:  AngularFireDatabase, public navCtrl: NavController, 
    public navParams: NavParams, public plsdala: PlsdalaProvider) {
    this.user = this.navParams.get('item');
    firebase.database().ref('users/')
    .child(firebase.auth().currentUser.uid)
    .once('value', user => {
      console.log(user.val());
      this.loggedInUser = user;
      console.log(user.key);
      this.userInChat = user.key;
      var users = {
        user1: this.loggedInUser.key, 
        user2: this.user.userId
      };

      this.plsdala.getMessages(users)
      .then(data=>{
        this.items = this.afd.list('messages/' + data).snapshotChanges()
        .map(
          changes => {
            console.log('here');
            this.content.scrollToBottom();
            this.newmessage = '';
            return changes.map(c=>({
              key: c.payload.key, ...c.payload.val()
            }))
          })
      })

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  addMessage(){
    console.log(this.items);
    if(this.newmessage){
      var details = {
        content: this.newmessage,
        senderFirstname: this.loggedInUser.val().firtname,
        senderLastname: this.loggedInUser.val().lastname,
        receiverFirstname: this.user.firstname,
        receiverLastname: this.user.lastname
      }
      var users = {
        senderId: this.loggedInUser.key,
        receiverId: this.user.userId,
      }

      // {
      //   content: this.newmessage,
      //   sentBy: this.user.userId,
      //   name: localStorage.getItem('name'),
      // }

      this.plsdala.addMessage(details, users);
      // this.newmessage = '';
      // this.content.scrollToBottom();
      }
    }
  }  