import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboraComponent } from './collabora.component';

describe('CollaboraComponent', () => {
  let component: CollaboraComponent;
  let fixture: ComponentFixture<CollaboraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
