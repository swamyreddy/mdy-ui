import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorPlansPricingComponent } from './floor-plans-pricing.component';

describe('FloorPlansPricingComponent', () => {
  let component: FloorPlansPricingComponent;
  let fixture: ComponentFixture<FloorPlansPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorPlansPricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorPlansPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
