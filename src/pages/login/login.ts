import { Component } from '@angular/core';
import { IonicPage, Events, NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RegisterPage } from '../register/register';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CommonProvider } from '../../providers/common/common';
import { ResetpasswordPage } from '../resetpassword/resetpassword';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	loginForm: FormGroup;

	constructor(public events: Events, public common: CommonProvider, public navCtrl: NavController,
    public formBuilder: FormBuilder, public authenticationProvider: AuthenticationProvider, public loadingController: LoadingController,
     public toastController: ToastController, public alert: AlertController) {
    //validate if input is email
    this.loginForm = formBuilder.group({ 
      username: [''], 
      password: ['']
    });
  }

  loginUser(){
    if((this.loginForm.value.username) == '' || this.loginForm.value.password == ''){
      this.common.isMissingInput();
    }
    else
    {
      if(this.loginForm.valid)
      {
        var loader = this.loadingController.create({
          content: 'Checking user database...'
        });
        loader.present();
        this.loginForm.value.username = this.loginForm.value.username.toLowerCase();
        this.authenticationProvider.checkLoginUsername(this.loginForm.value.username).then(email=>{
          this.authenticationProvider.loginUser(email, this.loginForm.value.password).then(success=>{
            loader.dismiss();
          }, 
            fail => {
               loader.dismiss();
              if(fail.code == "auth/wrong-password")
              {
                this.alert.create({
                  title: "Wrong Password",
                  message: 'Entered password is incorrect',
                  buttons: [{
                    text: "Ok",
                    role: 'cancel',
                  }]
                }).present();
              }
              else
              {
                this.alert.create({
                  message: fail.message,
                  buttons: [{
                    text: "Ok",
                    role: 'cancel',
                  }]
                }).present();
              }
              this.loginForm.reset();
          });
        }, fail=>{
          loader.dismiss();
          this.alert.create({
            title: this.loginForm.value.username + " is not yet registered",
            message: 'To register please click <i>"Register here!"</i> at bottom.',
            buttons: [{
              text: "Ok",
              role: 'cancel'
            }]
          }).present();
          this.loginForm.reset();
        });
      }
    }
  }

  goToRegister(){
    this.navCtrl.push(RegisterPage);
  }


  forgotPassword(){
    this.navCtrl.push(ResetpasswordPage);
  }
}
