import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
/**
 * Generated class for the AdditemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-additem',
  templateUrl: 'additem.html',
})
export class AdditemPage {

	@ViewChild('textArea') textArea: ElementRef;
	addItemForm: FormGroup;

  constructor(public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
  	this.addItemForm = formBuilder.group({
  		photo: [''],
  		name: [''],
  		description: ['']
  	});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdditemPage');
  }

}
