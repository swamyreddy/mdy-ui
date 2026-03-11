import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert, AlertType } from './alert.model';

import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  alertSubscription: Subscription;
  // @Input() id = "default-alert";
  id = 'default-alert';
  alerts: Alert[] = [];
  @Input() fade = true;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertSubscription = this.alertService
      .onAlert(this.id)
      .subscribe((alert) => {
        console.log(alert, 'Allert from alert component');
        this.alerts.push(alert);
        setTimeout(() => this.removeAlert(alert), 3000);
      });
  }
  cssClass(alert: Alert) {
    if (!alert) return;

    const classes = ['alert', 'alert-dismissible'];

    const alertTypeClass = {
      [AlertType.Success]: 'alert-success',
      [AlertType.Error]: 'alert-danger',
      [AlertType.Info]: 'alert-info',
      [AlertType.Warning]: 'alert-warning',
    };

    if (alert.type !== undefined) {
      classes.push(alertTypeClass[alert.type]);
    }

    if (alert.fade) {
      classes.push('fade');
    }
    return classes.join(' ');
  }

  removeAlert(alert: Alert) {
    if (!this.alerts.includes(alert)) return;

    const timout = this.fade ? 250 : 0;
    alert.fade = this.fade;

    setTimeout(() => {
      this.alerts = this.alerts.filter((x) => x !== alert);
    }, timout);
  }
}
