import { TestBed } from '@angular/core/testing';

import { UserContentResolver } from './user-content.resolver';

describe('UserContentResolver', () => {
  let resolver: UserContentResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(UserContentResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
