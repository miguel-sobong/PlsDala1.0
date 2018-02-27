import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events,  ToastController, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { ChatlistPage } from '../pages/chatlist/chatlist';
import { AngularFireAuth } from 'angularfire2/auth';
import { TransactionsPage } from '../pages/transactions/transactions';
import { TransactionhistoryPage } from '../pages/transactionhistory/transactionhistory';
import { TermsandconditionPage } from '../pages/termsandcondition/termsandcondition';
import { LocalNotifications } from '@ionic-native/local-notifications'

import { AuthenticationProvider } from '../providers/authentication/authentication';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  public profileName: string;
  public profileEmail: string;
  public profileImage: string;
  pages: Array<{title: string, component: any, icon: string}>;
  isVerified: any;
  isTerminated: any;
  terminateNode;
  userNode;
  activePage: any;
  isDeclined;
  username;
  verificationNode;
  notifsNode;
  splash = true;

  constructor(public loadingCtrl: LoadingController, public afAuth: AngularFireAuth, public toastController: ToastController, 
    public alert: AlertController, public authenticationProvider: AuthenticationProvider, public events: Events, public platform: Platform,
   public statusBar: StatusBar, public splashScreen: SplashScreen, public localNotifs: LocalNotifications) {
    this.initializeApp();
    setTimeout(() => this.splash = false, 4000);
    if(!localStorage.getItem("verified")){
      localStorage.setItem("verified", "false");
    }
    if(!localStorage.getItem("decline")){
      localStorage.setItem("decline", "false");
    }
    if(!localStorage.getItem("notVerified")){
      localStorage.setItem("notVerified", "false");
    }
    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        if(!user.emailVerified){ 
          user.sendEmailVerification().then(()=>{
            this.alert.create({
              message: 'An email confirmation has been sent to ' + user.email,
              buttons: [{
                text: 'Ok',
                role: 'cancel'
              }]
            }).present();
          }); 
          this.authenticationProvider.logoutUser(); 
        }
        else //change to else later
        {
          firebase.database().ref('users').child(firebase.auth().currentUser.uid).update({emailVerified: true});
          var loader = this.loadingCtrl.create({
            content: 'Getting user data. Please wait'
          });
          loader.present();
          this.getUserInfo(user.uid).then(data=>{
            if(data)
            {
              loader.dismiss();  
              if(this.isTerminated == true)
              {
               this.terminateUserAlert();
              }
              else
              {
                this.setPages();
                this.createWatchers();
                this.rootPage = HomePage; //HomePage
                this.presentModalForVerification(this.isVerified, this.isDeclined);
              }     
            }
          })
        }
        // authObserver.unsubscribe();
      } else {
        this.rootPage = LoginPage; //HomePage
        if(this.terminateNode)
          this.terminateNode.off();
        if(this.userNode)
          this.userNode.off();
        if(this.verificationNode)
          this.verificationNode.off();
        if(this.notifsNode)
          this.notifsNode.off();
        // authObserver.unsubscribe();
      }
    });
  }

  createWatchers(){
    this.terminateNode = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
    this.terminateNode.on('child_changed', changes => {
       if(changes.key == "isTerminated" && changes.val() == true){
         this.terminateUserAlert();
      }
    });

   this.verificationNode = firebase.database().ref('users').child(firebase.auth().currentUser.uid);
   this.verificationNode.on("child_changed", changes =>{
     console.log('verificationNode');
     if(changes.key == "isVerified"){
       if(changes.val() == true && localStorage.getItem("verified") == "false"){
             this.alert.create({
               title: "Congratulations! You are now verified",
               message: "You can now add a travel plan and send items for other users to deliver!",
               inputs: [{
                 type: 'checkbox',
                 label: 'Don\'t show this again',
                 handler: data=>{
                   localStorage.setItem("verified", ""+data.checked+"");
                 }
               }], 
               buttons: [{
                 text: "Ok",
                 role: 'cancel',
               }]
             }).present();
       }
     }
     else if(changes.key == "isDeclined"){
       console.log('isDeclined');
       if(changes.val() == true && localStorage.getItem("decline") == "false"){
             this.alert.create({
               title: "Sorry, your verification is declined",
               inputs: [{
                 type: 'checkbox',
                 label: 'Don\'t show this again',
                 handler: data=>{
                   localStorage.setItem("decline", ""+data.checked+"");
                 }
               }], 
               buttons: [{
                 text: "Ok",
                 role: 'cancel',
               }]
             }).present();
       }
     }
    //this.verificationNode.off();
   });

    this.notifsNode = firebase.database().ref('user_notifications').child(firebase.auth().currentUser.uid);
    this.notifsNode.on("child_added", notifs=>{
      if(notifs.child('isDisplayed').val() == false){
        firebase.database().ref('user_notifications').child(firebase.auth().currentUser.uid).child(notifs.key).update({
          isDisplayed: true
        }).then(()=>{
          this.localNotifs.schedule({
            id: Math.round(Math.random() * 10000), 
            title:notifs.val().title,
            text:notifs.val().message
          })
        })
      }
    });
  }

  terminateUserAlert(){
    this.alert.create({
      title: "Your account has been terminated",
      message: "Termination of account is due to low average rating.",
      buttons: [{
        text: "Ok",
        role: 'cancel',
      }]
    }).present();
    this.authenticationProvider.logoutUser();
    this.rootPage = LoginPage;
  }

  getUserInfo(uid){
    return new Promise(resolve=>{
      this.userNode = firebase.database().ref('users/').child(uid);
      this.userNode.on('value', user => {
        this.profileName = user.val().firstname + ' ' + user.val().lastname;
        this.profileEmail = user.val().email;
        this.profileImage = user.val().profileimage;
        this.isVerified = user.val().isVerified;
        this.isTerminated = user.val().isTerminated;
        this.isDeclined = user.val().isDeclined;
        this.username = user.val().username;
        resolve(true);
      });
    })
  }

  setPages(){
    this.pages = [
      { title: 'Travel Board',component: HomePage, icon:"ios-paper-outline"},
      { title: 'Messages', component: ChatlistPage,icon:"ios-chatbubbles-outline"},
      { title: 'Transactions', component: TransactionsPage, icon:"ios-clipboard-outline"},
      { title: 'Transaction History', component: TransactionhistoryPage, icon:"ios-archive-outline"}
    ];
    this.activePage = this.pages[0];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  checkActive(page){
    return page == this.activePage;
  }

  openPage(page) {
    this.nav.setRoot(page.component);
    this.activePage=page;
  }

  openProfile(){
    this.nav.setRoot(ProfilePage);
  }

  logoutUser() 
  {
    this.alert.create({
      title: 'Logout',
      message: 'Do you really want to logout?',
      buttons: 
      [
        {
          text: 'Yes',
          handler: () => {
            this.authenticationProvider.logoutUser().then(success=>{
            }, fail => {
              this.toastController.create({
                 message: fail.message,
                 duration: 3000
              })
            })
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    }).present();
  }

  presentModalForVerification(isVerified, isDeclined){
    if(isVerified == false && localStorage.getItem("notVerified") == "false"){
      if(isDeclined == false){
        this.alert.create({
          title: "You are not verified",
          message: "Unverified users can't add a travel or send an item but you can still receive items.",
          inputs: [{
            type: 'checkbox',
            label: 'Don\'t show this again',
            handler: data=>{
              localStorage.setItem("notVerified", ""+data.checked+"");
           }
            }], 
            buttons: [{
              text: "Ok",
              role: 'cancel',
          }]
        }).present();
      }
      else{
        if(isDeclined == true && localStorage.getItem("decline") == "false"){
          this.alert.create({
            title: "Sorry, your verification is declined",
            inputs: [{
              type: 'checkbox',
              label: 'Don\'t show this again',
              handler: data=>{
                localStorage.setItem("decline", ""+data.checked+"");
              }
            }], 
            buttons: [{
              text: "Ok",
              role: 'cancel',
            }]
          }).present();
        }
      }
    }
    else if(isVerified == true && localStorage.getItem("verified") == "false"){
      this.alert.create({
        title: "Congratulations! You are now verified",
        message: "You can now add a travel plan and send items for other users to deliver!",
        inputs: [{
          type: 'checkbox',
          label: 'Don\'t show this again',
          handler: data=>{
            localStorage.setItem("verified", ""+data.checked+"");
          }
        }], 
        buttons: [{
          text: "Ok",
          role: 'cancel',
        }]
      }).present();
    }
  }

  termsandconditions(){
  	this.nav.setRoot(TermsandconditionPage);
  }

}
