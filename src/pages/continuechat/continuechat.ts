import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { ViewphotoPage } from '../viewphoto/viewphoto';
import {  ViewprofilePage } from '../viewprofile/viewprofile';
import { ProfilePage } from '../profile/profile';
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
  	userInChat: any;
    user: any;
    username: any;

  constructor(public modal: ModalController, public plsdala: PlsdalaProvider, public afd: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    firebase.database().ref('users/')
    .child(firebase.auth().currentUser.uid)
    .once('value', user => {
      this.username = user.val().username;
      this.user = user;
      this.userInChat = user.key;
      this.selectedItem = navParams.get('item');
      this.chatName = this.selectedItem['title'];
      this.items = this.afd.list('messages/' + this.selectedItem['key'], ref=> ref.orderByChild("timestamp")).snapshotChanges()
        .map(
          changes => {
            return changes.map(c=>({
              key: c.payload.key, ...c.payload.val()
            }))
          });
    });
  }

  addMessage()
  {
	  if(this.newmessage)
    {
	  	const newMessage = this.afd.list('messages/' + this.selectedItem['key']).push({});
	  	newMessage.set({
	  		content: this.newmessage,
	  		senderId: this.user.key,
        senderName: `${this.user.val().firstname} ${this.user.val().lastname} (${this.username})`,
	  		timestamp: firebase.database.ServerValue.TIMESTAMP
	  	});
      const check = firebase.database().ref('threads');
      check.once('value', snapshot=>{
        snapshot.forEach(snap=>{
          if(snap.key != firebase.auth().currentUser.uid)
            this.plsdala.sendNotifs(snap.key, 'New Message', `${this.user.val().firstname} ${this.user.val().lastname} (${this.user.val().username}): ${this.newmessage}`);
          firebase.database().ref().child('threads/').child(snap.key).child(this.selectedItem['key']).update({
            lastMessage: this.user.val().firstname + ' ' + this.user.val().lastname + ': ' + this.newmessage,
            seen: false,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(_=>{
            firebase.database().ref('threads/').child(this.userInChat).child(this.selectedItem['key']).update({
              seen: true
            });
            return true;
          });
          return false;
        })
      this.newmessage = '';
      });
      this.content.scrollToBottom();
	  }
  }

  openModal(imgurl){
    this.modal.create(ViewphotoPage, {imgurl: imgurl}).present();
  }

  viewProfile(key){
    if(key == this.user)
      this.navCtrl.push(ProfilePage);
    else
      this.navCtrl.push(ViewprofilePage, {item: key});
  }

  Accept(item){
    var usersWithReceiver = {
      user1: item.courierId,
      user2: item.senderId,
      user3: item.receiverId
      };
    var senderName;
    firebase.database().ref('users').child(item.senderId).once("value", snapshot=>{
      senderName = `${snapshot.val().firstname} ${snapshot.val().lastname} (${snapshot.val().username})`; 
    })
    this.plsdala.addReceiverInChat(usersWithReceiver).then(key=>{
      console.log(key, item.key);
      this.plsdala.getUsersInThree(usersWithReceiver, key);
      firebase.database().ref('messages/' + this.selectedItem['key']).child(item.key).update({
        isAccepted: true
      })
      .then(()=>{
        this.plsdala.sendNotifs(item.senderId, 'Item Delivery', `${this.username} has accepted the delivery request`);
        this.plsdala.sendNotifs(item.receiverId, 'Item Delivery', `${senderName} has sent you an item via ${this.username}`);
        firebase.database().ref('messages/' + key + '/' + item.key).update({
          courierId: item.courierId,
          images: item.images,
          isAccepted: true,
          isDeclined: false,
          isItem: true,
          itemName: item.itemName,
          key: item.key,
          receiverId: item.receiverId,
          receiverName: item.receiverName,
          senderName: senderName,
          senderId: item.senderId,
          timestamp: item.timestamp,
          threadId: this.selectedItem['key'],
          msgId: item.key,
          receiverAccepted: false,
          travelKey: item.travelKey
        });
        this.plsdala.addTransaction(item, senderName);
      })
    })
  }

  Decline(item){
    firebase.database().ref('messages/' + this.selectedItem['key']).child(item.key).update({
      isDeclined: true
     });  
  }

  ionViewDidLeave(){
    firebase.database().ref('threads').child(firebase.auth().currentUser.uid).child(this.selectedItem['key']).update({
      seen: true
    });
  }
}
