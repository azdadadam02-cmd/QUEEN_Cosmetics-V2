import assert from 'node:assert/strict';
import { test } from 'node:test';
import { layoutCatalog, NONE, searchCatalog } from '../src/lib/catalog.js';

const product = (id, category, sub_category, name = `P${id}`, brand = 'Queen') => ({ id, name, brand, category, sub_category });
const P = [
  product(1, 'Parfums', 'Floral', 'Eau de Rosé'),
  product(2, 'Parfums', 'Boisé'),
  product(3, 'Soins', 'Visage', 'Crème hydratante', 'Nivéa'),
  product(4, null, null, 'Sans catégorie'),
];
const ids = (rows) => rows.map((p) => p.id);

test('search ignores accents and case, every word must match', () => {
  assert.deepEqual(ids(searchCatalog(P, [], { q: 'rose EAU' }).list), [1]);
  assert.deepEqual(ids(searchCatalog(P, [], { q: 'nivea creme' }).list), [3]);
  assert.deepEqual(ids(searchCatalog(P, [], { q: 'rose soins' }).list), []);
});

test('products without category fall under "Autres"', () => {
  assert.deepEqual(ids(searchCatalog(P, [], { q: '', cat: NONE }).list), [4]);
});

test('a pack is found by one of its products, only without category filter', () => {
  const packs = [{ id: 9, name: 'Coffret', products: [{ name: 'Crème hydratante' }] }];
  assert.deepEqual(searchCatalog(P, packs, { q: 'creme' }).foundPacks.map((k) => k.id), [9]);
  assert.deepEqual(searchCatalog(P, packs, { q: 'creme', cat: 'Soins' }).foundPacks, []);
});

test('home view groups by category, a category groups by sub-category', () => {
  assert.deepEqual(layoutCatalog(P, { page: 1 }).rows.map(([name]) => name), ['Autres', 'Parfums', 'Soins']);
  const parfums = P.filter((p) => p.category === 'Parfums');
  assert.deepEqual(layoutCatalog(parfums, { cat: 'Parfums' }).rows.map(([name]) => name), ['Boisé', 'Floral']);
});

test('a search shows a paginated grid of 12, page number is clamped', () => {
  const many = Array.from({ length: 30 }, (_, i) => product(i + 1, 'Soins', 'Visage'));
  const first = layoutCatalog(many, { q: 'p', page: 1 });
  assert.equal(first.rows, null);
  assert.equal(first.pages, 3);
  assert.equal(first.pageItems.length, 12);
  assert.equal(layoutCatalog(many, { q: 'p', page: 99 }).page, 3);
  assert.equal(layoutCatalog(many, { q: 'p', page: 'abc' }).page, 1);
});
