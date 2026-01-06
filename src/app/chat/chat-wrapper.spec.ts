import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWrapper } from './chat-wrapper';

describe('ChatWrapper', () => {
  let component: ChatWrapper;
  let fixture: ComponentFixture<ChatWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatWrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
