import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterPage } from '../register/register';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CommonProvider } from '../../providers/common/common';
import { HomePage } from '../../pages/home/home';
import { EmailValidator } from '../../validator/email-validator';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	loginForm: FormGroup;

	constructor(public common: CommonProvider, public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder, public authenticationProvider: AuthenticationProvider, public alertController: AlertController, public loadingController: LoadingController, public toastController: ToastController) {
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
    else{
      var loader = this.loadingController.create({
        content: 'Please wait...'
      });
      loader.present();
      if(this.loginForm.valid){
        this.authenticationProvider.loginUser(this.loginForm.value.email, this.loginForm.value.password).then(authData=>{
          loader.dismiss();
          if(authData){
          localStorage.setItem('loggedIn', '1');
          localStorage.setItem('email', this.loginForm.value.email);
          console.log(localStorage.getItem('email'));
          this.navCtrl.setRoot(HomePage);
          }
          else{
            this.common.wrongEmailOrPassword();
          }
        }, error => {
          loader.dismiss();
          let toast = this.toastController.create({
             message: error,
             duration: 3000,
          })
        });
      }
      else{
        loader.dismiss();
        this.common.emailNotValid();
        }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToRegister(){
    this.navCtrl.push(RegisterPage);
  }

}
