import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EMPTY_PRODUCT, productToForm, rowsToVariants, variantsToRows, variantsTotal } from '../src/lib/productForm.js';

const apiProduct = {
  id: 7, name: 'Rouge', brand: null, category: 'Maquillage', sub_category: 'Lèvres', age_range: null, details: null,
  original_price: 120, stock: 9, own_promotion: 0,
  variants: [{ id: 3, color: '#ff0000', taille: 'M', volume_ml: null, poids_g: 4, quantite_pieces: null, stock: 9 }],
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

test('variants round-trip: kept id, colour, null for empty numbers', () => {
  const rows = variantsToRows(apiProduct);
  assert.equal(rows[0].hasColor, true);
  assert.deepEqual(rowsToVariants(rows), [{ id: 3, couleur: '#ff0000', taille: 'M', volume_ml: null, poids_g: 4, quantite_pieces: null, stock: 9 }]);
});

test('unticked colour and blank size are sent as null, empty stock stays null (Laravel rejects it)', () => {
  const [v] = rowsToVariants([{ id: null, hasColor: false, couleur: '#b5736a', taille: '  ', volume_ml: '', poids_g: '', quantite_pieces: '2', stock: '' }]);
  assert.equal(v.couleur, null);
  assert.equal(v.taille, null);
  assert.equal(v.quantite_pieces, 2);
  assert.equal(v.stock, null);
});

test('total stock ignores blanks', () => {
  assert.equal(variantsTotal([{ stock: '3' }, { stock: '' }, { stock: '4' }]), 7);
});
