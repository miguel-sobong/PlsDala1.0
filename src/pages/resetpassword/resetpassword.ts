import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala'

@IonicPage()
@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html',
})
export class ResetpasswordPage {
	recoveryEmail: any;
	recoveryUsername: any;
	recoveryCode: any;
  constructor(public plsdala: PlsdalaProvider, public toastController: ToastController, public navCtrl: NavController, public navParams: NavParams, public alert: AlertController, public loading: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetpasswordPage');
  }

  submitRecover(){
  	if(this.recoveryEmail)
  	{
	    firebase.auth().sendPasswordResetEmail(this.recoveryEmail).then(success=>{
	      this.toastController.create({
	        message: `Password reset link sent to ${this.recoveryEmail}`,
	        duration: 3000
	      }).present();
	      this.recoveryEmail = '';
	    }).catch(error=>{
	    	if(error.code == 'auth/invalid-email')
	    	{
	    		this.alert.create({
	    			message: 'Invalid email format',
	    			buttons: [{
	    				text: 'Ok',
	    				role: 'cancel'
	    			}]
	    		}).present();
	    	}
	    	else if(error.code == 'auth/user-not-found')
	    	{
	  			this.alert.create({
	  				message: `${this.recoveryEmail} is not yet registered`,
	  				buttons: [{
	  					text: 'Ok',
	  					role: 'cancel'
	  				}]
	  			}).present();

	    	}
	    	else
	    	{
		      this.alert.create({
		        message: error.message,
		        buttons: [{
		          text: "Ok",
		          role: 'cancel',
		        }]
		      }).present();
	    	}
	    	this.recoveryEmail = '';
	    });
    }
    else
    {
    	this.alert.create({
    		message: 'Please input email address to send reset password link to',
    		buttons: [{
    			text: 'Ok',
    			role: 'cancel'
    		}]
    	}).present();
    }
  }

  sendWithUnameAndPassword()
  {
  	if(this.recoveryEmail != '')
  	{
  		var checker = false;
  		var loader = this.loading.create({
  			content: 'Getting user details'
  		});
  		loader.present();
	  	firebase.database().ref('users').once('value', snapshot=>{
	  		snapshot.forEach(user=>{
	  			if(user.val().email == this.recoveryEmail)
	  			{
	  				var subject = 'Account Credentials Recovery';
	  				var content = `Account credentials below, please make sure your connection is secure.
	  				<br><br>--------------------------------------------<br>
	  				username: ${user.val().username}<br>
	  				password: ${user.val().password}
	  				<br>--------------------------------------------<br><br>
	  				If you didn’t ask to send your credentials, you can ignore this email.`;
					this.plsdala.sendEmail(user.val().email, subject, content);
	    			this.toastController.create({
	    				message: `Credentials sent to ${this.recoveryEmail}`,
	    				duration: 3000
	    			}).present();
	    			this.recoveryEmail = '';
					checker = true;
	  				return true;
	  			}
	  			return false;
	  		});
	  		loader.dismiss();
	  		if(checker == false)
	  		{
	  			this.alert.create({
	  				message: `${this.recoveryEmail} is not yet registered`,
	  				buttons: [{
	  					text: 'Ok',
	  					role: 'cancel'
	  				}]
	  			}).present();
	    		this.recoveryEmail = '';
	  		}
	  	});
  	}
    else
    {
	  	loader.dismiss();
    	this.alert.create({
    		message: 'Please input email address to send credentials to',
    		buttons: [{
    			text: 'Ok',
    			role: 'cancel'
    		}]
    	}).present();
    }
  }
}
