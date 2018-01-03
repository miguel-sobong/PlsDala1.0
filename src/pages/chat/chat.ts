import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild('content') content: Content;

  user: any;
  messageList$: Observable<any>;
  loggedInUser: any;
  newmessage: string;
  	
  constructor(public navCtrl: NavController, public navParams: NavParams, public plsdala: PlsdalaProvider) {
  	    this.loggedInUser = localStorage.getItem('name');
  	    this.user = navParams.get('item');
		this.messageList$ = this.plsdala.getMessage()
	    .snapshotChanges()
	    .map(
	      changes => {
	        return changes.map(c=>({
	          key: c.payload.key, ...c.payload.val()
	        }))
	      }
	      );
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad ChatPage');
  }

  addMessage(){
    if(this.newmessage){
    	this.plsdala.addMessage(this.newmessage, 2).then(()=>{
        this.content.scrollToBottom();
        this.newmessage = '';
      });
    }
  }

}
