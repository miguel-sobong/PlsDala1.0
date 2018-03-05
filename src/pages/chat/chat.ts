import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ModalController } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { ViewphotoPage } from '../viewphoto/viewphoto';
import { Observable } from 'rxjs/Observable';
import { ViewprofilePage } from '../viewprofile/viewprofile';
import { ProfilePage } from '../profile/profile';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

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
  key: any;
  chatName: any;
  username: any;
    
  constructor(public modal: ModalController, public afd:  AngularFireDatabase, public navCtrl: NavController, 
    public navParams: NavParams, public plsdala: PlsdalaProvider) {
    this.user = this.navParams.get('item');
    this.chatName = this.user.firstname + ' ' + this.user.lastname;
    console.log(this.user);
    firebase.database().ref('users/')
    .child(firebase.auth().currentUser.uid)
    .once('value', user => {
      this.loggedInUser = user;
      this.userInChat = user.key; 
      this.username = `${user.val().firstname} ${user.val().lastname} (${user.val().username})`;
      var users = {
        user1: this.loggedInUser.key, 
        user2: this.user.userId
      };
        this.plsdala.getMessages(users)
        .then(data=>{
          this.key = data;
          this.items = this.afd.list('messages/' + data, ref=> ref.orderByChild("timestamp")).snapshotChanges()
          .map(
            changes => {
              return changes.map(c=>(
              {
                key: c.payload.key, ...c.payload.val()
              } 
              ))
            })
        })
      });
    }

  addMessage(){
    if(this.newmessage){
      var message = this.newmessage;
      var details = {
        content: message,
        receiverFirstname: this.user.firstname,
        senderName: `${this.username}`,
        receiverLastname: this.user.lastname
      }
      var users = {
        senderId: firebase.auth().currentUser.uid,
        receiverId: this.user.userId,
      };
      this.plsdala.addMessage(details, users);
      this.plsdala.sendNotifs(this.user.userId, 'New Message', `${this.username}: ${message}`);
      this.newmessage = '';
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

  Accept(item)
  {
    var usersWithReceiver = {
      user1: item.courierId,
      user2: item.senderId,
      user3: item.receiverId
      };
    var senderName;
    firebase.database().ref('users').child(item.senderId).once("value", snapshot=>{
      senderName = `${snapshot.val().firstname} ${snapshot.val().lastname} (${snapshot.val().username})`; 
    });
    this.plsdala.addReceiverInChat(usersWithReceiver).then(key=>{
      this.plsdala.getUsersInThree(usersWithReceiver, key);
      firebase.database().ref('messages/' + this.key).child(item.key).update({
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
          threadId: this.key,
          msgId: item.key,
          receiverAccepted: false,
          travelKey: item.travelKey
        });
      })
      .then(()=>{
        this.plsdala.addTransaction(item, senderName);
      });
    })
  }

  Decline(item){
    firebase.database().ref('messages/' + this.key).child(item.key).update({
      isDeclined: true
     });  
  }
}  