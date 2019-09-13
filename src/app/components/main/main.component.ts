import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Response } from 'src/app/models/response';
import { Currency } from 'src/app/models/currency';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';

import * as _ from 'lodash';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  constructor(
    private appService : AppService,
    private fb : FormBuilder
  ) { 
    this.getRates();
  }
  
  loading : boolean = false;
  data : Response;
  form : FormGroup;

  ngOnInit() {
    this.appService.isLoading.subscribe(value => {
      this.loading = value;
    });

    this.initForm();
  }

  getRates(){
    this.appService.loading(true);
    this.appService.getRates().subscribe(response=>{
      this.data = new Response(response);
      this.setData();
      this.appService.loading(false);
    },(error)=>{  
      this.appService.loading(false);
      console.log(error);
    })
  }

  setData(){
    const currency : any[] = Object.keys(this.data.rates);
    const rates : any[] = Object.values(this.data.rates);

    currency.map((value, index)=>{
      this.data.baseRate.push(new Currency(value, rates[index]));
    });

    this.form.get('base').setValue(10,{emitEvent: false});
    this.initFormArray();
  }

  initForm(){
    this.form = new FormGroup({
      base : new FormControl(),
      additional : new FormControl('',[Validators.required]),
      isAdditional : new FormControl(false),
      rates : new FormControl(this.fb.array([]))
    })
  }

  setAdditional(){
    const value = this.form.get('isAdditional').value;
    this.form.get('isAdditional').setValue(!value);
  }

  get formArray(): FormArray {
      return this.form.get('rates') as FormArray;
  }

  createArrayForm(data : any) {
      const fg =  this.fb.group({
          currency: [data.ccy],
          rate: [data.rate],  
          defaultRate : [data.defaultRate]
      });

      return fg;
  }

  initFormArray(){
      const value = this.getCurrencyData();
     
      if(value){
        const FGs = [this.createArrayForm(value)];
        const FA = this.fb.array(FGs);
        this.form.setControl('rates', FA);
      }
  }

  addForm() {
      if(this.form.valid){
        const ccy = this.form.get('additional').value;
        const value = this.getCurrencyData(ccy);

        if(value){
          const fg = this.createArrayForm(value);
          this.formArray.push(fg);
        }
      }

      this.form.get('additional').setValue('');
      this.setAdditional();
  }

  deleteForm(event: { index: number }) {
      this.formArray.removeAt(event.index);
  }

  getCurrencyData(ccy :string = "IDR"){
    const baseValue = this.form.get('base').value;
    const data = _.find(this.data.baseRate, (item) => { return item.currency.toLowerCase() == ccy.toLowerCase() });
   
    if(data){
      return ({ccy: data.currency, rate : (Number(baseValue)*data.rate), defaultRate: data.rate })
    }else{
      return null;
    }
  }
}
