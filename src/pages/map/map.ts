import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  marker: any;
  address: string;

  //for autocomplete
  autocompleteItems;
  autocomplete;
  latitude: number = 0;
  longitude: number = 0;
  autocompleteText: string;
  serviceTest = new google.maps.places.AutocompleteService();
  map;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private zone: NgZone, public toastController: ToastController) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };

    //get data from calling class
    // var data = navParams.get('data');
  }

  ionViewDidLoad() {
  	this.initMap();
    console.log('ionViewDidLoad MapPage');
  }

   initMap() {
        //change to user location later
        let departure = new google.maps.LatLng(9.3068, 123.3054);
        this.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: departure
        });

        // initiate marker
        this.marker = new google.maps.Marker({map: this.map});

        google.maps.event.addListener(this.map, 'click', event=>{
          var geocoder = new google.maps.Geocoder;

          // update marker position
          this.updateMarkerPosition(event);
          this.geocodeLatLng(geocoder, this.map, event);
          this.latitude = event.latLng.lat();
          this.longitude = event.latLng.lng();
          console.log(this.latitude + ', ' + this.longitude);
          });
        }


    /*
    ** For when clicking
    */
    updateMarkerPosition(location){
      this.marker.setPosition({
        lat: location.latLng.lat(),
        lng: location.latLng.lng()
      });
    }

    //turn x, y to readable
  geocodeLatLng(geocoder, map, event) {
    geocoder.geocode({location: {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results[0].formatted_address);
          this.address = results[0].formatted_address;
        } else {
          this.toastController.create({
            message: 'No results found',
            duration: 3000
          }).present();
        }
      } else {
          this.toastController.create({
            message: 'No internet connection',
            duration: 3000
          }).present();
      }
    });
  }

    /*
    ** For when searching
    */
   updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }

    let me = this;
    this.serviceTest.getPlacePredictions({ input: this.autocomplete.query }, function (predictions, status) {
      me.autocompleteItems = []; 
      me.zone.run(function () {
        if(predictions){
        predictions.forEach(function (prediction) {
          me.autocompleteItems.push(prediction.description);
        });
        }
      });
    });
  }

  chooseItem(item: any) {
    this.address = item;
    this.autocompleteItems = [];
    this.geoCode(this.address);//convert Address to lat and long
  }

  geoCode(address:any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
    this.address = address;
    this.latitude = results[0].geometry.location.lat();
    this.longitude = results[0].geometry.location.lng();
    this.map.setCenter({
      lat: results[0].geometry.location.lat(),
      lng: results[0].geometry.location.lng()
    });
    this.marker.setPosition({
      lat: results[0].geometry.location.lat(),
      lng: results[0].geometry.location.lng()
    });
   });
 }

  /*
  ** Commons
  */
  // return to parent view
  AddLocation(){
    console.log(this.address);
    this.viewCtrl.dismiss({
      x: this.latitude,
      y: this.longitude,
      address: this.address
    });
  }

  Cancel(){
    this.navCtrl.pop();
  }
}
