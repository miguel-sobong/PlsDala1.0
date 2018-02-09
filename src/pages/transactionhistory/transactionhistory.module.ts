import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionhistoryPage } from './transactionhistory';

@NgModule({
  declarations: [
    TransactionhistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionhistoryPage),
  ],
})
export class TransactionhistoryPageModule {}
