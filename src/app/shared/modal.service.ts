import { Injectable, Type } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
export interface ModalConfig {
  component: Type<any>;
  config?: any;
  resultSubject: Subject<any>;
}
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private componentSource = new BehaviorSubject<ModalConfig | null>(null);
  private openModalSource = new BehaviorSubject<boolean>(false);
  component$ = this.componentSource.asObservable();
  openModal$ = this.openModalSource.asObservable();
  constructor() {}

  open(component: Type<any>, config?: any) {
    console.log(component, 'component');
    const resultSubject = new Subject<any>();
    this.componentSource.next({ component, config, resultSubject });
    this.openModalSource.next(true);
    return resultSubject.asObservable();
  }
  close() {
    this.openModalSource.next(false);
    this.componentSource.next(null);
  }
}
