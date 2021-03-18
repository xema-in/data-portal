import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreDatasetComponent } from './explore-dataset.component';

describe('ExploreDatasetComponent', () => {
  let component: ExploreDatasetComponent;
  let fixture: ComponentFixture<ExploreDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreDatasetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
