import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { PropertyService } from '../../property.service';
import { Property } from '../../property.model';
import { ModalConfig, ModalService } from '../../modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gobal-modal',
  templateUrl: './gobal-modal.component.html',
  styleUrls: ['./gobal-modal.component.css'],
})
export class GlobalModalComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;
  @Input() property: Property;
  @Input() propertyId: string;
  @Output() delete = new EventEmitter<number>();
  isVisible = false;
  isOpen = false;
  sub = new Subscription();
  title = '';
  constructor(
    private propertyService: PropertyService,
    private modalService: ModalService,
    private resolver: ComponentFactoryResolver,
  ) {
    this.sub.add(
      this.modalService.openModal$.subscribe((open) => (this.isOpen = open)),
    );

    this.sub.add(
      this.modalService.component$.subscribe((data) => {
        if (data?.component) {
          this.loadComponent(data);
        } else {
          this.container?.clear();
        }
      }),
    );
  }
  @ViewChild('modalRef') modalRef!: ElementRef;
  ngOnInit(): void {}

  openModal(): void {
    this.isVisible = true;
  }

  closeModal(): void {
    this.isVisible = false;
    this.modalService.close();
  }
  ngAfterViewInit() {
    this.sub.add(
      this.modalService.component$.subscribe((data) => {
        if (data) {
          this.loadComponent(data);
        } else {
          this.container.clear();
        }
      }),
    );
  }
  loadComponent(data: ModalConfig) {
    this.container.clear();
    this.isOpen = true;
    const factory = this.resolver.resolveComponentFactory(data.component);
    const ref = this.container.createComponent(factory);
    if (data.config) {
      Object.assign(ref.instance, data.config);
      this.title = data.config?.title;
    }
    ref.instance.closeModal.subscribe((result: any) => {
      data.resultSubject.next(result);
      data.resultSubject.complete();
      this.modalService.close();
    });

    // this.modalService.data$.
  }

  primaryAction(): void {
    this.propertyService
      .deleteProperty(this.propertyId)
      .subscribe((res: any) => {
        this.isVisible = false;
        this.delete.emit(parseInt(this.propertyId));
      });
  }
}
