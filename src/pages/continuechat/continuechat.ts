import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
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
  	loggedInUser: any;
    user: any;

  constructor(public modal: ModalController, public plsdala: PlsdalaProvider, public afd: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    firebase.database().ref('users/')
    .child(firebase.auth().currentUser.uid)
    .once('value', user => {
      this.user = user;
      this.loggedInUser = user.key;
      this.selectedItem = navParams.get('item');
      console.log(this.selectedItem);
      console.log(this.selectedItem);
      this.chatName = this.selectedItem['title'];
      this.items = this.afd.list('messages/' + this.selectedItem['key']).snapshotChanges()
        .map(
          changes => {
            return changes.map(c=>({
              key: c.payload.key, ...c.payload.val()
            }))
          });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContinuechatPage');
  }
    ngOnInit() { 
        this.content.scrollToBottom();
    }

    ngAfterViewChecked() {        
        this.content.scrollToBottom();        
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
      });
      this.content.scrollToBottom();
      this.newmessage = '';
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
    console.log(this.items);
    console.log(item);
    var usersWithReceiver = {
      user1: item.courierId,
      user2: item.senderId,
      user3: item.receiverId
      };
    this.plsdala.addReceiverInChat(usersWithReceiver).then(key=>{
      console.log(key, item.key);
      this.plsdala.getUsersInThree(usersWithReceiver, key);
      firebase.database().ref('messages/' + this.selectedItem['key']).child(item.key).update({
        isAccepted: true
      });
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
        senderFirstname: item.senderFirstname,
        senderId: item.senderId,
        senderLastname: item.senderLastname,
        timestamp: item.timestamp,
        threadId: this.selectedItem['key'],
        msgId: item.key,
        receiverAccepted: false,
        travelKey: item.travelKey
      });
    });
  }

  openChat(key){
   firebase.database().ref('threads').child(firebase.auth().currentUser.uid).child(key).once("value", snapshot=>{
     console.log(snapshot.val());
      this.navCtrl.push(ContinuechatPage, {
       item: {
         title: snapshot.val().title,
         key: snapshot.key
       }
     });
   });
  }

  Decline(item){
    firebase.database().ref('messages/' + this.selectedItem['key']).child(item.key).update({
      isDeclined: true
     });  
  }

  AcceptReceiver(item){
    firebase.database().ref('messages/').once("value", snapshot=>{
      snapshot.forEach(snap=>{
        if(snap.hasChild(item.key)){
          firebase.database().ref('messages').child(snap.key).child(item.key).update({
            receiverAccepted: true
          })
        }
        return false;
      });

      this.plsdala.addTransaction(item);
    });
    console.log(item);
  }
}
