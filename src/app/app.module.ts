import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { AddtravelPage } from '../pages/addtravel/addtravel';
import { MapPage } from '../pages/map/map';
import { TravelPage } from '../pages/travel/travel';

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

  // Initialize Firebase
  var firebaseConfig = {
    apiKey: "AIzaSyATmp3oSFtqK4gHK2ZQs9-NBrBYcXjvakc",
    authDomain: "plsdala-8609a.firebaseapp.com",
    databaseURL: "https://plsdala-8609a.firebaseio.com",
    projectId: "plsdala-8609a",
    storageBucket: "plsdala-8609a.appspot.com",
    messagingSenderId: "861667074134"
  };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    AddtravelPage,
    MapPage,
    TravelPage
  ],
  imports: [
    BrowserModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    AddtravelPage,
    MapPage,
    TravelPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    CommonProvider,
    PlsdalaProvider,
  ]
})
export class AppModule {}
