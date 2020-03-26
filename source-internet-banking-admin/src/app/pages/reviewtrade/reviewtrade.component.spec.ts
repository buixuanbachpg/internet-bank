import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewtradeComponent } from './reviewtrade.component';

describe('ReviewtradeComponent', () => {
  let component: ReviewtradeComponent;
  let fixture: ComponentFixture<ReviewtradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewtradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewtradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
