import { idleEvents } from '../data/idleEvents.js';
import { UPGRADE_COSTS, RESEARCH_COSTS, RESEARCH_REWARDS, TEMPTATION_COSTS, TEMPTATION_REWARDS, TEMPTATION_SUCCESS_RATES, validateUpgradeConfig, validateResearchConfig, validateTemptationConfig } from '../gameConfig.js';
import { idleEvents } from '../data/idleEvents.js';

function validateIdleEvents(upgradeIds) {
    const invalid = idleEvents.filter(evt => evt.requiresUpgradeId && !upgradeIds.includes(evt.requiresUpgradeId));
    if (invalid.length > 0) {
        console.warn('Idle events reference missing upgrades:', invalid.map(e => e.id));
    }
    return invalid.length === 0;
}

export function validateIdleEvents(upgradeIds) {
    let valid = true;
    for (const event of idleEvents) {
        if (event.requiredUpgradeId && !upgradeIds.includes(event.requiredUpgradeId)) {
            console.warn(`Idle event ${event.id} references missing upgrade: ${event.requiredUpgradeId}`);
            valid = false;
        }
    }
    return valid;
}

export function validateAll() {
    const upgradeIds = Object.keys(UPGRADE_COSTS);
    const researchIds = Object.keys(RESEARCH_COSTS);
    const temptationIds = Object.keys(TEMPTATION_COSTS);
    const upgradesValid = validateUpgradeConfig(upgradeIds);
    const researchValid = validateResearchConfig(researchIds);
    const temptationsValid = validateTemptationConfig(temptationIds);
    const idleValid = validateIdleEvents(upgradeIds);
    return upgradesValid && researchValid && temptationsValid && idleValid;
}

if (import.meta.main) {
    const ok = validateAll();
    if (ok) {
        console.log('All game data validated successfully.');
    } else {
        console.error('Game data validation failed.');
        process.exitCode = 1;
    }
}

