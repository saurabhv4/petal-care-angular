import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestiondescComponent } from './questiondesc.component';

describe('QuestiondescComponent', () => {
  let component: QuestiondescComponent;
  let fixture: ComponentFixture<QuestiondescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestiondescComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestiondescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
