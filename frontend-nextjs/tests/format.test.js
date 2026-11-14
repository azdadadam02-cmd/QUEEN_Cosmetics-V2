import assert from 'node:assert/strict';
import { test } from 'node:test';
import { dayDate } from '../src/lib/format.js';

test('reads the day Laravel computed in the shop timezone, whatever the machine timezone', () => {
  assert.equal(dayDate('2026-11-08T00:30:00+01:00'), '8 novembre 2026');
  assert.equal(dayDate('2026-03-01T23:59:00+00:00'), '1 mars 2026');
  assert.equal(dayDate('2026-08-15'), '15 août 2026');
});

test('missing or broken dates give an empty string', () => {
  assert.equal(dayDate(null), '');
  assert.equal(dayDate('n/a'), '');
});
