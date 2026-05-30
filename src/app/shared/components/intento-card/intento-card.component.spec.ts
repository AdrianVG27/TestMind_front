import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentoCardComponent } from './intento-card.component';

describe('IntentoCardComponent', () => {
  let component: IntentoCardComponent;
  let fixture: ComponentFixture<IntentoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntentoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntentoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
