// === PEŁNA, POPRAWNA ZAWARTOŚĆ PLIKU: gameLogic.js ===

import * as dom from './domElements.js';
import * as ui from './uiUpdates.js';
import { gameState } from './playerState.js';
import {
    updateEssence, updateDarkEssence, updateCorruption,
    addPlayerChoiceFlag, addCompletedDialogue, addUnlockedDiaryEntry,
    setActiveDialogue, clearActiveDialogue, increaseEssencePerClick,
    increasePassiveEssencePerSecond, increasePassiveDarkEssencePerSecond,
    setDarkEssenceMultiplier, setCorruptionBonusMultiplier,
    setActionModifier, setUpgradeUnlocked, setUpgradePurchased,
    setResearchProjectCompleted, addDiscoveredLore, setDarkRitualCompleted,
    setChoiceUpgradeGroupChosen, setActiveChoiceGroupId, clearActiveChoiceGroupId,
    setTemptationStateProperty, setActiveTemptation, clearActiveTemptation,
    setActiveTemptationApprentice, clearActiveTemptationApprentice,
    setLilithBecameVocal, setResearchProjectUnlocked,
    increaseSexualPreferenceLevel
} from './stateUpdaters.js';
import { lilithStages, upgradeReactions as allUpgradeReactions, improvedStageDescriptions } from './characterProgression.js';
import { dialogues as allDialogues, diaryEntries as allDiaryEntries, temptationVisualDescriptions as allTemptationVisualDescriptions } from './narrativeElements.js';
import {
    upgrades as allUpgrades, researchProjects as allResearchProjects,
    darkRituals as allDarkRituals, choiceUpgradeGroups as allChoiceUpgradeGroups,
    temptationMissions as allTemptationMissions, eliteMinions as allEliteMinions
} from './gameSystems.js';
import { timeoutManager } from './timeoutManager.js';
import { BALANCE_MODIFIERS } from './gameConfig.js';

const gameDefinitions = {
    dialogues: allDialogues,
    upgrades: allUpgrades,
    researchProjects: allResearchProjects,
    lilithStages,
    diaryEntries: allDiaryEntries,
    temptationMissions: allTemptationMissions,
    temptationVisualDescriptions: allTemptationVisualDescriptions,
    darkRituals: allDarkRituals,
    choiceUpgradeGroups: allChoiceUpgradeGroups,
    eliteMinions: allEliteMinions,
    upgradeReactions: allUpgradeReactions,
    improvedStageDescriptions
};

let passiveGainIntervalId = null;
let vocalThoughtIntervalId = null;
const VOCAL_THOUGHT_CHANGE_INTERVAL_SECONDS = BALANCE_MODIFIERS.vocalThoughts.changeIntervalSeconds;
let vocalThoughtIntervalCounter = 0;

// POPRAWKA: Skopiowana funkcja do regulacji wysokości, aby uniknąć problemów z importem cyklicznym
function updateInteractionPanelHeight() {
    const lilithPanel = document.getElementById('lilith-card-panel');
    const interactionPanel = document.getElementById('active-interaction-section');
    if (lilithPanel && interactionPanel) {
        const lilithHeight = lilithPanel.offsetHeight;
        const targetHeight = lilithHeight * (4 / 6);
        interactionPanel.style.height = `${targetHeight}px`;
    }
}

export function stopAllIntervals() {
    if (passiveGainIntervalId) {
        clearInterval(passiveGainIntervalId);
        passiveGainIntervalId = null;
        console.log("Passive gain interval stopped.");
    }
    if (vocalThoughtIntervalId) {
        clearInterval(vocalThoughtIntervalId);
        vocalThoughtIntervalId = null;
        console.log("Vocal thought interval stopped.");
    }
}

export function generateEssence() {
    if (!gameState.essenceGenerationUnlocked) return;
    updateEssence(gameState.essencePerClick);
    if (gameState.actionModifiers.purityChance > 0 && Math.random() < gameState.actionModifiers.purityChance) {
        updateDarkEssence(Math.floor(1 * gameState.darkEssenceMultiplier));
    }
    ui.displayEssenceReaction();
    applyStageSpecificUnlocks();
    ui.markResourcesDirty();
    ui.updateDisplay();
}

export function startDialogue(dialogueId) {
    const dialogueDef = gameDefinitions.dialogues.find(item => item.id === dialogueId);
    if (!dialogueDef) return;

    if (dialogueDef.id !== 'summoning_ritual' && !gameState.initialInteractionCompleted) return;

    let totalEssenceCost = dialogueDef.essenceCost || 0;
    let totalDarkEssenceCost = dialogueDef.darkEssenceCost || 0;

    if (gameState.essence < totalEssenceCost || gameState.darkEssence < totalDarkEssenceCost) {
        ui.showCustomAlert("Brakuje zasobów, aby rozpocząć tę interakcję.");
        return;
    }

    updateEssence(-totalEssenceCost);
    updateDarkEssence(-totalDarkEssenceCost);

    main
    timeoutManager.clear('dialogueEnd');
    setActiveDialogue(dialogueDef);
    updateInteractionPanelHeight(); // Ustawiamy wysokość panelu

    // POPRAWKA: Pokaż wewnętrzny kontener, a nie całą kartę
    if (dom.interactionContentWrapperEl) {
        dom.interactionContentWrapperEl.classList.remove('hidden');
    }
    // Przewijanie do całego panelu nadal ma sens
    if (dom.activeInteractionSectionEl) {
         dom.activeInteractionSectionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    dom.dialogueTextEl.textContent = typeof dialogueDef.text === 'function' ? dialogueDef.text(gameState) : dialogueDef.text;
    dom.dialogueOptionsEl.innerHTML = '';
    dialogueDef.options.forEach(option => {
        if (option.requiresFlag && !gameState.playerChoiceFlags.includes(option.requiresFlag)) return;
        let optionDisabledByDarkEssence = false;
        if (option.darkEssenceCost && gameState.darkEssence < option.darkEssenceCost) {
            optionDisabledByDarkEssence = true;
        }
        const button = document.createElement('button');
        button.classList.add('interactive-button', 'button-primary');
        let optionText = option.text;
        if (option.darkEssenceCost) {
            optionText += ` (Koszt: ${option.darkEssenceCost} ME)`;
        }
        button.textContent = optionText;
        if (optionDisabledByDarkEssence) {
            button.disabled = true;
        } else {
            button.onclick = () => selectOption(dialogueDef.id, option.id);
        }
        dom.dialogueOptionsEl.appendChild(button);
    });
    dom.dialogueResponseEl.textContent = '';

    ui.markDialoguesDirty();
    ui.updateDisplay();
}

export function selectOption(dialogueId, optionId) {
    const dialogueDef = gameDefinitions.dialogues.find(item => item.id === dialogueId);
    if (!dialogueDef) return;
    const option = dialogueDef.options.find(o => o.id === optionId);
    if (!option) return;

    if (option.darkEssenceCost) {
        if (gameState.darkEssence < option.darkEssenceCost) {
            ui.showCustomAlert(`Potrzebujesz ${option.darkEssenceCost} Mrocznej Esencji dla tej opcji.`);
            return;
        }
        updateDarkEssence(-option.darkEssenceCost);
    }

    let corruptionGain = (typeof option.corruption === 'function' ? option.corruption(gameState) : option.corruption) || 0;
    let darkEssenceGain = (typeof option.darkEssence === 'function' ? option.darkEssence(gameState) : option.darkEssence) || 0;
    let essenceGain = (typeof option.essence === 'function' ? option.essence(gameState) : option.essence) || 0;

    if (dialogueDef.isSexual && option.sexualPreferenceTag) {
        const prefKeyRaw = option.sexualPreferenceTag.split('_')[0];
        const preference = gameState.sexualPreferences[prefKeyRaw];
        if (preference && preference.unlocked) {
            increaseSexualPreferenceLevel(prefKeyRaw);
            const bonusMultiplier = 1 + (preference.level * BALANCE_MODIFIERS.sexualPreference.bonusPerLevel);
            corruptionGain = Math.floor(corruptionGain * bonusMultiplier);
            darkEssenceGain = Math.floor(darkEssenceGain * bonusMultiplier);
            essenceGain = Math.floor(essenceGain * bonusMultiplier);
        }
    }

    updateCorruption(Math.floor(corruptionGain * gameState.corruptionBonusMultiplier));
    updateDarkEssence(Math.floor(darkEssenceGain * gameState.darkEssenceMultiplier));
    updateEssence(essenceGain);

    if (option.setsFlag) addPlayerChoiceFlag(option.setsFlag);
    if (option.setsFlagSecondary) addPlayerChoiceFlag(option.setsFlagSecondary);
    addPlayerChoiceFlag(`choice_${dialogueId}_${optionId}`);
    if (option.onSelected) option.onSelected(gameState, gameDefinitions);

    dom.dialogueResponseEl.textContent = typeof option.response === 'function' ? option.response(gameState) : option.response;
    dom.dialogueOptionsEl.innerHTML = '';
    addCompletedDialogue(dialogueId);
    if (dialogueDef.onComplete) dialogueDef.onComplete(gameState, gameDefinitions);

    if (dialogueDef.unlocksUpgradeId) {
        setUpgradeUnlocked(dialogueDef.unlocksUpgradeId, true);
    }
    if (dialogueDef.id === 'vocal_breakthrough_dialogue') {
        if (gameState.lilithBecameVocal && !gameState.firstVocalThoughtShown) {
            ui.displayInitialVocalThought();
        }
    }

    applyStageSpecificUnlocks();

    timeoutManager.set('dialogueEnd', () => {
        // POPRAWKA: Ukrywamy wewnętrzny kontener, a nie całą kartę
        if (dom.interactionContentWrapperEl) {
            dom.interactionContentWrapperEl.classList.add('hidden');
        }
        clearActiveDialogue();
        ui.updateDisplay();
    }, 60000);
}

export function applyStageSpecificUnlocks() {
    gameDefinitions.upgrades.forEach(upgDef => {
        const upgState = gameState.upgradesState.find(s => s.id === upgDef.id);
        if (upgState && !upgState.unlocked && !upgState.purchased) {
            let shouldUnlock = false;
            if (upgDef.requiredStage !== undefined && gameState.lilithStage >= upgDef.requiredStage) shouldUnlock = true;
            if (upgDef.corruptionRequired !== undefined && gameState.corruption >= upgDef.corruptionRequired) shouldUnlock = true;
            if (upgDef.initialUnlockedState) shouldUnlock = true;
            if (shouldUnlock) setUpgradeUnlocked(upgDef.id, true);
        }
    });

    gameDefinitions.researchProjects.forEach(rpDef => {
        const rpState = gameState.researchProjectsState.find(s => s.id === rpDef.id);
        if (rpState && !rpState.unlocked && !rpState.isCompleted) {
            let shouldUnlock = false;
            if (rpDef.requiredStage !== undefined && gameState.lilithStage >= rpDef.requiredStage) shouldUnlock = true;
            if (rpDef.initialUnlockedState) shouldUnlock = true;
            if (shouldUnlock) setResearchProjectUnlocked(rpDef.id, true);
        }
    });

    checkAndUnlockDiaryEntries();
}

export function checkAndUnlockDiaryEntries() {
    gameDefinitions.diaryEntries.forEach(entry => {
        if (gameState.unlockedDiaryEntryIds.includes(entry.id)) return;
        const conditions = entry.unlockConditions;
        let canUnlock = true;
        if (conditions.stageRequired !== undefined && gameState.lilithStage < conditions.stageRequired) canUnlock = false;
        if (conditions.corruptionMin !== undefined && gameState.corruption < conditions.corruptionMin) canUnlock = false;
        if (conditions.completedDialogueId && !gameState.completedDialogues.includes(conditions.completedDialogueId)) canUnlock = false;
        if (conditions.choiceMadeInDialogue) {
            const flagToCheck = `choice_${conditions.choiceMadeInDialogue.dialogueId}_${conditions.choiceMadeInDialogue.optionId}`;
            if (!gameState.playerChoiceFlags.includes(flagToCheck)) canUnlock = false;
        }
        if (conditions.requiresFlag && !gameState.playerChoiceFlags.includes(conditions.requiresFlag)) canUnlock = false;
        if (canUnlock) addUnlockedDiaryEntry(entry.id);
    });
}

export function buyUpgrade(upgradeId) {
    const upgradeDef = gameDefinitions.upgrades.find(u => u.id === upgradeId);
    const upgradeState = gameState.upgradesState.find(s => s.id === upgradeId);
    if (!upgradeDef || !upgradeState) return;
    if (!upgradeState.unlocked) return;
    if (upgradeState.purchased && upgradeDef.type !== 'choice_unlock' && upgradeDef.type !== 'minion_training' && upgradeDef.type !== 'elite_minion_recruitment') return;
    if (gameState.essence < upgradeDef.cost || (upgradeDef.darkEssenceCost && gameState.darkEssence < upgradeDef.darkEssenceCost)) return;

    updateEssence(-upgradeDef.cost);
    if (upgradeDef.darkEssenceCost) updateDarkEssence(-upgradeDef.darkEssenceCost);

    if (upgradeDef.type === 'choice_unlock') {
        const choiceGroupState = gameState.choiceUpgradeGroupsState[upgradeDef.unlocksChoiceGroupId];
        if (choiceGroupState && !choiceGroupState.chosen) {
            setActiveChoiceGroupId(upgradeDef.unlocksChoiceGroupId);
        }
    } else if (upgradeDef.type === 'minion_training' || upgradeDef.type === 'elite_minion_recruitment') {
        if (upgradeDef.onPurchase) upgradeDef.onPurchase(gameState, gameDefinitions);
        if (upgradeDef.type === 'elite_minion_recruitment') setUpgradePurchased(upgradeId, true);
    } else {
        if (upgradeDef.type === 'click_boost') increaseEssencePerClick(upgradeDef.value);
        else if (upgradeDef.type === 'passive_essence') increasePassiveEssencePerSecond(upgradeDef.value);
        else if (upgradeDef.type === 'passive_dark_essence_bonus') increasePassiveDarkEssencePerSecond(upgradeDef.value);
        else if (upgradeDef.type === 'dark_essence_multiplier') setDarkEssenceMultiplier(upgradeDef.value);
        else if (upgradeDef.type === 'dialogue_modifier' && upgradeDef.flag) {
            addPlayerChoiceFlag(upgradeDef.flag);
            ui.markDialoguesDirty();
        }
        else if (upgradeDef.type === 'action_modifier' && upgradeDef.effectKey) setActionModifier(upgradeDef.effectKey, upgradeDef.value);

        if (upgradeDef.onPurchase) upgradeDef.onPurchase(gameState, gameDefinitions);
        if (upgradeDef.type !== 'minion_training' && upgradeDef.type !== 'elite_minion_recruitment') setUpgradePurchased(upgradeId, true);
    }
    
    applyStageSpecificUnlocks();
    ui.updateDisplay();
}

export function startResearch(projectId) {
    const projectDef = gameDefinitions.researchProjects.find(p => p.id === projectId);
    const projectState = gameState.researchProjectsState.find(s => s.id === projectId);
    if (!projectDef || !projectState || projectState.isCompleted) return;
    if (gameState.essence < projectDef.cost || (projectDef.darkEssenceCost && gameState.darkEssence < projectDef.darkEssenceCost)) return;

    updateEssence(-projectDef.cost);
    if (projectDef.darkEssenceCost) updateDarkEssence(-projectDef.darkEssenceCost);
    completeResearch(projectId);
    ui.updateDisplay();
}

function completeResearch(projectId) {
    const projectDef = gameDefinitions.researchProjects.find(p => p.id === projectId);
    if (!projectDef) return;

    setResearchProjectCompleted(projectId, true);
    if (projectDef.corruptionGain) updateCorruption(projectDef.corruptionGain);
    addDiscoveredLore({ name: projectDef.name, text: projectDef.loreDrop });

    if (projectDef.onComplete) projectDef.onComplete(gameState, gameDefinitions);
    
    if (projectDef.unlocksInteractionId) ui.markDialoguesDirty();
    applyStageSpecificUnlocks();
}

export function startDarkRitual(ritualId) {
    const ritualDef = gameDefinitions.darkRituals.find(r => r.id === ritualId);
    if (!ritualDef) return;
    if (gameState.essence < ritualDef.essenceCost || gameState.darkEssence < ritualDef.darkEssenceCost) return;

    updateEssence(-ritualDef.essenceCost);
    updateDarkEssence(-ritualDef.darkEssenceCost);

    if (ritualDef.onComplete) ritualDef.onComplete(gameState, gameDefinitions);
    setDarkRitualCompleted(ritualId, true);
    
    applyStageSpecificUnlocks();
    ui.updateDisplay();
}

export function selectUpgradeChoice(groupId, choiceId) {
    const choiceGroupDef = gameDefinitions.choiceUpgradeGroups[groupId];
    if (!choiceGroupDef) return;
    const choice = choiceGroupDef.choices.find(c => c.id === choiceId);
    if (!choice) return;

    if (choice.type === 'click_boost') increaseEssencePerClick(choice.value);
    else if (choice.type === 'passive_essence') increasePassiveEssencePerSecond(choice.value);

    setChoiceUpgradeGroupChosen(groupId, true);
    const unlockingUpgradeDef = gameDefinitions.upgrades.find(u => u.type === 'choice_unlock' && u.unlocksChoiceGroupId === groupId);
    if (unlockingUpgradeDef) setUpgradePurchased(unlockingUpgradeDef.id, true);
    clearActiveChoiceGroupId();
    ui.updateDisplay();
}

export function changeAssignedMinions(temptationId, amount) {
    const temptationState = gameState.temptationMissionsState.find(t => t.id === temptationId);
    if (!temptationState) return;
    let currentAssigned = temptationState.assignedMinions || 0;
    let newAssigned = currentAssigned + amount;
    if (newAssigned < 0) newAssigned = 0;
    if (newAssigned > gameState.minions.praktykanci.count) newAssigned = gameState.minions.praktykanci.count;
    
    setTemptationStateProperty(temptationId, 'assignedMinions', newAssigned);
    ui.updateDisplay();
}

export function startTemptation(temptationId, isApprenticeMission = false) {
    const temptationDef = gameDefinitions.temptationMissions.find(t => t.id === temptationId);
    if (!temptationDef) return;
    const temptationState = gameState.temptationMissionsState.find(t => t.id === temptationId);
    if (temptationState?.isCompleted && !temptationDef.isRepeatable) return;

    if (isApprenticeMission) {
        if (gameState.activeTemptationApprentice || gameState.activeTemptation === temptationId) return;
    } else {
        if (gameState.activeTemptation || gameState.activeTemptationApprentice === temptationId) return;
    }
    if (gameState.essence < temptationDef.essenceCost || gameState.darkEssence < temptationDef.darkEssenceCost) return;

    updateEssence(-temptationDef.essenceCost);
    updateDarkEssence(-temptationDef.darkEssenceCost);
    
    if (isApprenticeMission) {
        setTemptationStateProperty(temptationId, 'isActiveApprentice', true);
        setTemptationStateProperty(temptationId, 'timeRemainingApprentice', temptationDef.durationSeconds);
        setActiveTemptationApprentice(temptationDef.id);
    } else {
        setTemptationStateProperty(temptationId, 'isActive', true);
        setTemptationStateProperty(temptationId, 'timeRemaining', temptationDef.durationSeconds);
        setActiveTemptation(temptationDef.id);
    }
    ui.updateDisplay();
}

function resolveTemptation(temptationId, isApprenticeMission = false) {
    const temptationDef = gameDefinitions.temptationMissions.find(t => t.id === temptationId);
    const temptationState = gameState.temptationMissionsState.find(t => t.id === temptationId);
    if (!temptationDef || !temptationState) return;

    if (isApprenticeMission) {
        if (!temptationState.isActiveApprentice) return;
        setTemptationStateProperty(temptationId, 'isActiveApprentice', false);
        clearActiveTemptationApprentice();
    } else {
        if (!temptationState.isActive) return;
        setTemptationStateProperty(temptationId, 'isActive', false);
        clearActiveTemptation();
    }

    let successChance = temptationDef.successChanceBase;
    if (!isApprenticeMission) {
        if (gameState.corruption > temptationDef.requiredCorruption) { 
            successChance += (gameState.corruption - temptationDef.requiredCorruption) * BALANCE_MODIFIERS.temptation.corruptionBonus; 
        }
        successChance += (temptationState.assignedMinions || 0) * BALANCE_MODIFIERS.temptation.minionBonus;
        if (gameState.playerChoiceFlags.includes('rp_suggestion_basics_unlocked')) successChance += BALANCE_MODIFIERS.temptation.suggestionBasicsBonus;
        if (gameState.playerChoiceFlags.includes('advanced_seduction_unlocked')) successChance += BALANCE_MODIFIERS.temptation.advancedSeductionBonus;
    } else {
        if (gameDefinitions.eliteMinions?.arch_succubus_apprentice) {
           successChance *= gameDefinitions.eliteMinions.arch_succubus_apprentice.temptationEffectivenessModifier;
        }
    }
    successChance = Math.min(Math.max(successChance, 0.05), 0.95);
    const success = Math.random() < successChance;
    
    if (success) {
        let { corruption: c, darkEssence: d, essence: e } = temptationDef.rewards.success;
        if (isApprenticeMission) {
            c = Math.floor(c * BALANCE_MODIFIERS.temptation.apprenticeEffectivenessReduction);
            d = Math.floor(d * BALANCE_MODIFIERS.temptation.apprenticeEffectivenessReduction);
            e = Math.floor(e * BALANCE_MODIFIERS.temptation.apprenticeEffectivenessReduction);
        }
        updateCorruption(c); updateDarkEssence(d); updateEssence(e);
        if (!temptationDef.isRepeatable) setTemptationStateProperty(temptationId, 'isCompleted', true);
    } else {
        updateCorruption(temptationDef.rewards.failure.corruption);
        updateDarkEssence(temptationDef.rewards.failure.darkEssence);
    }
    if (!isApprenticeMission) setTemptationStateProperty(temptationId, 'assignedMinions', 0);
    applyStageSpecificUnlocks();
}

export function initializePassiveGains() {
    stopAllIntervals();

    passiveGainIntervalId = setInterval(() => {
        let passiveGain = gameState.passiveEssencePerSecond;
        if (gameState.eliteMinion.apprentice.recruited && gameDefinitions.eliteMinions?.arch_succubus_apprentice) {
            passiveGain += gameDefinitions.eliteMinions.arch_succubus_apprentice.passiveEssenceGeneration;
        }
        if (passiveGain > 0) updateEssence(passiveGain);
        if (gameState.passiveDarkEssencePerSecond > 0) updateDarkEssence(gameState.passiveDarkEssencePerSecond);
        
        let changed = false;
        if (gameState.activeTemptation) {
            const temptState = gameState.temptationMissionsState.find(t => t.id === gameState.activeTemptation);
            if (temptState?.isActive) {
                const newTime = temptState.timeRemaining - 1;
                setTemptationStateProperty(gameState.activeTemptation, 'timeRemaining', newTime);
                if (newTime <= 0) resolveTemptation(gameState.activeTemptation, false);
                changed = true;
            }
        }
        if (gameState.activeTemptationApprentice) {
            const temptState = gameState.temptationMissionsState.find(t => t.id === gameState.activeTemptationApprentice);
            if (temptState?.isActiveApprentice) {
                const newTime = temptState.timeRemainingApprentice - 1;
                setTemptationStateProperty(gameState.activeTemptationApprentice, 'timeRemainingApprentice', newTime);
                if (newTime <= 0) resolveTemptation(gameState.activeTemptationApprentice, true);
                changed = true;
            }
        }
        
        if (passiveGain > 0 || gameState.passiveDarkEssencePerSecond > 0 || changed) {
            ui.markResourcesDirty();
            if(changed) ui.markTemptationsDirty();
            ui.updateDisplay();
        }
    }, 1000);

    vocalThoughtIntervalId = setInterval(() => {
        if (gameState.lilithBecameVocal && gameState.firstVocalThoughtShown) {
            vocalThoughtIntervalCounter++;
            if (vocalThoughtIntervalCounter >= VOCAL_THOUGHT_CHANGE_INTERVAL_SECONDS) {
                ui.displayRandomVocalThought();
                vocalThoughtIntervalCounter = 0;
            }
        }
    }, 1000);
}

export function initGame() {
    ui.markAllSectionsDirty();
    initializePassiveGains();
    applyStageSpecificUnlocks();
    ui.updateDisplay();
    
    if (gameState.lilithBecameVocal && !gameState.firstVocalThoughtShown) {
        ui.displayInitialVocalThought();
    }
}