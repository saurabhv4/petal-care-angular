import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherMemberComponent } from './other-member.component';

describe('OtherMemberComponent', () => {
  let component: OtherMemberComponent;
  let fixture: ComponentFixture<OtherMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
