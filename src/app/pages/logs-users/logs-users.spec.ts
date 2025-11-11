import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsUsers } from './logs-users';

describe('LogsUsers', () => {
  let component: LogsUsers;
  let fixture: ComponentFixture<LogsUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogsUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
