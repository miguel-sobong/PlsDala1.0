import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, AlertController, ToastController, LoadingController } from 'ionic-angular';
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

  constructor(public loadingCtrl: LoadingController, public afAuth: AngularFireAuth, public toastController: ToastController, public alert: AlertController, 
    public authenticationProvider: AuthenticationProvider, public events: Events, public platform: Platform,
   public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    var loader = this.loadingCtrl.create({
      content: 'Getting user data. Please wait'
    });
    loader.present();
    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        this.setPages();
        this.getUserInfo(user.uid).then(data=>{
          if(data){
            this.rootPage = HomePage;
            loader.dismiss();
          }
        })
        // authObserver.unsubscribe();
      } else {
        this.rootPage = LoginPage;
        loader.dismiss();
        // authObserver.unsubscribe();
      }
    });
  }

  getUserInfo(uid){
    return new Promise(resolve=>{
      firebase.database().ref('users/').child(uid).on('value', user => {
        this.profileName = user.val().firstname + ' ' + user.val().lastname;
        this.profileEmail = user.val().email;
        this.profileImage = user.val().profileimage;
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
    let alert = this.alert.create({
      title: 'Logout',
      message: 'Do you really want to logout?',
      buttons: 
      [
        {
          text: 'Yes',
          handler: () => {
            this.authenticationProvider.logoutUser().then(success=>{
              localStorage.clear();
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
}
