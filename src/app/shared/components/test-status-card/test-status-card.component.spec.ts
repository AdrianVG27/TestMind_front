import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStatusCardComponent } from './test-status-card.component';

describe('TestStatusCardComponent', () => {
  let component: TestStatusCardComponent;
  let fixture: ComponentFixture<TestStatusCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestStatusCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestStatusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
