import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCodigoAutenticacionComponent } from './form-codigo-autenticacion.component';

describe('FormCodigoAutenticacionComponent', () => {
  let component: FormCodigoAutenticacionComponent;
  let fixture: ComponentFixture<FormCodigoAutenticacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCodigoAutenticacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCodigoAutenticacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
