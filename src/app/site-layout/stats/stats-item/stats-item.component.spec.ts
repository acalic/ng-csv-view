import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsItemComponent } from './stats-item.component';

describe('StatsItemComponent', () => {
  let component: StatsItemComponent;
  let fixture: ComponentFixture<StatsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
