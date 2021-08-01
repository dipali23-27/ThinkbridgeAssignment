import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GetsetService {
  private userprofileinfo = new BehaviorSubject('');
  userinformation = this.userprofileinfo.asObservable();

  constructor(private http: HttpClient) {
    this.getJSON().subscribe(data => {
      console.log(data);
    });
  }

  public getJSON(): Observable<any> {
    return this.http.get("assets/data.json");
  }

  public setdItemData(productdata: any) {
    this.userprofileinfo.next(productdata);

  }
  public setJSON(productdata: any) {
    const options = { Headers, responseType: 'json' as 'blob' };
    this.http.post('assets/data.json', productdata, options);
  }

  public setData(productdata: any) {
    localStorage.setItem('data', JSON.stringify(productdata));
  }

  public getData() {
    return JSON.parse(localStorage.getItem('data') || '{}');
  }
}
