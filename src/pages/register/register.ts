import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonProvider } from '../../providers/common/common';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { EmailValidator } from '../../validator/email-validator';
import { HomePage } from '../../pages/home/home';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

	registerForm: FormGroup;
  minBday = new Date(new Date().setFullYear(new Date().getFullYear()-18));
  constructor(public common: CommonProvider, public toastController: ToastController,
   public loadingController: LoadingController, public navCtrl: NavController,
    public formBuilder: FormBuilder, public authenticationProvider: AuthenticationProvider, public alertController: AlertController) {
        console.log(this.minBday);
        // this.minBday.setFullYear(this.minBday.getFullYear()-18);
        // console.log(this.minBday);
        this.registerForm = formBuilder.group({
        lastname: [''],
        firstname: [''],
        birthdate: [''],
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password1: ['', Validators.compose([Validators.minLength(6), Validators.required])],
        password2: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  registerUser()
  {
    if(this.registerForm.value.lastname == '' || this.registerForm.value.firstname == '' || this.registerForm.value.birthdate == ''
      || this.registerForm.value.email == '' || this.registerForm.value.password1 == '' || this.registerForm.value.password2 == '')
    {
      this.common.isMissingInput();
    }
    else
    {
      var loader = this.loadingController.create({
        content: 'Please wait...'
      });
      loader.present();
      if(this.registerForm.valid && this.registerForm.value.password1 == this.registerForm.value.password2)
      {
        this.authenticationProvider.registerUser(this.registerForm.value)
        .then(success=>
        {
          loader.dismiss();
          this.toastController.create({
             message: 'Account registered!',
             duration: 3000,
          }).present();
          this.navCtrl.setRoot(HomePage);
        }, fail=>
        {
          loader.dismiss();
          this.toastController.create({
             message: fail.message,
             duration: 3000,
          }).present();
        });
      }
      else
      {
        loader.dismiss();
        this.common.emailNotValidAndPassword();
      }
    }
  }
}