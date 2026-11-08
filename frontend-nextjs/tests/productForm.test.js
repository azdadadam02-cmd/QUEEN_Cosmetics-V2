import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EMPTY_PRODUCT, productToForm, rowsToVariants, variantsToRows, variantsTotal } from '../src/lib/productForm.js';

const apiProduct = {
  id: 7, name: 'Eau de parfum', brand: null, category: 'Parfums', sub_category: null, age_range: null, details: null,
  original_price: 120, stock: 15, own_promotion: 0,
  variants: [
    { id: 3, color: '#ff0000', taille: null, volume_ml: null, poids_g: null, quantite_pieces: null, prix: null, stock: 9 },
    { id: 4, color: null, taille: null, volume_ml: 100, poids_g: null, quantite_pieces: null, prix: 140, stock: 6 },
  ],
};

test('a new product starts empty', () => {
  assert.equal(productToForm({}), EMPTY_PRODUCT);
});

test('an existing product fills the form with strings', () => {
  const f = productToForm(apiProduct);
  assert.equal(f.prix, '120');
  assert.equal(f.marque, '');
  assert.equal(f.promotion, '');
});

test('variants go into the colour list or the size list', () => {
  const [color, size] = variantsToRows(apiProduct);
  assert.equal(color.kind, 'color');
  assert.equal(color.prix, '');
  assert.equal(size.kind, 'size');
  assert.equal(size.volume_ml, '100');
  assert.equal(size.prix, '140');
});

test('round-trip keeps ids, never mixes colour and size, keeps prices', () => {
  assert.deepEqual(rowsToVariants(variantsToRows(apiProduct)), [
    { id: 3, couleur: '#ff0000', taille: null, volume_ml: null, poids_g: null, quantite_pieces: null, prix: null, stock: 9 },
    { id: 4, couleur: null, taille: null, volume_ml: 100, poids_g: null, quantite_pieces: null, prix: '140', stock: 6 },
  ]);
});

test('a colour line drops size fields even if some were typed', () => {
  const [v] = rowsToVariants([{ id: null, kind: 'color', couleur: '#111111', taille: 'M', volume_ml: '50', prix: ' 99,5 ', stock: '3' }]);
  assert.equal(v.taille, null);
  assert.equal(v.volume_ml, null);
  assert.equal(v.prix, '99,5');
});

test('blank size and empty stock stay null (Laravel rejects an empty stock)', () => {
  const [v] = rowsToVariants([{ id: null, kind: 'size', taille: '  ', volume_ml: '', poids_g: '', quantite_pieces: '2', prix: '', stock: '' }]);
  assert.equal(v.taille, null);
  assert.equal(v.quantite_pieces, 2);
  assert.equal(v.prix, null);
  assert.equal(v.stock, null);
});

test('total stock ignores blanks', () => {
  assert.equal(variantsTotal([{ stock: '3' }, { stock: '' }, { stock: '4' }]), 7);
});

test('an old colour + size line goes to the size list and flags the colour that will be dropped', () => {
  const [row] = variantsToRows({ variants: [{ id: 20, color: '#e61b00', taille: 'L', volume_ml: null, poids_g: null, quantite_pieces: 75, prix: null, stock: 44 }] });
  assert.equal(row.kind, 'size');
  assert.equal(row.taille, 'L');
  assert.equal(row.legacyColor, '#e61b00');
  assert.equal(rowsToVariants([row])[0].couleur, null);
});
