import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { filter } from 'rxjs/operators'

import {Alert, AlertType, AlertOptions} from './alert.model'

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<Alert>();
  private defaultAlertId: string = "default-alert";

  constructor() { }

  onAlert(id = this.defaultAlertId): Observable<Alert>{
    return this.subject.asObservable().pipe(filter(x => x && x.id === id));
  }

  success(message: string, options?: AlertOptions){
    this.alert(new Alert({ ...options, type: AlertType.Success, message}));
  }
  error (message: string, options?: AlertOptions){
    this.alert(new Alert({ ...options, type: AlertType.Error, message}));
  }
  info(message: string, options?: AlertOptions){
    this.alert(new Alert({ ...options, type: AlertType.Info, message}));
  }
  warn(message: string, options?: AlertOptions){
    this.alert(new Alert({ ...options, type: AlertType.Warning, message}));
  }

  alert(alert: Alert){
    alert.id = alert.id || this.defaultAlertId;
    this.subject.next(alert)
  }

}
