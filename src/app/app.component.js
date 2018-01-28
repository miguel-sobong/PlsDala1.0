var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
import { AuthenticationProvider } from '../providers/authentication/authentication';
var MyApp = /** @class */ (function () {
    function MyApp(loadingCtrl, afAuth, toastController, alert, authenticationProvider, events, platform, statusBar, splashScreen) {
        var _this = this;
        this.loadingCtrl = loadingCtrl;
        this.afAuth = afAuth;
        this.toastController = toastController;
        this.alert = alert;
        this.authenticationProvider = authenticationProvider;
        this.events = events;
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.initializeApp();
        var authObserver = afAuth.authState.subscribe(function (user) {
            if (user) {
                _this.setPages();
                _this.getUserInfo(user.uid);
                _this.rootPage = HomePage;
                // authObserver.unsubscribe();
            }
            else {
                _this.rootPage = LoginPage;
                // authObserver.unsubscribe();
            }
        });
    }
    MyApp.prototype.getUserInfo = function (uid) {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'Getting user data. Please wait'
        });
        loader.present().then(function (_) {
            firebase.database().ref('users/').child(uid).on('value', function (user) {
                _this.profileName = user.val().firstname + ' ' + user.val().lastname;
                _this.profileEmail = user.val().email;
                _this.profileImage = user.val().profileimage;
            });
        }).then(function (_) {
            loader.dismiss();
        });
    };
    MyApp.prototype.setPages = function () {
        this.pages = [
            { title: 'Travel Board', component: HomePage },
            { title: 'My Travels', component: MytravelsPage },
            { title: 'Messages', component: ChatlistPage }
        ];
    };
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        this.nav.setRoot(page.component);
    };
    MyApp.prototype.openProfile = function () {
        this.nav.setRoot(ProfilePage);
    };
    MyApp.prototype.logoutUser = function () {
        var _this = this;
        var alert = this.alert.create({
            title: 'Logout',
            message: 'Do you really want to logout?',
            buttons: [
                {
                    text: 'Yes',
                    handler: function () {
                        _this.authenticationProvider.logoutUser().then(function (success) {
                            localStorage.clear();
                            _this.rootPage = LoginPage;
                        }, function (fail) {
                            _this.toastController.create({
                                message: fail.message,
                                duration: 3000
                            });
                        });
                    }
                },
                {
                    text: 'No',
                    role: 'cancel'
                }
            ]
        }).present();
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [LoadingController, AngularFireAuth, ToastController, AlertController,
            AuthenticationProvider, Events, Platform,
            StatusBar, SplashScreen])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map