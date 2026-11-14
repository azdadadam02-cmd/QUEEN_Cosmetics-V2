import assert from 'node:assert/strict';
import { test } from 'node:test';
import { safeInternalPath } from '../src/lib/safePath.js';

const O = 'http://localhost:3000';
const bs = String.fromCharCode(92);

test('internal paths are kept, with query and hash', () => {
  assert.equal(safeInternalPath('/checkout', O), '/checkout');
  assert.equal(safeInternalPath('/products?cat=Soins#x', O), '/products?cat=Soins#x');
});

test('anything leaving the site is refused', () => {
  for (const evil of ['//evil.com', `/${bs}evil.com`, `/${bs}${bs}evil.com`, `/${bs}/evil.com`, '/\t/evil.com', 'https://evil.com', 'javascript:alert(1)', 'evil.com', '']) {
    assert.equal(safeInternalPath(evil, O), null, JSON.stringify(evil));
  }
});

test('non-string input is refused', () => {
  assert.equal(safeInternalPath(null, O), null);
  assert.equal(safeInternalPath(undefined, O), null);
});
