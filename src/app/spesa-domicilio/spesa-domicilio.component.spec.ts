import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpesaDomicilioComponent } from './spesa-domicilio.component';

describe('SpesaDomicilioComponent', () => {
  let component: SpesaDomicilioComponent;
  let fixture: ComponentFixture<SpesaDomicilioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpesaDomicilioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpesaDomicilioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
