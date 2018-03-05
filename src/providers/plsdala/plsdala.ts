import { Injectable } from '@angular/core';
import { ToastController, Platform, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireAuth } from 'angularfire2/auth';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
@Injectable()
export class PlsdalaProvider {


  db = firebase.database().ref();
  travelList: AngularFireList<any>;
  public userIsVerified;
  baseUrl = 'https://plsdala-8609a.firebaseio.com/';
  chatId;
  threadId;
  newThreadKey;
  users: any;
  user: any;  
  watch;
  resumeNode;
  locationOnNotifs;
  locationOffNotifs;
  locationStateHandlerNode;

  constructor(public diagnostic: Diagnostic, public alert: AlertController, public platform: Platform, 
    public backgroundGeolocation: BackgroundGeolocation, public afAuth: AngularFireAuth, 
    private geo: Geolocation, public toastCtrl: ToastController, public afd: AngularFireDatabase, 
    public http: Http) {
    afAuth.authState.subscribe( user => {
      if(user){
        firebase.database().ref('users').child(firebase.auth().currentUser.uid)
        .once('value', user=>{
          this.user = user;
          console.log(`${user.val().firstname} ${user.val().lastname} `)
        }).then(()=>{
          this.locationOnNotifs = false;
          this.locationOffNotifs = false;
         this.watchUserLocation();
        });
      }
      else
      {
        this.user = null;
        if(this.resumeNode)
          this.resumeNode.off();
        if(this.backgroundGeolocation)
          this.backgroundGeolocation.stop();
        if(this.locationStateHandlerNode)
          clearTimeout(this.locationStateHandlerNode);
      }
    });
    this.travelList = this.afd.list('travels');
  }

  backgroundGeo(){
    const config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10
    };

    this.backgroundGeolocation.configure(config)
    .subscribe((location: BackgroundGeolocationResponse)=>{
      firebase.database().ref('user_location').child(firebase.auth().currentUser.uid).update({
        lat: location.latitude,
        long: location.longitude
      });
      this.backgroundGeolocation.finish();
    });

    this.backgroundGeolocation.start();
  }

  watchUserLocation(){
    const watchOptions = {
      enableHighAccurary: true,
      timeout: 1250,
      maximumAge: 0
    }

    this.resumeNode = firebase.database().ref('users').child(firebase.auth().currentUser.uid).child('isTrackable');
    this.resumeNode.on("value", snap=>{
      if(snap.val())
      {
        this.watch = this.geo.watchPosition(watchOptions).subscribe(pos => {
          console.log(pos.coords);
          if(pos.coords != undefined){
            firebase.database().ref("user_location").child(firebase.auth().currentUser.uid).update({
              lat: pos.coords.latitude,
              long: pos.coords.longitude
            });
          }
        });

       this.platform.pause.subscribe(pause=>{
         if(pause && this.user){
           console.log('pause start');
           this.backgroundGeo();
         }
       });

       this.platform.resume.subscribe(resume=>{
         if(resume && this.user){
           console.log('res start');
           this.backgroundGeolocation.stop();
         }
       });
         this.locationStateHandler();
      }
      else
      {
        if(this.watch)
          this.watch.unsubscribe();
        if(this.backgroundGeolocation)
          this.backgroundGeolocation.stop();
        firebase.database().ref('user_location').child(firebase.auth().currentUser.uid).remove();
      }
    });
  }

  addTravel(to, from, toDate, fromDate){
    return new Promise((resolve, reject)=>{
    const newTravel = this.travelList.push({});
    newTravel.set({
      fromX: from.x,
      fromY: from.y,
      fromAddress: from.address,
      fromDate: fromDate,
      toX: to.x,
      toY: to.y,
      toAddress: to.address,
      toDate: toDate,
      userId: firebase.auth().currentUser.uid
    })
    .then(
    newTravel => {
      resolve(true);
      return;
    }, error => {
      reject('Cannot connect to the database');
      return;
    })
  });
  }

  getTravelList(){
    return this.afd.list('travels');
  }

  getUserList(){
    return this.afd.list('users');
  }

  getReviews(uid){
    return this.afd.list('reviews/' + uid,  ref=>ref.orderByChild("timestamp"));
  }

  checkUsers(users){
      console.log(users);
      return new Promise((resolve, reject)=>{
      var clUserCount = Object.keys(users).length;
      var dbUserCount = 0;
      var finalCheck = 0;
      var threadId: string;
      const checkUsersInDb = firebase.database().ref('thread_users');
      checkUsersInDb.on('value', snapshot=>{

        //for adding when no thread is present
        if(!snapshot.val()){
          resolve(null);
        }
        snapshot.forEach(snap=>{
          snap.forEach(snap2=>{
            dbUserCount++;
            for(let user in users){
              if(threadId){
                break;
              }
              if(snap2.key == users[user]){
                finalCheck++;
                console.log(finalCheck);
                if(finalCheck == clUserCount && finalCheck == dbUserCount){
                  console.log('yay');
                  threadId = snap.key;
                  resolve(threadId);
                  return true;
                }
                break;
              }
            }
            return false;
          })
          finalCheck=0;
            dbUserCount=0;
          return false;
        })
        resolve(null);
        return;
      })
    });
  }

  getMessages(users):any{
    return new Promise(resolve=>{
      this.checkUsers(users).then(data=>{
        if(data){
          resolve(data);
          return;
        }
        else{
          const newThread = this.afd.list('thread_users').push({});
          newThread.set({
            [users.user1]: true,
            [users.user2]: true
          });
          this.newThreadKey = newThread.key;
          resolve(newThread.key);
        }
        return;
      });
    })
  }

  addMessage(details, users){
    this.checkUsers(users).then(data=>{
      if(data){
        const newMessage = this.afd.list('messages/' + data).push({});
        newMessage.set({
          content: details.content,
          senderName: `${this.user.val().firstname} ${this.user.val().lastname} (${this.user.val().username})`,
          senderId: firebase.auth().currentUser.uid,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        firebase.database().ref().child('threads/' + this.user.key + '/' + data).update({
          title: details.receiverFirstname + ' ' + details.receiverLastname,
          lastMessage: this.user.val().firstname + ' ' + this.user.val().lastname + ': ' + details.content,
          seen: true,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        firebase.database().ref().child('threads/' + users.receiverId + '/' + data).update({
          title: this.user.val().firstname + ' ' + this.user.val().lastname,
          lastMessage: this.user.val().firstname + ' ' + this.user.val().lastname + ': ' + details.content,
          seen: false,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      }
    });
  }

  getChatList(){
    return this.afd.list('threads/' + firebase.auth().currentUser.uid, ref=> ref.orderByChild("timestamp"));
  }

  getUserInChatList(threadId){
    return new Promise(resolve=>{
      const checkUsersInDb = firebase.database().ref('thread_users/' + threadId);
      checkUsersInDb.once('value', snapshot=>{
        resolve(snapshot.val());
        console.log(snapshot, snapshot.val());
      });
    });
  }

  editProfile(uid, data){
    return new Promise(resolve=>{
      firebase.database().ref('users').child(uid).update(data);
      return resolve(true);
    });
  }

  uploadProfilePhoto(imageData){
    const photoRef = firebase.storage().ref('users').child(firebase.auth().currentUser.uid);
    photoRef.putString(imageData, 'base64', { contentType: 'image/png'})
    .then(savedPhoto=>{
      this.toastCtrl.create({
         message: 'Photo uploaded!',
         duration: 3000
       }).present();
      firebase.database().ref('users').child(firebase.auth().currentUser.uid).update({
        profileimage: savedPhoto.downloadURL
      });
    });
  }

  saveUserImage(uid, photo){
    firebase.database().ref('users').child(uid).update({
      profileImage: photo
    });
  }

  addItem(users, data, item){
    return new Promise(resolve=>{
      this.checkUsers(users).then(dbkey=>{
        if(dbkey)
        {
          const newItem = this.afd.list('messages/' + dbkey).push({});
          newItem.set({
           isItem: true,
           senderName: this.user.val().firstname + ' ' + this.user.val().lastname + ' (' + this.user.val().username + ')',
           itemName: data.name,
           senderId: firebase.auth().currentUser.uid,
           receiverName: data.receiverName,
           receiverId: data.receiverId,
           courierId: users.user2,
           isAccepted: false,
           isDeclined: false,
           timestamp: firebase.database.ServerValue.TIMESTAMP,
           receiverAccepted: false,
           travelKey: item.key
          }).then(_=>{
            if(data.description){
              firebase.database().ref('messages/' + dbkey).child(newItem.key).update({
                itemDescription: data.description,
              });
            }

            firebase.database().ref('users').child(users.user2).once("value", snapshot=>{
              firebase.database().ref().child('threads/' + this.user.key + '/' + dbkey).update({
                title: snapshot.val().firstname + " " + snapshot.val().lastname,
                lastMessage: this.user.val().firstname + ' ' + this.user.val().lastname + ' sent an item!',
                seen: true,
                timestamp: firebase.database.ServerValue.TIMESTAMP
              });
            });

            firebase.database().ref().child('threads/' + users.user2 + '/' + dbkey).update({
              title: this.user.val().firstname + ' ' + this.user.val().lastname,
              lastMessage: this.user.val().firstname + ' ' + this.user.val().lastname + ' sent an item!',
              seen: false,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            });
          }).then(_=>{
            var returnData = {
              threadkey: dbkey,
              msgkey: newItem.key
            }
            return resolve(returnData);
          })
        }
        else{
          const newThread = this.afd.list('thread_users').push({});
          newThread.set({
            [users.user1]: true,
            [users.user2]: true
          }).then(()=>{
            const newItem = this.afd.list('messages/' + newThread.key).push({});
            newItem.set({
             isItem: true,
             senderFirstname: this.user.val().firstname,
             senderLastname: this.user.val().lastname,
             itemName: data.name,
             senderId: firebase.auth().currentUser.uid,
             receiverName: data.receiverName,
             receiverId: data.receiverId,
             courierId: users.user2,
             isAccepted: false,
             isDeclined: false,
             timestamp: firebase.database.ServerValue.TIMESTAMP,
             receiverAccepted: false,
             travelKey: item.key
            }).then(_=>{
              if(data.description){
                firebase.database().ref('messages/' + newThread.key).child(newItem.key).update({
                  itemDescription: data.description,
                });
              }

              firebase.database().ref('users').child(users.user2).once("value", snapshot=>{
                firebase.database().ref().child('threads/' + this.user.key + '/' + newThread.key).update({
                  title: snapshot.val().firstname + " " + snapshot.val().lastname,
                  lastMessage: this.user.val().firstname + ' ' + this.user.val().lastname + ' sent an item!',
                  seen: true,
                  timestamp: firebase.database.ServerValue.TIMESTAMP
                });
              });

              firebase.database().ref().child('threads/' + users.user2 + '/' + newThread.key).update({
                title: this.user.val().firstname + ' ' + this.user.val().lastname,
                lastMessage: this.user.val().firstname + ' ' + this.user.val().lastname + ' sent an item!',
                seen: false,
                timestamp: firebase.database.ServerValue.TIMESTAMP
              });
            }).then(_=>{
              var returnData = {
                threadkey: newThread.key,
                msgkey: newItem.key
              }
              return resolve(returnData);
            })    
          })
        }
      });
   });
  }

  addReceiverInChat(users){
    return new Promise(resolve=>{
      this.checkUsers(users).then(res=>{
        if(!res){
          const threadUsers = firebase.database().ref('thread_users').push({});
          threadUsers.set({
            [users.user1]: true,
            [users.user2]: true,
            [users.user3]: true,
          });
          resolve(threadUsers.key);
         }
         else{
           resolve(res);
         }
      });
    });
  }

  getUsersInThree(users, key){
    console.log(users);
    var url = "https://plsdala-8609a.firebaseio.com/users/";
      this.http.get(url + users.user1 + '.json').map(res => res.json()).subscribe(user1data => {
        this.http.get(url + users.user2 + '.json').map(res => res.json()).subscribe(user2data => {
          this.http.get(url + users.user3 + '.json').map(res => res.json()).subscribe(user3data => {
            firebase.database().ref().child('threads/' + users.user1 + '/' + key).set({
              lastMessage: user2data['firstname'] + ' ' + user2data['lastname'] +' sent an item!',
              seen: true,
              timestamp: firebase.database.ServerValue.TIMESTAMP,
              title: user2data['firstname'] + ' ' + user2data['lastname'] + ' and ' + user3data['firstname'] + ' ' + user3data['lastname']
            });
            firebase.database().ref().child('threads/' + users.user2 + '/' + key).set({
              lastMessage: user2data['firstname'] + ' ' + user2data['lastname'] +' sent an item!',
              seen: false,
              timestamp: firebase.database.ServerValue.TIMESTAMP,
              title: user1data['firstname'] + ' ' + user1data['lastname'] + ' and ' + user3data['firstname'] + ' ' + user3data['lastname']
            });
            firebase.database().ref().child('threads/' + users.user3 + '/' + key).set({
              lastMessage: user2data['firstname'] + ' ' + user2data['lastname'] +' sent an item!',
              seen: false,
              timestamp: firebase.database.ServerValue.TIMESTAMP,
              title: user1data['firstname'] + ' ' + user1data['lastname'] + ' and ' + user2data['firstname'] + ' ' + user2data['lastname']
            });
          });
        });
      });
  }

  uploadItemPhoto(picdata, index, itemkey, dbkey){
    firebase.storage().ref('items').child(firebase.auth().currentUser.uid)
    .child(this.photoId().concat('png'))
    .putString(picdata, 'base64', {contentType: 'image/png'})
    .then(savedPhoto=>{
      firebase.database().ref('messages/' + dbkey.threadkey).child(dbkey.msgkey).child('images').update({
        [index]: savedPhoto.downloadURL
      })
    });
  }


  photoId(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  getItemsAtTravel(travelKey){
    console.log(travelKey);
    return this.afd.list('travel_items/' + travelKey);
  }

  addTransaction(item, senderName){
    console.log("addtrans: " + senderName);
      firebase.database().ref('travels').child(item.travelKey).once("value", snapshot=>{
        console.log("snap", snapshot.val());
        firebase.database().ref('users').child(item.courierId).once("value", courier=>{
        console.log("cour", courier.val());
          const newTransaction = this.afd.list('transactions/ongoing').push({});
          newTransaction.set({
            travelkey: item.travelKey,
            senderId: item.senderId,
            courierId: item.courierId,
            receiverId: item.receiverId,
            itemName: item.itemName,
            images: item.images,
            senderName: senderName,
            receiverName: item.receiverName,
            courierName: courier.val().firstname + " " + courier.val().lastname + " (" + courier.val().username + ")",
            fromX: snapshot.val().fromX,
            fromY: snapshot.val().fromY,
            fromAddress: snapshot.val().fromAddress,
            toX: snapshot.val().toX,
            toY: snapshot.val().toY,
            toAddress: snapshot.val().toAddress,
            itemAt: item.senderId,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            timestampDone: 0
          });
          if(item.itemDescription){
            newTransaction.update({
              itemDescription: item.itemDescription
            });
          }
        console.log("finish");
        });
      });
  }

  sendNotifs(uid, title, message){
    firebase.database().ref('user_notifications').child(uid).push({
      message: message,
      title: title,
      isDisplayed: false,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
  }
 
 locationStateHandler(){
   firebase.database().ref('users').child(firebase.auth().currentUser.uid).child('isTrackable').on('value', snapshot=>{
     if(snapshot.val()){
       this.diagnostic.isLocationEnabled().then(enabled=>{
         if(enabled)
         {
           if(!this.locationOnNotifs)
           {
             firebase.database().ref('transactions').child('ongoing').once('value', snapshot=>{
               snapshot.forEach(snap=>{
                 if(snap.val().courierId == firebase.auth().currentUser.uid && snap.val().travelstarted){
                   var title = `The courier has his location on`;
                   var message = `Tracking of ${this.user.val().firstname} ${this.user.val().lastname} (${this.user.val().username}) will be more accurate`;
                  this.sendNotifs(snap.val().senderId, title, message);
                  this.sendNotifs(snap.val().receiverId, title, message);
                 }
                 return false;
               })
             });
             this.alert.create({
               title: `Your phone's location is turned on`,
               message: 'Keeping it on will help other users in your transaction',
               buttons: [{
                 text: 'Ok',
                 role: 'cancel'
               }]
             }).present();
             this.locationOnNotifs = true;
             this.locationOffNotifs = false;
           }
         }
         else
         {
           if(!this.locationOffNotifs){
             firebase.database().ref('transactions').child('ongoing').once('value', snapshot=>{
               snapshot.forEach(snap=>{
                 if(snap.val().travelstarted){
                   var title = `The courier has his location off`;
                   var message = `Tracking of ${this.user.val().firstname} ${this.user.val().lastname} (${this.user.val().username}) may not be accurate`;
                  this.sendNotifs(snap.val().senderId, title, message);
                  this.sendNotifs(snap.val().receiverId, title, message);
                 }
                 return false;
               })
             });
             this.locationOffNotifs = true;
             this.locationOnNotifs = false;
           }
           this.alert.create({
             title: `Your phone's location is hard to detect`,
             message: `You can connect to the internet or turn on your GPS`,
             buttons: 
             [{
              text: 'Turn on location',
              handler: ()=>this.diagnostic.switchToLocationSettings()
              },
              {
              text: 'Ok',
              role: 'cancel'
             }]
           }).present();
         }
         this.locationStateHandlerNode = setTimeout(()=>{
           this.locationStateHandler();
         }, 30 * 60000);
       });
     }else{
       if(this.locationStateHandler){
          clearTimeout(this.locationStateHandlerNode);
       }
     }
   });
   }
}
