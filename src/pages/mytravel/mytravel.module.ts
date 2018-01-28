import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MytravelPage } from './mytravel';

@NgModule({
  declarations: [
    MytravelPage,
  ],
  imports: [
    IonicPageModule.forChild(MytravelPage),
  ],
})
export class MytravelPageModule {}
