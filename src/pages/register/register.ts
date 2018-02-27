import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonProvider } from '../../providers/common/common';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { EmailValidator } from '../../validator/email-validator';

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
                this.navCtrl.pop();
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
    return "<h1>Terms and Conditions</h1>" +
    "<h5>Scope of PlsDala</h5>" +
    "The PlsDala is a mobile application that enables verified users (who offer services " +
    "while they are travelling are called as a “Courier”) to post (“a post is called Travel " +
    "Plan”) delivery services and to communicate and transact directly with verified users " +
    "that are seeking to avail such delivery services (verified users using delivery services " +
    "are called a “Sender”). A “Sender” must specify the recipient (“Receiver”) of the item " +
    "to be delivered, a recipient must be a registered user of PlsDala." +
    "<p></p>"+
    "PlsDala does not own, create, provide, control, manage, offer, deliver, or supply any " +
    "Travel Plan posts. Couriers are responsible for handling the items they deliver." +
    "<p></p>"+
              "<h5>Risk of Loss or Damage</h5>"+
              "All items are delivered through a user (Courier) therefore it is his/her sole "+
              "responsibility to handle the items. PlsDala does not take responsibility for any "+
              "loss or damaged items."+
              "<p></p>"+
              "Payment is a choice and done through the negotiation between user (Courier) "+
              "and user (Sender), therefore PlsDala does not take responsibility of any unpaid "+
              "delivery or deliveries, or for any failed/cancelled delivery or deliveries."+
              "<p></p>"+
              "When verified users make a travel plan or accept a delivery service request, they are "+
              "entering into an agreement directly with each other.<b>PlsDala is not and does not</b> "+
              "<b>become a party to or other participant in any agreement relationship between</b> "+
              "<b>users, nor is PlsDala a logistics service provider.</b> " +
    "<p></p>"+
    "<b>PlsDala has no control over and does not guarantee</b> "+
    "(i) the existence, quality, safety, suitability, or legality of any Travel Plan or Delivery "+
    "Services, (ii) the truth or accuracy of any Travel Plan, user descriptions, Ratings and "+
    "Reviews, Sender Item picture, or other user content, or (iii) Any references to a user "+
    "being <q>verified</q> (or similar language) only indicate that the user has completed a "+
    "relevant verification or identification process and nothing else. Any such description is "+
    "not an endorsement, certification or guarantee by PlsDala about any verified user, "+
    "including of the verified user's identity or background or whether the verified user is "+
    "trustworthy, safe or suitable. "+
    "<p></p>"+
    "Due to the nature of the Internet, PlsDala cannot guarantee the continuous and "+
    "uninterrupted availability and accessibility of the PlsDala mobile application."+
    "<p></p>"+
    "Some areas of the PlsDala mobile application implement Google Maps/Earth mapping "+
    "services, including Google Maps API(s). Your use of Google Maps/Earth is subject to "+
    "the Google Maps/Google Earth Additional Terms of Service."+
    "<p></p>"+
    "<h5>Eligibility to use PlsDala</h5>"+
    "<b>A user must at least be 18 years old</b> and able to enter into legally binding contracts "+
    "to access and use PlsDala mobile application or register an account. By accessing or "+
    "using PlsDala mobile application you represent and warrant that you are 18 or older "+
    "and have the legal capacity and authority to enter into a contract."+
    "<p></p>"+
    "<h5>Account Registration</h5>"+
    "You may not register more than one (1) PlsDala Account and you may not assign or "+
    "otherwise transfer your account to another party."+
    "<p></p>"+
    "<h5>Content</h5>"+
    "You will not post, upload, publish, submit or transmit any user content that: (i) is "+
    "fraudulent, false, misleading (directly or by omission or failure to update information) "+
    "or deceptive; (ii) is defamatory, libelous, obscene, pornographic, vulgar or offensive; "+
    "(iii) promotes discrimination, bigotry, racism, hatred, harassment or harm against any "+
    "individual or group; (iv) is violent or threatening or promotes violence or actions that "+
    "are threatening to any other person; (v) promotes illegal or harmful activities or "+
    "substances."+
    "<p></p>"+
              "<h5>Reviews, Rating and Comments</h5>"+
              "Users may post reviews, comments, and other content: and submit suggestions, "+
              "ideas, comments, questions, or other information, so long as the content is not "+
              "illegal, obscene, threatening, defamatory, invasive of privacy. "+
              "When users will have a rating below the threshold, the system will display it to "+
              "the administrators and the administrators will review their comments and "+
              "reviews section and will have the authority to terminate an account."+
    "<p></p>"+
    "<h5>Disclaimer</h5>"+
    "PlsDala makes no representation, warranty, or guarantee regarding the reliability, "+
    "timeliness, quality, suitability or availability of the services or any services or goods "+
    "requested through the use of the services, or that the services will be uninterrupted "+
    "or error-free."+
    "<p></p>"+
    "You acknowledge that PlsDala has no obligation to ensure (i) users’ compliance with "+
    "these Terms; (ii) comply with applicable law or the order or requirement of a court, "+
    "law enforcement or other administrative agency or governmental body."+
    "<p></p>"+
    "If you feel that any user you interact with, whether online or in person, is acting or has "+
    "acted inappropriately, including but not limited to anyone who (iii) engages in "+
    "offensive, violent or sexually inappropriate behavior, (iv) you suspect of stealing from "+
    "you, or (iv) engages in any other disturbing conduct, you should immediately report "+
    "such person to the appropriate authorities and then to PlsDala by contacting us with "+
    "your police station and report number (if available); provided that your report will not "+
    "obligate us to take any action beyond that required by law (if any) or cause us to incur "+
    "any liability to you."+
    "<p></p>"+
    "You agree that some Experiences, Events or other Courier delivery services may carry "+
    "inherent risk, and by participating in a transaction, you choose to assume those risks "+
    "voluntarily. You assume full responsibility for the choices you make before, during and "+
    "after your participation in a transaction. "+
    "<p></p>"+
    "<p></p>"+
    "<h1>End-User License Agreement</h1>"+
    "<h7>Last updated: Feb. 21, 2018</h7>"+
    "<p></p>"+
    "Please read this End-User License Agreement (<q>Agreement</q>) carefully before clicking "+
    "the <q>I Agree</q> button, downloading or using PlsDala mobile application."+
    "<p></p>"+
    "By clicking the <q>checkbox</q>, downloading or using the Application, you are "+
    "agreeing to be bound by the terms and conditions of this Agreement."+
    "<p></p>"+
    "If you do not agree to the terms of this Agreement, do not click on the <q>checkbox<q> "+
    "and do not download or use the Application."+
    "<p></p>"+
    "<h5>License</h5>"+
    "PlsDala grants you a revocable, non-exclusive, non-transferable, limited license to "+
    "download, install and use the Application solely for your personal, non-commercial "+
    "purposes strictly in accordance with the terms of this Agreement."+
    "<p></p>"+
    "<h5>Restrictions</h5>"+
    "You agree not to, and you will not permit others to:<br> "+
    "a) license, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or "+
    "otherwise commercially exploit the Application or make the Application available to "+
    "any third party."+
    "<p></p>"+
    "<h5>Term and Termination</h5>"+
    "This Agreement shall remain in effect until terminated by you or PlsDala. PlsDala may, "+
    "in its sole discretion, at any time and for any or no reason, suspend or terminate this "+
    "Agreement with or without prior notice."+
    "<p></p>"+
    "This Agreement will terminate immediately, without prior notice from PlsDala, in the "+
    "event that you fail to comply with any provision of this Agreement. You may also "+
    "terminate this Agreement by deleting the Application and all copies thereof from your "+
    "mobile device."+
    "<p></p>"+
    "Upon termination of this Agreement, you shall cease all use of the Application and "+
    "delete all copies of the Application from your mobile device."+
    "<p></p>"+
    "<h5>Severability</h5>"+
    "If any provision of this Agreement is held to be unenforceable or invalid, such "+
    "provision will be changed and interpreted to accomplish the objectives of such "+
    "provision to the greatest extent possible under applicable law and the remaining "+
    "provisions will continue in full force and effect."+
    "<p></p>"+
    "<h5>Amendments to this Agreement</h5>"+
    "PlsDala reserves the right, at its sole discretion, to modify or replace this Agreement "+
    "at any time. What constitutes a material change will be determined at our sole "+
    "discretion."
      }


}