import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpPage } from './help';
import { IonicPage, NavController, NavParams} from 'ionic-angular';

@NgModule({
  declarations: [
    HelpPage,
  ],
  imports: [
    IonicPageModule.forChild(HelpPage),
  ],
})
export class HelpPageModule {

      constructor(public navCtrl: NavController,
      public navParams: NavParams){

      }

      
}
