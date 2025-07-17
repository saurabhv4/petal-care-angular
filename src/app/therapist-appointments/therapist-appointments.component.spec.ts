import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistAppointmentsComponent } from './therapist-appointments.component';

describe('TherapistAppointmentsComponent', () => {
  let component: TherapistAppointmentsComponent;
  let fixture: ComponentFixture<TherapistAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapistAppointmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapistAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
