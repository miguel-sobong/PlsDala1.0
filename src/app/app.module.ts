import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DatePipe } from '@angular/common'
import * as firebase from 'firebase';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { AddtravelPage } from '../pages/addtravel/addtravel';
import { MapPage } from '../pages/map/map';
import { TravelPage } from '../pages/travel/travel';
import { AdditemPage } from '../pages/additem/additem';
import { ChatPage } from '../pages/chat/chat';
import { ChatlistPage } from '../pages/chatlist/chatlist';
import { ContinuechatPage } from '../pages/continuechat/continuechat';
import { ProfilePage } from '../pages/profile/profile';
import { ViewprofilePage } from '../pages/viewprofile/viewprofile';
import { ChoosereceiverPage } from '../pages/choosereceiver/choosereceiver';
import { MytravelsPage } from '../pages/mytravels/mytravels';
import { MytravelPage } from '../pages/mytravel/mytravel';
import { ViewphotoPage } from '../pages/viewphoto/viewphoto';
import { TransactionsPage } from '../pages/transactions/transactions';
import { ViewmapPage } from '../pages/viewmap/viewmap';
import { TransactionhistoryPage } from '../pages/transactionhistory/transactionhistory';
import { ReviewPage } from '../pages/review/review';

import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore'; 

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { CommonProvider } from '../providers/common/common';
import { PlsdalaProvider } from '../providers/plsdala/plsdala';

import { Camera } from '@ionic-native/camera';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse} from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
  // Initialize Firebase
  var firebaseConfig = {
    apiKey: "AIzaSyATmp3oSFtqK4gHK2ZQs9-NBrBYcXjvakc",
    authDomain: "plsdala-8609a.firebaseapp.com",
    databaseURL: "https://plsdala-8609a.firebaseio.com",
    projectId: "plsdala-8609a",
    storageBucket: "plsdala-8609a.appspot.com",
    messagingSenderId: "861667074134"
  };
  firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    AddtravelPage,
    MapPage,
    TravelPage,
    AdditemPage,
    ChatPage,
    ChatlistPage,
    ContinuechatPage,
    ProfilePage,
    ViewprofilePage,
    ChoosereceiverPage,
    MytravelsPage,
    MytravelPage,
    ViewphotoPage,
    TransactionsPage,
    ViewmapPage,
    TransactionhistoryPage,
    ReviewPage
  ],
  imports: [
    BrowserModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    AddtravelPage,
    MapPage,
    TravelPage,
    AdditemPage,
    ChatPage,
    ChatlistPage,
    ContinuechatPage,
    ProfilePage,
    ViewprofilePage,
    ChoosereceiverPage,
    MytravelsPage,
    MytravelPage,
    ViewphotoPage,
    TransactionsPage,
    ViewmapPage,
    TransactionhistoryPage,
    ReviewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    CommonProvider,
    PlsdalaProvider,
    Camera,
    DatePipe,
    BackgroundGeolocation,
    Geolocation
  ]
})
export class AppModule {}
