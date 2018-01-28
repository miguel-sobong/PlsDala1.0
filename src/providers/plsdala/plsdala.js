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
;
import { ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import firebase from 'firebase';
var PlsdalaProvider = /** @class */ (function () {
    function PlsdalaProvider(toastCtrl, afd, http) {
        var _this = this;
        this.toastCtrl = toastCtrl;
        this.afd = afd;
        this.http = http;
        this.db = firebase.database().ref();
        this.baseUrl = 'https://plsdala-8609a.firebaseio.com/';
        this.travelList = this.afd.list('travels');
        firebase.database().ref('users/')
            .child(firebase.auth().currentUser.uid)
            .once('value', function (user) {
            _this.user = user;
        });
    }
    PlsdalaProvider.prototype.addTravel = function (to, from, toDate, fromDate) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var newTravel = _this.travelList.push({});
            newTravel.set({
                fromX: from.x,
                fromY: from.y,
                fromAddress: from.address,
                fromDate: fromDate,
                toX: to.x,
                toY: to.y,
                toAddress: to.address,
                toDate: toDate,
                firstname: _this.user.val().firstname,
                lastname: _this.user.val().lastname,
                email: _this.user.val().email,
                userId: _this.user.key
            });
            var updateUser = firebase.database().ref('users').child(firebase.auth().currentUser.uid).child('travels').update((_a = {},
                _a[newTravel.key] = true,
                _a))
                .then(function (newTravel) {
                resolve(true);
                return;
            }, function (error) {
                reject('Cannot connect to the database');
                return;
            });
            var _a;
        });
    };
    PlsdalaProvider.prototype.getTravelList = function () {
        return this.afd.list('travels');
    };
    PlsdalaProvider.prototype.getUserList = function () {
        return this.afd.list('users');
    };
    PlsdalaProvider.prototype.checkUsers = function (users) {
        console.log('run');
        return new Promise(function (resolve, reject) {
            var clUserCount = Object.keys(users).length;
            var dbUserCount = 0;
            var finalCheck = 0;
            var threadId;
            var checkUsersInDb = firebase.database().ref('thread_users');
            checkUsersInDb.on('value', function (snapshot) {
                //for adding when no thread is present
                if (!snapshot.val()) {
                    resolve(null);
                }
                snapshot.forEach(function (snap) {
                    snap.forEach(function (snap2) {
                        for (var user in users) {
                            if (threadId) {
                                break;
                            }
                            if (snap2.key == users[user]) {
                                finalCheck++;
                                console.log(finalCheck);
                                if (finalCheck == clUserCount) {
                                    threadId = snap.key;
                                    resolve(threadId);
                                    return true;
                                }
                                break;
                            }
                        }
                        dbUserCount++;
                        return false;
                    });
                    finalCheck = 0;
                    return false;
                });
                resolve(null);
                return;
            });
        });
    };
    PlsdalaProvider.prototype.getMessages = function (users) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.checkUsers(users).then(function (data) {
                if (data) {
                    resolve(data);
                    return;
                }
                else {
                    var newThread = _this.afd.list('thread_users').push({});
                    newThread.set((_a = {},
                        _a[users.user1] = true,
                        _a[users.user2] = true,
                        _a));
                    _this.newThreadKey = newThread.key;
                    resolve(newThread.key);
                }
                return;
                var _a;
            });
        });
    };
    PlsdalaProvider.prototype.addMessage = function (details, users) {
        var _this = this;
        this.checkUsers(users).then(function (data) {
            console.log(_this.user.key);
            console.log(users);
            if (data) {
                var newMessage = _this.afd.list('messages/' + data).push({});
                newMessage.set({
                    content: details.content,
                    senderFirstname: _this.user.val().firstname,
                    senderLastname: _this.user.val().lastname,
                    senderId: _this.user.key,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
                firebase.database().ref().child('threads/' + _this.user.key + '/' + data).update({
                    title: details.receiverFirstname + ' ' + details.receiverLastname,
                    lastMessage: _this.user.val().firstname + ' ' + _this.user.val().lastname + ': ' + details.content,
                    seen: true,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
                firebase.database().ref().child('threads/' + users.receiverId + '/' + data).update({
                    title: _this.user.val().firstname + ' ' + _this.user.val().lastname,
                    lastMessage: _this.user.val().firstname + ' ' + _this.user.val().lastname + ': ' + details.content,
                    seen: false,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
            }
        });
    };
    PlsdalaProvider.prototype.getChatList = function () {
        return this.afd.list('threads/' + this.user.key);
    };
    PlsdalaProvider.prototype.getUserInChatList = function (threadId) {
        return new Promise(function (resolve) {
            var checkUsersInDb = firebase.database().ref('thread_users/' + threadId);
            checkUsersInDb.once('value', function (snapshot) {
                resolve(snapshot.val());
                console.log(snapshot, snapshot.val());
            });
        });
    };
    PlsdalaProvider.prototype.editProfile = function (uid, data) {
        return new Promise(function (resolve) {
            firebase.database().ref('users').child(uid).update(data);
            return resolve(true);
        });
    };
    PlsdalaProvider.prototype.uploadProfilePhoto = function (imageData) {
        var _this = this;
        var photoRef = firebase.storage().ref('users').child(this.user.uid);
        photoRef.putString(imageData, 'base64', { contentType: 'image/png' })
            .then(function (savedPhoto) {
            _this.toastCtrl.create({
                message: 'Photo uploaded!',
                duration: 3000
            }).present();
            firebase.database().ref('users').child(_this.user.uid).update({
                profileimage: savedPhoto.downloadURL
            });
        });
    };
    PlsdalaProvider.prototype.saveUserImage = function (uid, photo) {
        firebase.database().ref('users').child(uid).update({
            profileImage: photo
        });
    };
    PlsdalaProvider.prototype.addItem = function (data, item) {
        var _this = this;
        return new Promise(function (resolve) {
            var newItem = _this.afd.list('travel_items/' + item.key).push({});
            newItem.set({
                itemName: data.name,
                sender: _this.user.key,
                receiverName: data.receiverName,
                receiverId: data.receiverId
            }).then(function (_) {
                if (data.description) {
                    firebase.database().ref('travel_items/' + item.key).child(newItem.key).update({
                        itemDescription: data.description,
                    });
                }
            });
            return resolve(newItem.key);
        });
    };
    PlsdalaProvider.prototype.uploadItemPhoto = function (picdata, index, itemkey, dbkey) {
        var image = [];
        firebase.storage().ref('items').child(firebase.auth().currentUser.uid)
            .child(this.photoId().concat('png'))
            .putString(picdata, 'base64', { contentType: 'image/png' })
            .then(function (savedPhoto) {
            firebase.database().ref('travel_items/' + itemkey).child(dbkey).child('images').update((_a = {},
                _a[index] = savedPhoto.downloadURL,
                _a));
            var _a;
        });
    };
    PlsdalaProvider.prototype.photoId = function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };
    PlsdalaProvider.prototype.addItemMessage = function (users) {
        var _this = this;
        this.checkUsers(users).then(function (data) {
            if (data) {
                var newMessage = _this.afd.list('messages/' + data).push({});
                newMessage.set({
                    isItem: true,
                    senderFirstname: _this.user.val().firstname,
                    senderLastname: _this.user.val().lastname,
                    senderId: _this.user.key,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
                // firebase.database().ref().child('threads/' + this.user.key + '/' + data).update({
                //   title: details.receiverFirstname + ' ' + details.receiverLastname,
                //   lastMessage: this.user.val().firstname + ' ' + this.user.val().lastname + ': ' + details.content,
                //   seen: true,
                //   timestamp: firebase.database.ServerValue.TIMESTAMP
                // });
                // firebase.database().ref().child('threads/' + users.receiverId + '/' + data).update({
                //   title: this.user.val().firstname + ' ' + this.user.val().lastname,
                //   lastMessage: this.user.val().firstname + ' ' + this.user.val().lastname + ': ' + details.content,
                //   seen: false,
                //   timestamp: firebase.database.ServerValue.TIMESTAMP
                // });
            }
        });
    };
    PlsdalaProvider.prototype.getItemsAtTravel = function (travelKey) {
        console.log(travelKey);
        return this.afd.list('travel_items/' + travelKey);
    };
    PlsdalaProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [ToastController, AngularFireDatabase, Http])
    ], PlsdalaProvider);
    return PlsdalaProvider;
}());
export { PlsdalaProvider };
//# sourceMappingURL=plsdala.js.map