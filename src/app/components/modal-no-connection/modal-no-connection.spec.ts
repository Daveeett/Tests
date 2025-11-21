import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNoConnection } from './modal-no-connection';

describe('ModalNoConnection', () => {
  let component: ModalNoConnection;
  let fixture: ComponentFixture<ModalNoConnection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNoConnection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNoConnection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
