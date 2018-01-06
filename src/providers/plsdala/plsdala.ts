import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import firebase from 'firebase';

@Injectable()
export class PlsdalaProvider {


  db = firebase.database().ref();
  travelList: AngularFireList<any>;
  messagelist: AngularFireList<any>;
  baseUrl = 'https://plsdala-8609a.firebaseio.com/';
  chatId;

  constructor(public afd: AngularFireDatabase, public http: Http) {
    this.travelList = this.afd.list('travels');
    console.log('Hello PlsdalaProvider Provider');
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
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
      userId: localStorage.getItem('id')
    }).then(
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
    return this.travelList;
  }

  addMessage(details){

  }  


  // getMessages(users):any{
  //   var data = this.checkUsers(users);
  //     console.log(data);
  //     console.log(this.afd.list('threads/'+data+'/messages'));
  //     return this.afd.list('threads/'+data+'/messages');
  //   // });
  // }

  getMessages(users):any{
    return new Promise(resolve=>{
    var dbNumUsersChat = 0;
    var clNumUsersChat = 0;
    var finalCheck = 0;
    var usersChat = [];
    var threadUsers = [];
    var threadId: string;
      for(var key in users){
        dbNumUsersChat++;
        console.log(dbNumUsersChat);
        usersChat.push(users[key]);
      }

      const dbCheckUsers = firebase.database().ref().child('threads');
      dbCheckUsers.once('value', snapshot =>{
        console.log(snapshot);
        snapshot.forEach(snap=>{
          snap.child('users').forEach(data=>{
            clNumUsersChat++;
            threadUsers.push(data.key);
            return false;
          });
        if(dbNumUsersChat === clNumUsersChat){
          usersChat.forEach(userChat=>{
            threadUsers.forEach(threadUser=>{
              if(userChat == threadUser){
                console.log(threadUser, userChat);
                // console.log(threadId);
                finalCheck++;
                console.log(finalCheck);
              }
            });
          });
        }
        if(finalCheck === dbNumUsersChat){
          threadId = snap.key;
          console.log(threadId);
        }  
          return false;


        });
      }).then(_=>{

      }).then(_=>{
        console.log(finalCheck, dbNumUsersChat);

      }).then(_=>{
        console.log('1');
        resolve(this.afd.list('threads/'+threadId+'/messages'));
        return;
      });});
      }

    //   }).then(()=>{
    //     if(numberOfUsers == check){
    //       chatUsers.forEach(chatUser=>{
    //         threadUsers.forEach(threadUser=>{
    //           if(chatUser == threadUser){
    //             finalCheck++;
    //           }
    //         })
    //       })
    //     }
    //     if(finalCheck == check){
    //       var callbackData = [];
    //       messageIds.forEach(data=>{
    //         var messageDetails = firebase.database().ref().child('messages/' + data);
    //         messageDetails.on('value', messageDetail=>{
    //           callbackData.push(messageDetail.val());
    //           console.log(messageDetail.val());
    //         });
    //         console.log(callbackData);
    //         return resolve(callbackData);
    //       })
    //     }
    //   })
    // });
        // return this.afd.list('threads/' + key + '/messages');
  // }

  getMessage(users):any{
    this.checkUsers(users).then(data=>{
      var messages = this.http.get('https://plsdala-8609a.firebaseio.com/threads/' + data + '/messages');
    console.log(messages);
    });
    // return new Promise(resolve=>{
    //   this.checkUsers(users).then(data=>{
    //     resolve(this.afd.list('threads/' + data + '/messages'));
    //     return;
    //    });
    // })
    }

  // checkUsers(users): any{
  //   console.log('here');
  //   var numUsers = 0;
  //   var chatCheck = false;
  //   return new Promise((resolve, reject) => {
  //     const checker = firebase.database().ref().child('threads');
  //     checker.once('value', snapshot => {
  //     snapshot.forEach(snap=>{
  //       this.chatId = snap.key;
  //       console.log(this.chatId);
  //       snap.child('users').forEach(data=>{
  //         console.log(users.user1)
  //         console.log(users.user2);
  //         console.log(data.key);
  //         if(users.user1 == data.key || users.user2 == data.key){
  //           numUsers++;
  //           console.log(numUsers);
  //           if(numUsers === snap.val().numberOfUsers){
  //             console.log(chatCheck);
  //             resolve(this.chatId);
  //             chatCheck = true;
  //             return true;
  //           }
  //         }
  //         console.log(numUsers);
  //         return false;
  //       });
  //       if(chatCheck){
  //         console.log(chatCheck);
  //         return true;
  //       }
  //         console.log(chatCheck);
  //       return false;
  //     })
  //   });  
  //   })    
  // }

}
