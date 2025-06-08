import assert from 'node:assert';
import { validateAll } from '../scripts/validateGameData.js';
import { idleEvents } from '../data/idleEvents.js';

let result = validateAll();
assert.ok(result, 'Game data validation failed');

idleEvents.push({
    id: 'invalid_test_event',
    stageRequired: 1,
    text: 'Invalid event',
    requiredUpgradeId: 'non_existent_upgrade'
});

result = validateAll();
assert.ok(!result, 'Validation should fail for idle events referencing missing upgrades');

idleEvents.pop();
result = validateAll();
assert.ok(result, 'Game data validation failed after cleanup');

console.log('All tests passed');

