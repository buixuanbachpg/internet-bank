import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatasharelocalService {
  private datauser: BehaviorSubject<string> = new BehaviorSubject<string>('NOT REAL USER');
  currentData = this.datauser.asObservable();

  constructor() { }

  changeData(newData: string) {
    this.datauser.next(newData);
  }

  clearAll() {
    this.datauser = new BehaviorSubject<string>('NOT REAL USER');
  }

}
