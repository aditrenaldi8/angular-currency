import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private http: HttpClient
  ) { }

  isLoading = new BehaviorSubject(false);

  loading(value : boolean){
    setTimeout(() => {
        this.isLoading.next(value);
    });
  }


  getRates(): Observable<any> {
    return this.http.get<any>('https://api.exchangeratesapi.io/latest?base=USD')
      .pipe(map(response => response));
  }

}
