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
  x: any;
  y: any;
  marker: any;
  address: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    var data = navParams.get('data');
  }

  ionViewDidLoad() {
  	this.initMap();
    console.log('ionViewDidLoad MapPage');
  }
  
   initMap() {
        //change to user location later
        let departure = new google.maps.LatLng(9.3068, 123.3054);

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: departure
        });

        // initiate marker
        this.marker = new google.maps.Marker({map: map});

        google.maps.event.addListener(map, 'click', event=>{
          var geocoder = new google.maps.Geocoder;

          // update marker position
          this.updateMarkerPosition(event);
          this.geocodeLatLng(geocoder, map, event);
          this.x = event.latLng.lat();
          this.y = event.latLng.lng();
          console.log(this.x + ', ' + this.y);
          });
        }

    updateMarkerPosition(location){
      this.marker.setPosition({
        lat: location.latLng.lat(),
        lng: location.latLng.lng()
      });

    }

    //turn x, y to readable
  geocodeLatLng(geocoder, map, event) {
    // var latlng = {lat: this.x, lng: this.y};
    geocoder.geocode({location: {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results[0].formatted_address);
          // console.log(this.address);
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  // return to parent view
  AddLocation(){
    console.log(this.address);
    this.viewCtrl.dismiss({
      x: this.x,
      y: this.y,
      address: this.address
    });
  }

  Cancel(){
    this.navCtrl.pop();
  }
}
