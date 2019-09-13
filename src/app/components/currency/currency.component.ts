import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Currency } from 'src/app/models/currency';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

  @Input() parentFG: FormGroup;
  @Input() index: number ;
  @Output() onDeleteForm = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  delete(){
    this.onDeleteForm.emit(this.index);
  }


}
