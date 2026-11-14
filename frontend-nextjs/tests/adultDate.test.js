import assert from 'node:assert/strict';
import { test } from 'node:test';
import { latestAdultBirthDate } from '../src/lib/adultDate.js';

test('born exactly 18 years ago today is the latest allowed date', () => {
  assert.equal(latestAdultBirthDate(new Date(2026, 10, 8)), '2008-11-08');
});

test('29 February maps to 28 February in a non-leap year (not 1 March)', () => {
  assert.equal(latestAdultBirthDate(new Date(2028, 1, 29)), '2010-02-28');
});

test('29 February is kept when 18 years earlier is also leap', () => {
  assert.equal(latestAdultBirthDate(new Date(2026, 1, 28)), '2008-02-28');
  assert.equal(latestAdultBirthDate(new Date(2032, 1, 29)), '2014-02-28');
  assert.equal(latestAdultBirthDate(new Date(2036, 1, 29)), '2018-02-28');
  assert.equal(latestAdultBirthDate(new Date(2042, 1, 28)), '2024-02-28');
});

test('month and day are zero-padded for the date input', () => {
  assert.equal(latestAdultBirthDate(new Date(2026, 0, 5)), '2008-01-05');
});
