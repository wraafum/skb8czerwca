import { UPGRADE_COSTS, RESEARCH_COSTS, RESEARCH_REWARDS, TEMPTATION_COSTS, TEMPTATION_REWARDS, TEMPTATION_SUCCESS_RATES, validateUpgradeConfig, validateResearchConfig, validateTemptationConfig } from '../gameConfig.js';

export function validateAll() {
    const upgradeIds = Object.keys(UPGRADE_COSTS);
    const researchIds = Object.keys(RESEARCH_COSTS);
    const temptationIds = Object.keys(TEMPTATION_COSTS);
    const upgradesValid = validateUpgradeConfig(upgradeIds);
    const researchValid = validateResearchConfig(researchIds);
    const temptationsValid = validateTemptationConfig(temptationIds);
    return upgradesValid && researchValid && temptationsValid;
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

