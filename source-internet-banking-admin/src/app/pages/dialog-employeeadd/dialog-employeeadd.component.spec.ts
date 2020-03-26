import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEmployeeaddComponent } from './dialog-employeeadd.component';

describe('DialogEmployeeaddComponent', () => {
  let component: DialogEmployeeaddComponent;
  let fixture: ComponentFixture<DialogEmployeeaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEmployeeaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEmployeeaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
