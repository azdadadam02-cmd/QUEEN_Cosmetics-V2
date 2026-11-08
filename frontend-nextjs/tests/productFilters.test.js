import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EMPTY_FILTERS, filterProducts, productsInView, uniqSorted } from '../src/lib/productFilters.js';

const P = [
  { id: 1, name: 'Rouge Velours', category: 'Maquillage', sub_category: 'Lèvres', in_stock: true, rating: 4.6, rating_count: 3, promo: 20, price: 80 },
  { id: 2, name: 'Eau de Rose', category: 'Parfums', sub_category: 'Floral', in_stock: false, rating: 0, rating_count: 0, promo: 0, price: 300 },
  { id: 3, name: 'Crème Nuit', category: 'Soins', sub_category: 'Visage', in_stock: true, rating: 3.4, rating_count: 2, promo: 0, price: 150 },
  { id: 4, name: 'Ancien', category: 'Soins', deleted: true, in_stock: true, rating: 0, rating_count: 0, promo: 0, price: 10 },
];
const f = (over) => ({ ...EMPTY_FILTERS, ...over });
const ids = (rows) => rows.map((p) => p.id);

test('catalogue and trash are separate', () => {
  assert.deepEqual(ids(productsInView(P, '')), [1, 2, 3]);
  assert.deepEqual(ids(productsInView(P, 'trash')), [4]);
});

test('search matches name or category, ignoring case', () => {
  assert.deepEqual(ids(filterProducts(P, f({ q: 'ROSE' }))), [2]);
  assert.deepEqual(ids(filterProducts(P, f({ q: 'soins' }))), [3, 4]);
});

test('stock, promo and category filters', () => {
  assert.deepEqual(ids(filterProducts(P, f({ dispo: 'indispo' }))), [2]);
  assert.deepEqual(ids(filterProducts(P, f({ promo: 'yes' }))), [1]);
  assert.deepEqual(ids(filterProducts(P, f({ cat: 'Soins', sub: 'Visage' }))), [3]);
});

test('stars use the rounded rating, 0 means no review', () => {
  assert.deepEqual(ids(filterProducts(P, f({ stars: '5' }))), [1]);
  assert.deepEqual(ids(filterProducts(P, f({ stars: '3' }))), [3]);
  assert.deepEqual(ids(filterProducts(P, f({ stars: '0' }))), [2, 4]);
});

test('price sort does not mutate the input', () => {
  const copy = [...P];
  assert.deepEqual(ids(filterProducts(P, f({ sort: 'desc' }))), [2, 3, 1, 4]);
  assert.deepEqual(ids(filterProducts(P, f({ sort: 'asc' }))), [4, 1, 3, 2]);
  assert.deepEqual(P, copy);
});

test('categories are unique, sorted the French way, without blanks', () => {
  assert.deepEqual(uniqSorted(['Soins', '', 'Éclat', 'Parfums', 'Soins', null]), ['Éclat', 'Parfums', 'Soins']);
});
