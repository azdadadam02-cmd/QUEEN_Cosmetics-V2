import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pickVariant } from '../src/lib/variants.js';

const V = [
  { id: 1, color: 'rouge', size: 'S', stock: 2 },
  { id: 2, color: 'rouge', size: 'M', stock: 0 },
  { id: 3, color: 'noir', size: 'S', stock: 0 },
  { id: 4, color: 'noir', size: 'M', stock: 5 },
];

test('keeps the other option when that combination is in stock', () => {
  assert.equal(pickVariant(V, V[3], 'size', 'S').id, 1);
});

test('falls back to the first in-stock variant of the chosen option', () => {
  assert.equal(pickVariant(V, V[0], 'color', 'noir').id, 4);
});

test('returns a sold-out variant when nothing of that option is in stock', () => {
  const soldOut = [{ id: 9, color: 'bleu', size: 'L', stock: 0 }, ...V];
  assert.equal(pickVariant(soldOut, V[0], 'color', 'bleu').id, 9);
});
