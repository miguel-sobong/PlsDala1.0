import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-continuechat',
  templateUrl: 'continuechat.html',
})
export class ContinuechatPage {
  	@ViewChild('content') content: Content;
	chatName: string;
	newmessage: string;
	selectedItem: string;
  	items: Observable<any>;
  	loggedInUser: any;
    user: any;

  constructor(public afd: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    firebase.database().ref('users/')
    .child(firebase.auth().currentUser.uid)
    .once('value', user => {
      this.user = user;
      this.loggedInUser = user.key;
      this.selectedItem = navParams.get('item');
      console.log(this.selectedItem);
      this.chatName = this.selectedItem['title'];
      this.items = this.afd.list('messages/' + this.selectedItem['key']).snapshotChanges()
        .map(
          changes => {
            this.content.scrollToBottom();
            return changes.map(c=>({
              key: c.payload.key, ...c.payload.val()
            }))
          });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContinuechatPage');
  }

  addMessage()
  {
	  if(this.newmessage)
    {
	  	const newMessage = this.afd.list('messages/' + this.selectedItem['key']).push({});
	  	newMessage.set({
	  		content: this.newmessage,
	  		senderFirstname: this.user.val().firstname,
	  		senderLastname: this.user.val().lastname,
	  		senderId: this.user.key,
	  		timestamp: firebase.database.ServerValue.TIMESTAMP
	  	});
      const check = firebase.database().ref('threads');
      check.once('value', snapshot=>{
        snapshot.forEach(snap=>{
          if(snap.hasChild(this.selectedItem['key'])){
            firebase.database().ref().child('threads/').child(snap.key).child(this.selectedItem['key']).update({
              lastMessage: this.user.val().firstname + ' ' + this.user.val().lastname + ': ' + this.newmessage,
              seen: false,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            }).then(_=>{
              firebase.database().ref('threads/').child(this.loggedInUser).child(this.selectedItem['key']).update({
                seen: true
              });
              return true;
            });
          }
          return false;
        })
        this.newmessage = '';
      });
	  }
  }

}
