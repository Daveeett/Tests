import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDeveloper } from './login-developer';

describe('LoginDeveloper', () => {
  let component: LoginDeveloper;
  let fixture: ComponentFixture<LoginDeveloper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginDeveloper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginDeveloper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
