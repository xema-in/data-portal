import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRecordingsComponent } from './search-recordings.component';

describe('SearchRecordingsComponent', () => {
  let component: SearchRecordingsComponent;
  let fixture: ComponentFixture<SearchRecordingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRecordingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRecordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
