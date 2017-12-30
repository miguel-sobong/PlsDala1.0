import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonProvider } from '../../providers/common/common';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { EmailValidator } from '../../validator/email-validator';

import { HomePage } from '../../pages/home/home';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

	registerForm: FormGroup;
  
  constructor(public common: CommonProvider, public toastController: ToastController, public loadingController: LoadingController, public navCtrl: NavController, public formBuilder: FormBuilder, public authenticationProvider: AuthenticationProvider, public alertController: AlertController) {
  	    this.registerForm = formBuilder.group({
        lastname: [''],
        firstname: [''],
        birthdate: [''],
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password1: ['', Validators.compose([Validators.minLength(6), Validators.required])],
        password2: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registerUser(){
    if((this.registerForm.value.lastname == '' || this.registerForm.value.firstname == '' || this.registerForm.value.birthdate == ''
      || this.registerForm.value.email) == '' || this.registerForm.value.password1 == '' || this.registerForm.value.password2 == ''){
        this.common.isMissingInput();
          }
    else{
      var loader = this.loadingController.create({
        content: 'Please wait...'
      });
      loader.present();
      if(this.registerForm.valid){
      this.authenticationProvider.registerUser(this.registerForm.value.lastname, this.registerForm.value.firstname, this.registerForm.value.birthdate,
      this.registerForm.value.email.toLowerCase(), this.registerForm.value.password1).then(authData=>
      {
        loader.dismiss();
        if(authData){
        this.toastController.create({
           message: 'Account registered!',
           duration: 3000,
        }).present();
        localStorage.setItem('loggedIn', '1');
        localStorage.setItem('email', this.registerForm.value.email);
        console.log(localStorage.getItem('email'));
        this.navCtrl.setRoot(HomePage);
        }
      }, error => {
        loader.dismiss();
        this.toastController.create({
           message: error,
           duration: 3000,
        }).present();
      }, error => {
        console.log('error');
      });
      }else{
        loader.dismiss();
        this.common.emailNotValidAndPassword();
      }
    }

  }
}