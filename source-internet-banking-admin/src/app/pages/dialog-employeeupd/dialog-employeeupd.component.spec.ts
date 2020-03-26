import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEmployeeupdComponent } from './dialog-employeeupd.component';

describe('DialogEmployeeupdComponent', () => {
  let component: DialogEmployeeupdComponent;
  let fixture: ComponentFixture<DialogEmployeeupdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEmployeeupdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEmployeeupdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
