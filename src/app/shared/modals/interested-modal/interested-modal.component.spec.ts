import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestedModalComponent } from './interested-modal.component';

describe('InterestedModalComponent', () => {
  let component: InterestedModalComponent;
  let fixture: ComponentFixture<InterestedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestedModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
