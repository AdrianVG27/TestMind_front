import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationManagementComponent } from './translation-management.component';

describe('TranslationManagementComponent', () => {
  let component: TranslationManagementComponent;
  let fixture: ComponentFixture<TranslationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
