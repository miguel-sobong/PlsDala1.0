import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  user: any;
  messageList$: Observable<any>;
  loggedInUser: any;
  	
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
  	this.plsdala.addMessage(1, 2);
  }

}
