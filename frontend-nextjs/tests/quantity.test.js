import assert from 'node:assert/strict';
import { test } from 'node:test';
import { clampQty, typedQty } from '../src/lib/quantity.js';

test('stays between 1 and max', () => {
  assert.equal(clampQty(5, 20), 5);
  assert.equal(clampQty(0, 20), 1);
  assert.equal(clampQty(-3, 20), 1);
  assert.equal(clampQty(25, 20), 20);
  assert.equal(clampQty(7, 3), 3);
});

test('decimals are floored, garbage becomes 1', () => {
  assert.equal(clampQty(2.9, 20), 2);
  assert.equal(clampQty('abc', 20), 1);
  assert.equal(clampQty(NaN, 20), 1);
});

test('a sold-out or missing max still allows 1', () => {
  assert.equal(clampQty(4, 0), 1);
  assert.equal(clampQty(4, undefined), 1);
});

test('typing keeps digits only and clamps; empty stays empty while typing', () => {
  assert.equal(typedQty('12', 20), 12);
  assert.equal(typedQty('99', 20), 20);
  assert.equal(typedQty('0', 20), 1);
  assert.equal(typedQty('1a2', 20), 12);
  assert.equal(typedQty('', 20), null);
  assert.equal(typedQty('-', 20), null);
});
