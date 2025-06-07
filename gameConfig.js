// gameConfig.js
// Centralized game balancing configuration
// All numerical values for costs, rewards, thresholds, and game balance

// === UPGRADE COSTS ===
export const UPGRADE_COSTS = {
    // Early Game Upgrades
    essence_boost_1: { essence: 25, darkEssence: 0 },
    passive_essence_1: { essence: 60, darkEssence: 0 },
    purity_chance_1: { essence: 75, darkEssence: 0 },
    charm_scroll_1: { essence: 150, darkEssence: 0 },
    essence_boost_2: { essence: 300, darkEssence: 0 },
    passive_essence_2: { essence: 1200, darkEssence: 0 },
    essence_mastery_choice_unlock: { essence: 400, darkEssence: 0 },
    
    // Nest Upgrades
    nest_bed_upgrade_1: { essence: 200, darkEssence: 10 },
    nest_dark_altar_1: { essence: 500, darkEssence: 50 },
    nest_decor_skulls: { essence: 120, darkEssence: 25 },
    
    // Dark Gifts & Advanced
    dark_gift_shadow_kiss: { essence: 0, darkEssence: 75 },
    train_praktykant_1: { essence: 800, darkEssence: 75 },
    recruit_arch_succubus_apprentice: { essence: 7500, darkEssence: 500 },
    
    // Arch Powers
    arch_power_reality_converter: { essence: 25000, darkEssence: 250 },
    arch_power_omnipresent_holes: { essence: 40000, darkEssence: 300 },
};

// === UPGRADE VALUES ===
export const UPGRADE_VALUES = {
    // Click Boosts
    essence_boost_1: 1,
    essence_boost_2: 5,
    
    // Passive Essence
    passive_essence_1: 0.5,
    passive_essence_2: 5,
    
    // Action Modifiers
    purity_chance_1: 0.1,
    
    // Dark Essence Multipliers
    dark_gift_shadow_kiss: 0.10,
    
    // Passive Dark Essence
    nest_dark_altar_1: 0.2,
    arch_power_reality_converter: 5,
    
    // Corruption Bonuses
    arch_power_reality_converter_corruption: 0.2,
    
    // Minion Counts
    train_praktykant_1: 1,
};

// === RESEARCH PROJECT COSTS ===
export const RESEARCH_COSTS = {
    rp_basic_essence_upgrades: { essence: 30, darkEssence: 0 },
    rp_intro_arcane_arts: { essence: 80, darkEssence: 10 },
    rp_advanced_essence_manipulation: { essence: 400, darkEssence: 50 },
    rp_essence_transfer_basics: { essence: 120, darkEssence: 0 },
    rp_succubus_anatomy_secrets: { essence: 250, darkEssence: 0 },
    rp_dark_anatomy_wings: { essence: 380, darkEssence: 20 },
    rp_forbidden_knowledge_whispers: { essence: 500, darkEssence: 50 },
    rp_mind_manipulation_basics: { essence: 300, darkEssence: 30 },
    rp_unlock_temptations: { essence: 180, darkEssence: 10 },
    rp_unlock_minions_basic: { essence: 1500, darkEssence: 200 },
    rp_advanced_seduction_techniques: { essence: 650, darkEssence: 70 },
};

// === RESEARCH PROJECT REWARDS ===
export const RESEARCH_REWARDS = {
    rp_basic_essence_upgrades: { corruption: 5 },
    rp_intro_arcane_arts: { corruption: 10 },
    rp_advanced_essence_manipulation: { corruption: 20 },
    rp_essence_transfer_basics: { corruption: 35 },
    rp_succubus_anatomy_secrets: { corruption: 50 },
    rp_dark_anatomy_wings: { corruption: 40 },
    rp_forbidden_knowledge_whispers: { corruption: 60 },
    rp_mind_manipulation_basics: { corruption: 30 },
    rp_unlock_temptations: { corruption: 25 },
    rp_unlock_minions_basic: { corruption: 100 },
    rp_advanced_seduction_techniques: { corruption: 50 },
};

// === DARK RITUAL COSTS ===
export const RITUAL_COSTS = {
    ritual_shadow_bond: { essence: 400, darkEssence: 40 },
    ritual_arch_succubus_ascension: { essence: 15000, darkEssence: 150 },
};

// === DARK RITUAL REWARDS ===
export const RITUAL_REWARDS = {
    ritual_shadow_bond: { 
        corruption: 30, 
        corruptionBonusMultiplier: 0.1 
    },
    ritual_arch_succubus_ascension: {
        targetStage: 8
    },
};

// === TEMPTATION MISSION BALANCING ===
export const TEMPTATION_COSTS = {
    tempt_corrupt_cleric: { essence: 80, darkEssence: 15 },
    tempt_seduce_knight: { essence: 200, darkEssence: 40 },
    tempt_incite_orgy_village_festival: { essence: 400, darkEssence: 80 },
};

export const TEMPTATION_DURATIONS = {
    tempt_corrupt_cleric: 60,
    tempt_seduce_knight: 120,
    tempt_incite_orgy_village_festival: 180,
};

export const TEMPTATION_SUCCESS_RATES = {
    tempt_corrupt_cleric: 0.65,
    tempt_seduce_knight: 0.55,
    tempt_incite_orgy_village_festival: 0.45,
};

export const TEMPTATION_REWARDS = {
    tempt_corrupt_cleric: {
        success: { corruption: 50, darkEssence: 30, essence: 150 },
        failure: { corruption: 5, darkEssence: 2 }
    },
    tempt_seduce_knight: {
        success: { corruption: 70, darkEssence: 45, essence: 300 },
        failure: { corruption: 10, darkEssence: 5 }
    },
    tempt_incite_orgy_village_festival: {
        success: { corruption: 150, darkEssence: 80, essence: 700 },
        failure: { corruption: 20, darkEssence: 10 }
    },
};

export const TEMPTATION_REQUIREMENTS = {
    tempt_corrupt_cleric: { stage: 3, corruption: 0 },
    tempt_seduce_knight: { stage: 4, corruption: 0 },
    tempt_incite_orgy_village_festival: { stage: 5, corruption: 0 },
};

// === STAGE PROGRESSION REQUIREMENTS ===
export const STAGE_REQUIREMENTS = {
    // Stage progression is currently handled by Breaking Point dialogues
    // These could be used for alternative progression systems
    0: { corruption: 0 },
    1: { corruption: 50 },
    2: { corruption: 150 },
    3: { corruption: 300 },
    4: { corruption: 500 },
    5: { corruption: 800 },
    6: { corruption: 1200 },
    7: { corruption: 1800 },
    8: { corruption: 2500 },
};

// === DIALOGUE COSTS ===
export const DIALOGUE_COSTS = {
    // Most dialogues are free, but some special ones have costs
    summoning_ritual: { essence: 0, darkEssence: 0 },
    // Add specific dialogue costs here as needed
};

// === DIALOGUE REWARDS (Base values, before multipliers) ===
export const DIALOGUE_BASE_REWARDS = {
    // These are base values that get modified by sexual preferences and multipliers
    // Specific dialogue option rewards are defined in narrativeElements.js
    // This section can be expanded to centralize those values too
};

// === NEST UPGRADE REWARDS ===
export const NEST_UPGRADE_REWARDS = {
    nest_bed_upgrade_1: { corruption: 10 },
    nest_dark_altar_1: { corruption: 15 },
    nest_decor_skulls: { corruption: 15, darkEssence: 10 },
};

// === CHOICE UPGRADE VALUES ===
export const CHOICE_UPGRADE_VALUES = {
    essence_mastery_1: {
        click_focus_max: { type: 'click_boost', value: 15 },
        passive_flow_max: { type: 'passive_essence', value: 8 }
    }
};

// === ELITE MINION STATS ===
export const ELITE_MINION_STATS = {
    arch_succubus_apprentice: {
        passiveEssenceGeneration: 1.5,
        temptationEffectivenessModifier: 0.80,
    }
};

// === GAME BALANCE MODIFIERS ===
export const BALANCE_MODIFIERS = {
    // Temptation success chance modifiers
    temptation: {
        corruptionBonus: 0.0005, // Per point of corruption above requirement
        minionBonus: 0.05, // Per assigned minion
        suggestionBasicsBonus: 0.10,
        advancedSeductionBonus: 0.15,
        apprenticeEffectivenessReduction: 0.5, // Apprentice gets 50% of normal rewards
    },
    
    // Sexual preference bonuses
    sexualPreference: {
        bonusPerLevel: 0.05, // 5% bonus per preference level
    },
    
    // Essence reaction thresholds
    essenceReactions: [
        { threshold: 1000 },
        { threshold: 500 },
        { threshold: 100 }
    ],
    
    // Vocal thought system
    vocalThoughts: {
        changeIntervalSeconds: 60,
        fadeDelayMs: 15000,
        maxRecentThoughts: 5,
    },
    
    // Thought display timing
    thoughts: {
        minIntervalMs: 20000,
        displayDurationMs: 15000,
    }
};

// === VALIDATION HELPERS ===
// Helper functions to validate that all required IDs have corresponding config entries

export function validateUpgradeConfig(upgradeIds) {
    const missingCosts = upgradeIds.filter(id => !UPGRADE_COSTS[id]);
    if (missingCosts.length > 0) {
        console.warn('Missing upgrade costs for:', missingCosts);
    }
    return missingCosts.length === 0;
}

export function validateResearchConfig(researchIds) {
    const missingCosts = researchIds.filter(id => !RESEARCH_COSTS[id]);
    const missingRewards = researchIds.filter(id => !RESEARCH_REWARDS[id]);
    if (missingCosts.length > 0) {
        console.warn('Missing research costs for:', missingCosts);
    }
    if (missingRewards.length > 0) {
        console.warn('Missing research rewards for:', missingRewards);
    }
    return missingCosts.length === 0 && missingRewards.length === 0;
}

export function validateTemptationConfig(temptationIds) {
    const missingCosts = temptationIds.filter(id => !TEMPTATION_COSTS[id]);
    const missingRewards = temptationIds.filter(id => !TEMPTATION_REWARDS[id]);
    const missingRates = temptationIds.filter(id => !TEMPTATION_SUCCESS_RATES[id]);
    
    if (missingCosts.length > 0) {
        console.warn('Missing temptation costs for:', missingCosts);
    }
    if (missingRewards.length > 0) {
        console.warn('Missing temptation rewards for:', missingRewards);
    }
    if (missingRates.length > 0) {
        console.warn('Missing temptation success rates for:', missingRates);
    }
    
    return missingCosts.length === 0 && missingRewards.length === 0 && missingRates.length === 0;
}

// === EASY BALANCING PRESETS ===
// Predefined multipliers for easy difficulty adjustment

export const DIFFICULTY_PRESETS = {
    easy: {
        costMultiplier: 0.7,
        rewardMultiplier: 1.3,
        progressionSpeedMultiplier: 1.5,
    },
    normal: {
        costMultiplier: 1.0,
        rewardMultiplier: 1.0,
        progressionSpeedMultiplier: 1.0,
    },
    hard: {
        costMultiplier: 1.5,
        rewardMultiplier: 0.8,
        progressionSpeedMultiplier: 0.7,
    }
};

// Helper function to apply difficulty preset
export function applyDifficultyPreset(preset, baseValue, type = 'cost') {
    const multiplier = type === 'cost' ? preset.costMultiplier : 
                     type === 'reward' ? preset.rewardMultiplier : 
                     preset.progressionSpeedMultiplier;
    return Math.floor(baseValue * multiplier);
}