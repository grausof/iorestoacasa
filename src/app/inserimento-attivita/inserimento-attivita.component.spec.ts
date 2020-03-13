import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserimentoAttivitaComponent } from './inserimento-attivita.component';

describe('InserimentoAttivitaComponent', () => {
  let component: InserimentoAttivitaComponent;
  let fixture: ComponentFixture<InserimentoAttivitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserimentoAttivitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserimentoAttivitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
