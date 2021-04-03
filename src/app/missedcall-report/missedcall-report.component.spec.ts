import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissedcallReportComponent } from './missedcall-report.component';

describe('MissedcallReportComponent', () => {
  let component: MissedcallReportComponent;
  let fixture: ComponentFixture<MissedcallReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissedcallReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissedcallReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
