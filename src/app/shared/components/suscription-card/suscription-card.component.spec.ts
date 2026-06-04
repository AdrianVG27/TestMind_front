import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuscriptionCardComponent } from './suscription-card.component';

describe('SuscriptionCardComponent', () => {
  let component: SuscriptionCardComponent;
  let fixture: ComponentFixture<SuscriptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuscriptionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuscriptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
