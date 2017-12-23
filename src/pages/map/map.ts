import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  x: any;
  y: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    var data = navParams.get('data');
  }

  ionViewDidLoad() {
  	this.initMap();
    console.log('ionViewDidLoad MapPage');
  }
  
   initMap() {
        let departure = new google.maps.LatLng(9.3068, 123.3054); //change to user location later

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: departure
        });

        google.maps.event.addListener(map, 'click', event=>{
          // var geocoder = new google.maps.Geocoder;
          // var infowindow = new google.maps.InfoWindow;
          var marker = new google.maps.Marker({
            position: {
              lat: event.latLng.lat(),
              lng : event.latLng.lng()
            },
              map: map
            });
          // this.geocodeLatLng(geocoder, map, infowindow);
          this.x = event.latLng.lat();
          this.y = event.latLng.lng();
          console.log(this.x + ', ' + this.y);
          });
        }

  // geocodeLatLng(geocoder, map, infowindow) {
  //   var input = this.x + ',' + this.y;
  //   var latlngStr = input.split(',', 2);
  //   var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
  //   geocoder.geocode({'location': latlng}, function(results, status) {
  //     if (status === 'OK') {
  //       if (results[0]) {
  //         var marker = new google.maps.Marker({
  //           position: latlng,
  //           map: map
  //         });
  //         infowindow.setContent(results[0].formatted_address);
  //         infowindow.open(map, marker);
  //       } else {
  //         window.alert('No results found');
  //       }
  //     } else {
  //       window.alert('Geocoder failed due to: ' + status);
  //     }
  //   });
  // }

  AddLocation(){
    this.viewCtrl.dismiss({
      x: this.x,
      y: this.y
    });
  }

  Cancel(){
    this.navCtrl.pop();
  }
        
  //       // this.goBack();
  //    //    google.maps.event.addListener(map, 'click', function( event ){
  //    //    //   this.navCtrl.pop();
  //   	// 	  // console.log(event.latLng.lat() + ', ' + event.latLng.lng());
  //   	// });
  //     }

  //     goBack(map):any{
  //       return new Promise(resolve=>{
  //         google.maps.event.addListener(map, 'click', function( event ){
  //         resolve(event.latLng.lat() + ', ' + event.latLng.lng());
  //         })
  //       });
  //     }
}
