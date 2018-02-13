import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events,  ToastController, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { ChatlistPage } from '../pages/chatlist/chatlist';
import { MytravelsPage } from '../pages/mytravels/mytravels';
import { AngularFireAuth } from 'angularfire2/auth';
import { TransactionsPage } from '../pages/transactions/transactions';
import { TransactionhistoryPage } from '../pages/transactionhistory/transactionhistory';

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
  pages: Array<{title: string, component: any}>;
  isVerified: any;
  UserIsVerified: any;
  isTerminated: any;
  terminateNode;
  userNode;

  constructor(public loadingCtrl: LoadingController, public afAuth: AngularFireAuth, public toastController: ToastController, 
    public alert: AlertController, public authenticationProvider: AuthenticationProvider, public events: Events, public platform: Platform,
   public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
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
              this.rootPage = HomePage; //HomePage
              this.presentModalForVerification(this.isVerified);
              this.createWatchers();
            }     
          }
        })
        // authObserver.unsubscribe();
      } else {
        console.log(this.terminateNode, this.userNode);
        if(this.terminateNode)
          this.terminateNode.off();
        if(this.userNode)
          this.userNode.off();
        this.rootPage = LoginPage;
        // authObserver.unsubscribe();
      }
    });
  }

  createWatchers(){
    this.terminateNode = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
    this.terminateNode.on('child_changed', changes => {
      console.log(changes.key, changes.val());
       if(changes.key == "isTerminated" && changes.val() == true){
         this.terminateUserAlert();
      }
    });
  }

  terminateUserAlert(){
    this.alert.create({
      title: "Your account has been terminated",
      message: "Termination of account may be due to low average rating.",
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
        resolve(true);
      });
    })
  }

  setPages(){
    this.pages = [
      { title: 'Travel Board', component: HomePage },
      // { title: 'My Travels', component: MytravelsPage },
      { title: 'Messages', component: ChatlistPage },
      { title: 'Transactions', component: TransactionsPage},
      { title: 'Transaction History', component: TransactionhistoryPage}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
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
              this.rootPage = LoginPage;
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

  presentModalForVerification(isVerified){
    var checked;
    if(isVerified == false && localStorage.getItem("notVerified") == "false"){
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
    else if(isVerified == true && localStorage.getItem("verified") == "false"){
          this.alert.create({
            title: "Congratulations! You are now verified :)",
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
}
