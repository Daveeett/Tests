import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navbartool } from './navbartool';

describe('Navbartool', () => {
  let component: Navbartool;
  let fixture: ComponentFixture<Navbartool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbartool]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navbartool);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
