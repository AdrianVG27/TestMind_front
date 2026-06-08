import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEditListComponent } from './test-edit-list.component';

describe('TestEditListComponent', () => {
  let component: TestEditListComponent;
  let fixture: ComponentFixture<TestEditListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestEditListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestEditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
