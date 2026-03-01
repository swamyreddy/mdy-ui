import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalModalComponent } from './gobal-modal.component';

describe('GlobalModalComponent', () => {
  let component: GlobalModalComponent;
  let fixture: ComponentFixture<GlobalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
