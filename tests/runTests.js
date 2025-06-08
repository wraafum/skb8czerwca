import assert from 'node:assert';
import { validateAll } from '../scripts/validateGameData.js';

const result = validateAll();
assert.ok(result, 'Game data validation failed');
console.log('All tests passed');

