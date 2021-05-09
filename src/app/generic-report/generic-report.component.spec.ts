import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericReportComponent } from './generic-report.component';

describe('GenericReportComponent', () => {
  let component: GenericReportComponent;
  let fixture: ComponentFixture<GenericReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
