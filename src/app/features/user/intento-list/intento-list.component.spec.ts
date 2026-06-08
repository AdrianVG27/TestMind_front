import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentoListComponent } from './intento-list.component';

describe('IntentoListComponent', () => {
  let component: IntentoListComponent;
  let fixture: ComponentFixture<IntentoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntentoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
