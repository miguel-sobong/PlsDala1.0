import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonProvider } from '../../providers/common/common';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { EmailValidator } from '../../validator/email-validator';
import { HomePage } from '../../pages/home/home';
import * as firebase from 'firebase';

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
   public formBuilder: FormBuilder, public authenticationProvider: AuthenticationProvider, public alertController: AlertController)
   {
     this.registerForm = formBuilder.group({
       lastname: [''],
       firstname: [''],
       birthdate: [''],
       email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
       username: [''],
       password1: ['', Validators.compose([Validators.minLength(6), Validators.required])],
       password2: ['', Validators.compose([Validators.minLength(6), Validators.required])],
       termsandconditions: []
     });

   }


  registerUser()
  {
    if(this.registerForm.value.lastname == '' || this.registerForm.value.firstname == '' || this.registerForm.value.birthdate == ''
      || this.registerForm.value.email == '' || this.registerForm.value.username == '' || this.registerForm.value.password1 == '' || 
      this.registerForm.value.password2 == '')
    {
      this.common.isMissingInput();
    }
    else
    {
      if(this.registerForm.value.termsandconditions){
        var loader = this.loadingController.create({
          content: 'Please wait...'
        });
        loader.present();
        if(this.registerForm.valid && this.registerForm.value.password1 == this.registerForm.value.password2)
        {
          this.registerForm.value.username = this.registerForm.value.username.toLowerCase();
          this.authenticationProvider.checkUsernameAndEmail(this.registerForm.value.username, this.registerForm.value.email).then(fail=>{
            loader.dismiss();
            if(fail == "email-fail"){
               this.alertController.create({
                 message: this.registerForm.value.email + " is already registered to our system.",
                 buttons: [{
                   text: "Ok",
                   role: 'cancel',
                 }]
               }).present();
            }
            else if(fail == "username-fail"){
             this.alertController.create({
               message: this.registerForm.value.username + " is already taken. Please input choose another username.",
               buttons: [{
                 text: "Ok",
                 role: 'cancel',
               }]
             }).present();
            }
            else{
              this.authenticationProvider.registerUser(this.registerForm.value)
              .then(success=>
              {
                loader.dismiss();
                this.toastController.create({
                   message: 'Account registered!',
                   duration: 3000,
                }).present();
                localStorage.setItem("notVerified", "false"); // for home popup
                localStorage.setItem("verified", "false");
                localStorage.setItem("decline", "false");
                // this.navCtrl.pop();
              }, fail=>{
                this.alertController.create({
                  message: fail.message,
                  buttons: [{
                    text: 'Ok',
                    role: 'cancel'
                  }]
                }).present();
              });
            }
          });
        }
        else
        {
          loader.dismiss();
          this.common.emailNotValidAndPassword();//not valid
        }
      }
      else{
        this.alertController.create({
          message: "You need to accept PlsDala's Terms and Conditions to register in our application",
          buttons: [{
            text: "Ok",
            role: 'cancel',
          }]
        }).present();//accept terms and conditions
      }
    }
  }

  viewTermsAndConditions(){
    this.alertController.create({
      title: "PlsDala's Terms and Conditions",
      message: this.termsAndConditions(),
      buttons: [{
        text: "Ok",
        role: 'cancel',
      }]
    }).present();
  }

  termsAndConditions(){
    return "<h2>1. Disclaimer</h2>PlsDala makes no representation, warranty, or guarantee" + 
    " regarding the reliability, timeliness, quality, suitability or availability of the services or any services" + 
    " or goods requested through the use of the services, or that the services will be uninterrupted or error-free." + 
    "<h2>2. Reviews, Rating and Comments</h2>Users may post reviews, comments, or other information, so long as the " + 
    "content is not illegal, obscene, threatening, defamatory, and invasive of privacy.<br>When users will have a rating " +
    "below the threshold, the system will display it to the administrators and the administrators will review their comments and" +
    "and reviews section and will have the authority to terminate an account.<h2>3. Risk of Loss or Damage</h2>All items are delivered " +
    "through a User (Courier) therefore it is their sole responsibility to handle the items. PlsDala does not take responsibility for" +
    " any loss or damaged items. Payment is done through the negotiation between User (Courier) and User (Sender), therefore PlsDala " +
    "does not take responsibility of any unpaid delivery or deliveries.";
  }
}