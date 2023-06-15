import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabirintoPage } from './labirinto.page';

describe('LabirintoPage', () => {
  let component: LabirintoPage;
  let fixture: ComponentFixture<LabirintoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LabirintoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
