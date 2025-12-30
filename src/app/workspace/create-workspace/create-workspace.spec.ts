import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkspace } from './create-workspace';

describe('CreateWorkspace', () => {
  let component: CreateWorkspace;
  let fixture: ComponentFixture<CreateWorkspace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWorkspace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateWorkspace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
