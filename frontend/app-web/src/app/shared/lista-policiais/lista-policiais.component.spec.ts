import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPoliciaisComponent } from './lista-policiais.component';

describe('ListaPoliciaisComponent', () => {
  let component: ListaPoliciaisComponent;
  let fixture: ComponentFixture<ListaPoliciaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPoliciaisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPoliciaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
