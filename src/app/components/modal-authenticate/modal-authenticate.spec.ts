import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAuthenticate } from './modal-authenticate';

describe('ModalAuthenticate', () => {
  let component: ModalAuthenticate;
  let fixture: ComponentFixture<ModalAuthenticate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAuthenticate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAuthenticate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
