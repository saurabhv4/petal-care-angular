import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule

import { VerifyOtpComponent } from './verify-otp.component';

describe('VerifyOtpComponent', () => {
  let component: VerifyOtpComponent;
  let fixture: ComponentFixture<VerifyOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyOtpComponent],
      imports: [ReactiveFormsModule, RouterTestingModule], // Add necessary modules
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
