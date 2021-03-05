import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingsPlaybackDialogComponent } from './recordings-playback-dialog.component';

describe('RecordingsPlaybackDialogComponent', () => {
  let component: RecordingsPlaybackDialogComponent;
  let fixture: ComponentFixture<RecordingsPlaybackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingsPlaybackDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingsPlaybackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
