import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyDetectionComponent } from './early-detection.component';

describe('EarlyDetectionComponent', () => {
  let component: EarlyDetectionComponent;
  let fixture: ComponentFixture<EarlyDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarlyDetectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarlyDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
