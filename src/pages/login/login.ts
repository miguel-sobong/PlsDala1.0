import { Component } from '@angular/core';
import { IonicPage, Events, NavController, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterPage } from '../register/register';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CommonProvider } from '../../providers/common/common';
import { HomePage } from '../../pages/home/home';
import { EmailValidator } from '../../validator/email-validator';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	loginForm: FormGroup;

	constructor(public events: Events, public common: CommonProvider, public navCtrl: NavController,
    public formBuilder: FormBuilder, public authenticationProvider: AuthenticationProvider, public loadingController: LoadingController, public toastController: ToastController) {
    //validate if input is email
    this.loginForm = formBuilder.group({ 
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])], 
      password: ['']
    });
  }

  loginUser(){
    if((this.loginForm.value.email) == '' || this.loginForm.value.password == ''){
      this.common.isMissingInput();
    }
    else
    {
      if(this.loginForm.valid)
      {
        this.authenticationProvider.loginUser(this.loginForm.value).then(success=>{
        }, fail => {
          this.toastController.create({
             message: fail.message,
             duration: 3000
          }).present();
        });
      }
      else
      {
        this.common.emailNotValid();
      }
    }
  }

  goToRegister(){
    this.navCtrl.push(RegisterPage);
  }
}
