import { Component, ViewChild, ElementRef } from '@angular/core';
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

    this.loggedInUser = localStorage.getItem('id');
    console.log(this.loggedInUser);
    this.user = this.navParams.get('item');
    console.log(this.user);
    var users = {
      user1: localStorage.getItem('id'), 
      user2: this.user.userId
    };
    this.plsdala.getMessages(users)
    .then(data=>{
      console.log(data);
      this.items = this.afd.list('messages/' + data).snapshotChanges()
      .map(
        changes => {
          return changes.map(c=>({
            key: c.payload.key, ...c.payload.val()
          }))
        })
    })
  }

  ngAfterViewInit() {
    this.content.scrollToBottom(0);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  addMessage(){
    console.log(this.items);
    if(this.newmessage){
      var details = {
        content: this.newmessage,
        senderFirstname: localStorage.getItem('firstname'),
        senderLastname: localStorage.getItem('lastname'),
        receiverFirstname: this.user.firstname,
        receiverLastname: this.user.lastname
      }
      var users = {
        senderId: localStorage.getItem('id'),
        receiverId: this.user.userId
      }

      // {
      //   content: this.newmessage,
      //   sentBy: this.user.userId,
      //   name: localStorage.getItem('name'),
      // }

      this.plsdala.addMessage(details, users);
      // this.content.scrollToBottom();
      this.newmessage = '';
      }
    }
  }  