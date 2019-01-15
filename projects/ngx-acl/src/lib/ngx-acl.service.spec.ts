import { TestBed } from '@angular/core/testing';

import { NgxAclService } from './ngx-acl.service';

describe('NgxAclService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxAclService = TestBed.get(NgxAclService);
    expect(service).toBeTruthy();
  });
});
