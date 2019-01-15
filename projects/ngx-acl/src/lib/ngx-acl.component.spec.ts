import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAclComponent } from './ngx-acl.component';

describe('NgxAclComponent', () => {
  let component: NgxAclComponent;
  let fixture: ComponentFixture<NgxAclComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxAclComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxAclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
