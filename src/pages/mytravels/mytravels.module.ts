import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MytravelsPage } from './mytravels';

@NgModule({
  declarations: [
    MytravelsPage,
  ],
  imports: [
    IonicPageModule.forChild(MytravelsPage),
  ],
})
export class MytravelsPageModule {}
