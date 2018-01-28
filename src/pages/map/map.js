var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
var MapPage = /** @class */ (function () {
    function MapPage(loadingController, navCtrl, navParams, viewCtrl, zone, toastController) {
        this.loadingController = loadingController;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.zone = zone;
        this.toastController = toastController;
        this.latitude = 0;
        this.longitude = 0;
        this.serviceTest = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };
        //get data from calling class
        // var data = navParams.get('data');
    }
    MapPage.prototype.ionViewDidLoad = function () {
        this.initMap();
        console.log('ionViewDidLoad MapPage');
    };
    MapPage.prototype.initMap = function () {
        var _this = this;
        //change to user location later
        var departure = new google.maps.LatLng(9.3068, 123.3054);
        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: departure
        });
        // initiate marker
        this.marker = new google.maps.Marker({ map: this.map });
        google.maps.event.addListener(this.map, 'click', function (event) {
            var geocoder = new google.maps.Geocoder;
            // update marker position
            _this.updateMarkerPosition(event);
            _this.geocodeLatLng(geocoder, _this.map, event);
            _this.latitude = event.latLng.lat();
            _this.longitude = event.latLng.lng();
            console.log(_this.latitude + ', ' + _this.longitude);
        });
    };
    /*
    ** For when clicking
    */
    MapPage.prototype.updateMarkerPosition = function (location) {
        this.marker.setPosition({
            lat: location.latLng.lat(),
            lng: location.latLng.lng()
        });
    };
    //turn x, y to readable
    MapPage.prototype.geocodeLatLng = function (geocoder, map, event) {
        var _this = this;
        var loader = this.loadingController.create({
            content: 'Getting location details...'
        });
        loader.present();
        geocoder.geocode({ location: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            } }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    console.log(results[0].formatted_address);
                    _this.address = results[0].formatted_address;
                    loader.dismiss();
                    _this.toastController.create({
                        message: results[0].formatted_address,
                        duration: 3000
                    }).present();
                }
                else {
                    loader.dismiss();
                    _this.toastController.create({
                        message: 'No results found',
                        duration: 3000
                    }).present();
                }
            }
            else {
                loader.dismiss();
                _this.toastController.create({
                    message: 'No internet connection',
                    duration: 3000
                }).present();
            }
        });
    };
    /*
    ** For when searching
    */
    MapPage.prototype.updateSearch = function () {
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        var me = this;
        this.serviceTest.getPlacePredictions({ input: this.autocomplete.query }, function (predictions, status) {
            me.autocompleteItems = [];
            me.zone.run(function () {
                if (predictions) {
                    predictions.forEach(function (prediction) {
                        me.autocompleteItems.push(prediction.description);
                    });
                }
            });
        });
    };
    MapPage.prototype.chooseItem = function (item) {
        this.address = item;
        this.autocompleteItems = [];
        this.geoCode(this.address); //convert Address to lat and long
    };
    MapPage.prototype.geoCode = function (address) {
        var _this = this;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, function (results, status) {
            _this.address = address;
            _this.latitude = results[0].geometry.location.lat();
            _this.longitude = results[0].geometry.location.lng();
            _this.map.setCenter({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            });
            _this.marker.setPosition({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            });
        });
    };
    /*
    ** Commons
    */
    // return to parent view
    MapPage.prototype.AddLocation = function () {
        console.log(this.address);
        this.viewCtrl.dismiss({
            x: this.latitude,
            y: this.longitude,
            address: this.address
        });
    };
    MapPage.prototype.Cancel = function () {
        this.navCtrl.pop();
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], MapPage.prototype, "mapElement", void 0);
    MapPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-map',
            templateUrl: 'map.html',
        }),
        __metadata("design:paramtypes", [LoadingController, NavController, NavParams, ViewController, NgZone, ToastController])
    ], MapPage);
    return MapPage;
}());
export { MapPage };
//# sourceMappingURL=map.js.map