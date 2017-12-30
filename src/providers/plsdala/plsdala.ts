import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

/*
  Generated class for the PlsdalaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PlsdalaProvider {

  travelList: AngularFireList<any>;

  constructor(public afd: AngularFireDatabase) {
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
      email: localStorage.getItem('email')
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

}
