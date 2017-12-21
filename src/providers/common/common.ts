import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';

/*
  Generated class for the CommonProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommonProvider {

  constructor(public alertController: AlertController, public loadingController: LoadingController ) {
    console.log('Hello CommonProvider Provider');
  }

    isMissingInput(){
      let alert = this.alertController.create({
        message: "Please fill all the input fields.",
        buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]});
      alert.present();
  }

  wrongEmailOrPassword(){
          let alert = this.alertController.create({
          message: "Wrong email address or password credentials. Please try again",
          buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]});
      alert.present();
  }

  emailNotValid(){
      let alert = this.alertController.create({
        message: "Email address is not valid",
        buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]});
      alert.present();
  }

  emailNotValidAndPassword(){
      let alert = this.alertController.create({
        message: "Email address is not valid or password doesn't match",
        buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]});
      alert.present();
  }

}
