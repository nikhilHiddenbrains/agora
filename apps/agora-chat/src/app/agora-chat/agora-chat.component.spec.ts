import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgoraChatComponent } from './agora-chat.component';

describe('AgoraChatComponent', () => {
  let component: AgoraChatComponent;
  let fixture: ComponentFixture<AgoraChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AgoraChatComponent]
    });
    fixture = TestBed.createComponent(AgoraChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
