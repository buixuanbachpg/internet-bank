import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInformationComponent } from './account-information.component';

describe('DashDefaultComponent', () => {
  let component: AccountInformationComponent;
  let fixture: ComponentFixture<AccountInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
