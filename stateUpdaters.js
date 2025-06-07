// stateUpdaters.js
import { gameState } from './playerState.js'; // Import the mutable gameState
import * as ui from './uiUpdates.js'; // Import for marking UI dirty

// --- Basic Resource Updaters ---
// POPRAWKA: Funkcje aktualizujące zasoby teraz oznaczają wszystkie zależne sekcje jako "brudne" (dirty),
// co wymusza ich przerysowanie i ponowne sprawdzenie warunków (np. czy stać gracza na ulepszenie).
export function updateEssence(amount) {
    gameState.essence = Math.max(0, gameState.essence + amount);
    ui.markResourcesDirty();
    ui.markDialoguesDirty();
    ui.markUpgradesDirty();
    ui.markResearchDirty();
    ui.markRitualsDirty();
    ui.markTemptationsDirty();
}

export function updateDarkEssence(amount) {
    gameState.darkEssence = Math.max(0, gameState.darkEssence + amount);
    ui.markResourcesDirty();
    ui.markDialoguesDirty();
    ui.markUpgradesDirty();
    ui.markResearchDirty();
    ui.markRitualsDirty();
    ui.markTemptationsDirty();
}

export function updateCorruption(amount) {
    gameState.corruption = Math.max(0, gameState.corruption + amount);
    ui.markResourcesDirty();
    ui.markDialoguesDirty();
    ui.markUpgradesDirty();
    ui.markResearchDirty();
    ui.markRitualsDirty();
    ui.markTemptationsDirty();
}

// --- Game Progression Flags & IDs ---
export function addPlayerChoiceFlag(flag) {
    if (!gameState.playerChoiceFlags) {
        gameState.playerChoiceFlags = [];
    }
    if (!gameState.playerChoiceFlags.includes(flag)) {
        gameState.playerChoiceFlags.push(flag);
    }
}

export function addCompletedDialogue(dialogueId) {
    if (!gameState.completedDialogues) {
        gameState.completedDialogues = [];
    }
    if (!gameState.completedDialogues.includes(dialogueId)) {
        gameState.completedDialogues.push(dialogueId);
        ui.markDialoguesDirty();
    }
}

export function addUnlockedDiaryEntry(entryId) {
    if (!gameState.unlockedDiaryEntryIds) {
        gameState.unlockedDiaryEntryIds = [];
    }
    if (!gameState.unlockedDiaryEntryIds.includes(entryId)) {
        gameState.unlockedDiaryEntryIds.push(entryId);
        ui.markDiaryDirty();
    }
}

export function addDiscoveredLore(loreEntry) {
    if (!gameState.discoveredLore) {
        gameState.discoveredLore = [];
    }
    gameState.discoveredLore.push(loreEntry);
    ui.markLoreDirty();
}

// --- Lilith's State ---
export function setLilithName(name) {
    gameState.lilithName = name;
    ui.markLilithDisplayDirty();
}

export function setLilithStage(stage) {
    if (gameState.lilithStage !== stage) {
        gameState.lilithStage = stage;
        ui.markLilithDisplayDirty();
        ui.markAllSectionsDirty(); // Stage change can affect everything
    }
}

export function setLilithThoughtsOverride(text) {
    gameState.lilithThoughtsOverride = text;
    ui.markLilithDisplayDirty();
}

export function clearLilithThoughtsOverride() {
    gameState.lilithThoughtsOverride = null;
    ui.markLilithDisplayDirty();
}

export function setLilithBecameVocal(value) {
    gameState.lilithBecameVocal = Boolean(value);
    ui.markLilithDisplayDirty();
}

export function setFirstVocalThoughtShown(value) {
    gameState.firstVocalThoughtShown = Boolean(value);
}


// --- Core Game Mechanics State ---
export function setActiveDialogue(dialogue) {
    gameState.activeDialogue = dialogue;
    ui.markDialoguesDirty();
}

export function clearActiveDialogue() {
    gameState.activeDialogue = null;
    ui.markDialoguesDirty();
}

export function increaseEssencePerClick(value) {
    gameState.essencePerClick += value;
    ui.markResourcesDirty();
}

export function increasePassiveEssencePerSecond(value) {
    gameState.passiveEssencePerSecond += value;
    ui.markResourcesDirty();
}

export function increasePassiveDarkEssencePerSecond(value) {
    gameState.passiveDarkEssencePerSecond += value;
}

export function setDarkEssenceMultiplier(value) {
    gameState.darkEssenceMultiplier = (gameState.darkEssenceMultiplier || 1) + value;
}

export function setCorruptionBonusMultiplier(value) {
    gameState.corruptionBonusMultiplier = (gameState.corruptionBonusMultiplier || 1) + value;
}

export function setActionModifier(key, value) {
    if (!gameState.actionModifiers) {
        gameState.actionModifiers = {};
    }
    gameState.actionModifiers[key] = (gameState.actionModifiers[key] || 0) + value;
}

export function setInitialInteractionCompleted(value) {
    gameState.initialInteractionCompleted = Boolean(value);
}

export function setEssenceGenerationUnlocked(value) {
    gameState.essenceGenerationUnlocked = Boolean(value);
    ui.markLilithDisplayDirty();
}

export function setActiveChoiceGroupId(id) {
    gameState.activeChoiceGroupId = id;
    ui.markUpgradeChoicesDirty();
}

export function clearActiveChoiceGroupId() {
    gameState.activeChoiceGroupId = null;
    ui.markUpgradeChoicesDirty();
}


// --- Upgrades State ---
export function setUpgradeUnlocked(upgradeId, isUnlocked) {
    const upgrade = gameState.upgradesState.find(u => u.id === upgradeId);
    if (upgrade) {
        if (upgrade.unlocked !== Boolean(isUnlocked)) {
            upgrade.unlocked = Boolean(isUnlocked);
            ui.markUpgradesDirty();
        }
    } else {
        console.warn(`stateUpdaters: Nie znaleziono ulepszenia o ID: ${upgradeId} do ustawienia 'unlocked'`);
    }
}

export function setUpgradePurchased(upgradeId, isPurchased) {
    const upgrade = gameState.upgradesState.find(u => u.id === upgradeId);
    if (upgrade) {
        if (upgrade.purchased !== Boolean(isPurchased)) {
            upgrade.purchased = Boolean(isPurchased);
            ui.markUpgradesDirty();
        }
    } else {
        console.warn(`stateUpdaters: Nie znaleziono ulepszenia o ID: ${upgradeId} do ustawienia 'purchased'`);
    }
}

// --- Research Projects State ---
export function setResearchProjectUnlocked(projectId, isUnlocked) {
    const project = gameState.researchProjectsState.find(p => p.id === projectId);
    if (project) {
        if (project.unlocked !== Boolean(isUnlocked)) {
            project.unlocked = Boolean(isUnlocked);
            ui.markResearchDirty();
        }
    } else {
        console.warn(`stateUpdaters: Nie znaleziono projektu badawczego o ID: ${projectId} do ustawienia 'unlocked'`);
    }
}

export function setResearchProjectCompleted(projectId, isCompleted) {
    const project = gameState.researchProjectsState.find(p => p.id === projectId);
    if (project) {
        if (project.isCompleted !== Boolean(isCompleted)) {
            project.isCompleted = Boolean(isCompleted);
            ui.markResearchDirty();
        }
    } else {
        console.warn(`stateUpdaters: Nie znaleziono projektu badawczego o ID: ${projectId} do ustawienia 'isCompleted'`);
    }
}

// --- Dark Rituals State ---
export function setDarkRitualCompleted(ritualId, isCompleted) {
    const ritual = gameState.darkRitualsState.find(r => r.id === ritualId);
    if (ritual) {
        if (ritual.isCompleted !== Boolean(isCompleted)) {
            ritual.isCompleted = Boolean(isCompleted);
            ui.markRitualsDirty();
        }
    } else {
        console.warn(`stateUpdaters: Nie znaleziono rytuału o ID: ${ritualId} do ustawienia 'isCompleted'`);
    }
}

// --- Choice Upgrade Groups State ---
export function setChoiceUpgradeGroupChosen(groupId, isChosen) {
    if (gameState.choiceUpgradeGroupsState && gameState.choiceUpgradeGroupsState[groupId]) {
        gameState.choiceUpgradeGroupsState[groupId].chosen = Boolean(isChosen);
        ui.markUpgradeChoicesDirty();
    } else {
        console.warn(`stateUpdaters: Nie znaleziono grupy wyboru ulepszeń o ID: ${groupId}`);
    }
}

// --- Nest Upgrades ---
export function setNestUpgrade(upgradeType, value) {
    if (gameState.nestUpgrades && gameState.nestUpgrades.hasOwnProperty(upgradeType)) {
        gameState.nestUpgrades[upgradeType] = value;
    } else {
        console.warn(`stateUpdaters: Nieprawidłowy typ ulepszenia gniazda: ${upgradeType}`);
    }
}

// --- Temptations State ---
export function setActiveTemptation(temptationId) {
    gameState.activeTemptation = temptationId;
    ui.markTemptationsDirty();
}

export function clearActiveTemptation() {
    gameState.activeTemptation = null;
    ui.markTemptationsDirty();
}

export function setActiveTemptationApprentice(temptationId) {
    gameState.activeTemptationApprentice = temptationId;
    ui.markTemptationsDirty();
}

export function clearActiveTemptationApprentice() {
    gameState.activeTemptationApprentice = null;
    ui.markTemptationsDirty();
}

export function setTemptationStateProperty(temptationId, property, value) {
    const temptation = gameState.temptationMissionsState.find(t => t.id === temptationId);
    if (temptation) {
        if (temptation.hasOwnProperty(property)) {
            temptation[property] = value;
            ui.markTemptationsDirty();
        } else {
            console.warn(`stateUpdaters: Temptation ${temptationId} nie ma właściwości ${property}`);
        }
    } else {
        console.warn(`stateUpdaters: Nie znaleziono pokusy o ID: ${temptationId}`);
    }
}


// --- Minions State ---
export function increaseMinionCount(minionType, amount) {
    if (gameState.minions && gameState.minions[minionType]) {
        gameState.minions[minionType].count = Math.max(0, (gameState.minions[minionType].count || 0) + amount);
        ui.markMinionsDirty();
    } else {
        console.warn(`stateUpdaters: Próba aktualizacji licznika dla nieistniejącego typu miniona: ${minionType}`);
    }
}


export function setMinionUnlocked(minionType, unlockedStatus) {
    if (gameState.minions && gameState.minions[minionType]) {
        gameState.minions[minionType].unlocked = Boolean(unlockedStatus);
        ui.markMinionsDirty();
    } else {
        console.warn(`stateUpdaters: Próba ustawienia statusu odblokowania dla nieistniejącego typu miniona: ${minionType}`);
    }
}

export function setEliteMinionRecruited(minionId, recruitedStatus) {
    if (gameState.eliteMinion && gameState.eliteMinion[minionId]) {
        gameState.eliteMinion[minionId].recruited = Boolean(recruitedStatus);
        ui.markMinionsDirty();
    } else {
        console.warn(`stateUpdaters: Próba ustawienia statusu rekrutacji dla nieistniejącego elitarnego miniona: ${minionId}`);
    }
}

export function setEliteMinionLevel(minionId, level) {
    if (gameState.eliteMinion && gameState.eliteMinion[minionId]) {
        gameState.eliteMinion[minionId].level = level;
        ui.markMinionsDirty();
    } else {
        console.warn(`stateUpdaters: Próba ustawienia poziomu dla nieistniejącego elitarnego miniona: ${minionId}`);
    }
}


// --- Sexual Preferences State ---
export function setSexualPreferenceUnlocked(key, isUnlocked) {
    if (gameState.sexualPreferences && gameState.sexualPreferences[key]) {
        gameState.sexualPreferences[key].unlocked = Boolean(isUnlocked);
        ui.markSexualPreferencesDirty();
    } else {
        console.warn(`stateUpdaters: Nie znaleziono preferencji seksualnej o kluczu: ${key}`);
    }
}

export function increaseSexualPreferenceLevel(key) {
    const preference = gameState.sexualPreferences[key];
    if (preference && preference.unlocked) {
        if (preference.level < preference.maxLevel) {
            preference.level = preference.level + 1;
            ui.markSexualPreferencesDirty();
        }
    } else {
        console.warn(`stateUpdaters: Nie można zwiększyć poziomu dla preferencji: ${key}. Może nie być odblokowana lub nie istnieje.`);
    }
}

export function addSexualPreferenceSubCategory(key, subCategory) {
    const preference = gameState.sexualPreferences[key];
    if (preference && preference.subCategories && !preference.subCategories.includes(subCategory)) {
        preference.subCategories = [...preference.subCategories, subCategory];
        ui.markSexualPreferencesDirty();
    } else if (preference && !preference.subCategories) {
        console.warn(`stateUpdaters: Preferencja ${key} nie ma zdefiniowanej tablicy subCategories.`);
    }
}

// --- Other specific state updaters as needed ---
export function setLastEssenceReactionThreshold(value) {
    gameState.lastEssenceReactionThreshold = value;
}

export function setLastThoughtTimestamp(value) {
    gameState.lastThoughtTimestamp = value;
}
