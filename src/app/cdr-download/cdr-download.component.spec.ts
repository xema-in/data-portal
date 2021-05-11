import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdrDownloadComponent } from './cdr-download.component';

describe('CdrDownloadComponent', () => {
  let component: CdrDownloadComponent;
  let fixture: ComponentFixture<CdrDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdrDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CdrDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
