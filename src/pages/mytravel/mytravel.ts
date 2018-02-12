import { Component,ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { ViewphotoPage } from '../viewphoto/viewphoto';
import { Observable } from 'rxjs/Observable';
declare var google;

@IonicPage()
@Component({
  selector: 'page-mytravel',
  templateUrl: 'mytravel.html',
})
export class MytravelPage {
  @ViewChild('map') mapElement: ElementRef;
  selectedItem: any;
  items$: Observable<any>;
  map;

  constructor(public modal: ModalController, public plsdala: PlsdalaProvider, public toastCtrl: ToastController, 
  	public navCtrl: NavController, public navParams: NavParams) {
    this.selectedItem = navParams.get('item');
  	this.items$ = this.plsdala.getItemsAtTravel(this.selectedItem['key'])
  	.snapshotChanges()
    .map(
      changes => {
        return changes.map(c=>({
          key: c.payload.key, ...c.payload.val()
        }));
      });
  }

  ionViewDidLoad() {
  	this.initMap();
    console.log('ionViewDidLoad MytravelPage');
  }

   initMap() {
          //change to user location later
          let from = new google.maps.LatLng(this.selectedItem.fromX, this.selectedItem.fromY);
          let to = new google.maps.LatLng(this.selectedItem.toX, this.selectedItem.toY);
          this.map = new google.maps.Map(document.getElementById('map'), {
              center: from
          });
          let directionsService = new google.maps.DirectionsService;
          let directionsDisplay = new google.maps.DirectionsRenderer;
          directionsDisplay.setMap(this.map);
          directionsService.route({
            origin: from,
            destination: to,
            travelMode: google.maps.TravelMode['DRIVING']
          }, (res, status) => {
            if(status == google.maps.DirectionsStatus.OK){
              directionsDisplay.setDirections(res);
            } else {
              this.toastCtrl.create({
                message: 'Cannot get directions',
                duration: 3000
              }).present();
            }
          });
        }

        openModal(imgurl){
        	this.modal.create(ViewphotoPage, {imgurl: imgurl}).present();
        }

  	 //    this.travelList$ = this.plsdala.getTravelList()
    // .snapshotChanges()
    // .map(
    //   changes => {
    //     return changes.map(c=>({
    //       key: c.payload.key, ...c.payload.val()
    //     })).slice().reverse(); //to reverse order
    //   });
 //  	var itemsArr = [];
	// const ref = firebase.database().ref('users').child(firebase.auth().currentUser.uid).child('travels');
	// ref.once('value', snapshot=>{
	// 	snapshot.forEach(travel=>{
	// 		// console.log(travel.key);
	// 		let itemRef = firebase.database().ref('travel_items').child(travel.key);
	// 		itemRef.once('value', item=>{
	// 			// console.log(item, item.val());
	// 			item.forEach(itemData=>{
	// 				// console.log(itemData, itemData.val());
	// 				itemsArr.push(snapshot.val(), travel.val(), itemData.val());
	// 				return false;
	// 			})
	// 		})
	// 		return false;
	// 	})
	// });
	// return itemsArr;
}
