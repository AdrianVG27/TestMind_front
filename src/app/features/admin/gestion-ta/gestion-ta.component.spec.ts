import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTAComponent } from './gestion-ta.component';

describe('GestionTAComponent', () => {
  let component: GestionTAComponent;
  let fixture: ComponentFixture<GestionTAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionTAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
