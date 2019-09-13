import { Currency } from './currency';

export class Response{
    rates : string;
    base : string;
    date : string;
    baseRate : Currency[];

    constructor(data: any ={}){
        this.rates = data.rates;
        this.base = data.base;
        this.date = data.date;
        this.baseRate = [];
    } 
}