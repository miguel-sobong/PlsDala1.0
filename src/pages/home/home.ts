import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AddtravelPage } from '../addtravel/addtravel';
import { PlsdalaProvider } from '../../providers/plsdala/plsdala';
import { TravelPage } from '../../pages/travel/travel';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // selectedItem: any;
  // icons: string[];
  // items: Array<{title: string, note: string, icon: string}>;
  travelList$: Observable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public plsdala: PlsdalaProvider) {
    this.travelList$ = this.plsdala.getTravelList()
    .snapshotChanges()
    .map(
      changes => {
        return changes.map(c=>({
          key: c.payload.key, ...c.payload.val()
        }))
      }
      );
    // // If we navigated to this page, we will have an item available as a nav param
    // this.selectedItem = navParams.get('item');

    // // Let's populate this page with some filler content for funzies
    // this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    // 'american-football', 'boat', 'bluetooth', 'build'];

    // this.items = [];
    // for (let i = 1; i < 20; i++) {
    //   this.items.push({
    //     title: 'Item ' + i,
    //     note: 'This is item #' + i,
    //     icon: this.icons[Math.floor(Math.random() * this.icons.length)]
    //   });
    // }
  }
  
  addTravel(event){
    this.navCtrl.push(AddtravelPage);
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(TravelPage, {
      item: item
    });
  }

  }
