var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
var AuthenticationProvider = /** @class */ (function () {
    function AuthenticationProvider() {
    }
    AuthenticationProvider.prototype.registerUser = function (userData) {
        return firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password1).then(function (user) {
            console.log(user);
            firebase.database().ref().child('users').child(user.uid).set({
                lastname: userData.lastname,
                firstname: userData.firstname,
                birthdate: userData.birthdate,
                email: user.email,
                password: userData.password1,
                id: user.uid,
                profileimage: "https://firebasestorage.googleapis.com/v0/b/plsdala-8609a.appspot.com/o/users%2Fdefault.jpg?alt=media&token=fce4cb44-fc6e-4b05-a1c3-29a18833b515",
                isVerified: 0,
                isTerminated: 0,
                isDeclined: 0,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        });
    };
    //login users
    AuthenticationProvider.prototype.loginUser = function (userData) {
        return firebase.auth().signInWithEmailAndPassword(userData.email, userData.password);
        //query users table here using success.uid then check for if the users is verified
    };
    AuthenticationProvider.prototype.logoutUser = function () {
        return new Promise(function (resolve, reject) {
            firebase.auth().signOut().then(function (user) {
                return resolve(user);
            }, function (error) {
                return reject(error);
            });
        });
    };
    AuthenticationProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], AuthenticationProvider);
    return AuthenticationProvider;
}());
export { AuthenticationProvider };
//# sourceMappingURL=authentication.js.map