import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadpoliciaisComponent } from './cadpoliciais.component';

describe('CadpoliciaisComponent', () => {
  let component: CadpoliciaisComponent;
  let fixture: ComponentFixture<CadpoliciaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadpoliciaisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadpoliciaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
