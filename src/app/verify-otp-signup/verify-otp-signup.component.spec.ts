import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyOtpSignupComponent } from './verify-otp-signup.component';

describe('VerifyOtpSignupComponent', () => {
  let component: VerifyOtpSignupComponent;
  let fixture: ComponentFixture<VerifyOtpSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyOtpSignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyOtpSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
