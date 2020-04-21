import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtReminderManagementComponent } from './debt-reminder-management.component';


describe('DebtReminderManagementComponent', () => {
  let component: DebtReminderManagementComponent;
  let fixture: ComponentFixture<DebtReminderManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebtReminderManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtReminderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
