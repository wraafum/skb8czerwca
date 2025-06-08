// === PEŁNA, POPRAWNA ZAWARTOŚĆ PLIKU: uiUpdates.js ===

import * as dom from './domElements.js';
import { gameState } from './playerState.js';
import { lilithStages, essenceReactions, lilithThoughts, lilithVocalThoughts, improvedStageDescriptions } from './characterProgression.js';
import { PLACEHOLDER_IMG } from './assets.js';
import { upgrades as allUpgrades, researchProjects as allResearchProjects, temptationMissions as allTemptationMissions, darkRituals as allDarkRituals, choiceUpgradeGroups, eliteMinions, isGameAreaUnlocked } from './gameSystems.js';
import { renderDiaryEntriesList, showDiaryEntry, renderAvailableDialogues } from "./ui/dialogues.js";
import { timeoutManager } from './timeoutManager.js';
import { renderUpgradeChoices, renderUpgrades, renderResearchProjects, renderDarkRituals, renderTemptations, renderMinionsArea, renderSexualPreferences } from "./ui/upgrades.js";
import { clearActiveChoiceGroupId } from './stateUpdaters.js';
import { BALANCE_MODIFIERS } from './gameConfig.js';

let lastVocalThoughtIndices = [];
const MAX_RECENT_VOCAL_THOUGHTS = BALANCE_MODIFIERS.vocalThoughts.maxRecentThoughts;
const VOCAL_THOUGHT_FADE_DURATION = BALANCE_MODIFIERS.vocalThoughts.fadeDelayMs;

let uiStateCache = {
    essence: null, darkEssence: null, passiveEssenceRate: null,
    corruption: null, essencePerClick: null, lilithNameStage: null,
    lilithImageSrc: null, lilithImageAlt: null, lilithDescription: null,
    lilithVocalThought: null, essenceGenerationUnlocked: null,
};

let dirtyFlags = {
    dialogues: true, upgrades: true, research: true, rituals: true,
    diary: true, lore: true, temptations: true, minions: true,
    sexualPreferences: true, upgradeChoices: true, lilithDisplay: true,
    resources: true, all: true
};

export function markDialoguesDirty() { dirtyFlags.dialogues = true; }
export function markUpgradesDirty() { dirtyFlags.upgrades = true; }
export function markResearchDirty() { dirtyFlags.research = true; }
export function markRitualsDirty() { dirtyFlags.rituals = true; }
export function markDiaryDirty() { dirtyFlags.diary = true; }
export function markLoreDirty() { dirtyFlags.lore = true; }
export function markTemptationsDirty() { dirtyFlags.temptations = true; }
export function markMinionsDirty() { dirtyFlags.minions = true; }
export function markSexualPreferencesDirty() { dirtyFlags.sexualPreferences = true; }
export function markUpgradeChoicesDirty() { dirtyFlags.upgradeChoices = true; }
export function markLilithDisplayDirty() { dirtyFlags.lilithDisplay = true; }
export function markResourcesDirty() { dirtyFlags.resources = true; }

export function markAllSectionsDirty() {
    for (const key in dirtyFlags) {
        dirtyFlags[key] = true;
    }
}

function clearDirtyFlags() {
    for (const key in dirtyFlags) {
        dirtyFlags[key] = false;
    }
}

function updateTextContentIfNeeded(element, newText, cacheKey) {
    if (element && uiStateCache[cacheKey] !== newText) {
        element.textContent = newText;
        uiStateCache[cacheKey] = newText;
    }
}

function updateImageIfNeeded(imgElement, newSrc, newAlt, srcCacheKey, altCacheKey) {
    if (imgElement) {
        if (uiStateCache[srcCacheKey] !== newSrc) {
            imgElement.src = newSrc;
            uiStateCache[srcCacheKey] = newSrc;
        }
        if (uiStateCache[altCacheKey] !== newAlt) {
            imgElement.alt = newAlt;
            uiStateCache[altCacheKey] = newAlt;
        }
    }
}

function updateButtonStateIfNeeded(buttonElement, unlocked, cacheKey) {
    if (buttonElement && uiStateCache[cacheKey] !== unlocked) {
        if (unlocked) {
            buttonElement.classList.remove('hidden');
            buttonElement.disabled = false;
        } else {
            buttonElement.classList.add('hidden');
            buttonElement.disabled = true;
        }
        uiStateCache[cacheKey] = unlocked;
    }
}

export function showCustomAlert(message, isTemptationNarrative = false) {
    if (dom.customAlertMessageEl) {
        dom.customAlertMessageEl.innerHTML = message;
        if (isTemptationNarrative) {
            dom.customAlertMessageEl.style.color = 'rgb(var(--color-accent))';
            dom.customAlertMessageEl.classList.add('italic');
        } else {
            dom.customAlertMessageEl.style.color = 'rgb(var(--color-text))';
            dom.customAlertMessageEl.classList.remove('italic');
        }
    }
    if (dom.customAlertModalEl) dom.customAlertModalEl.classList.remove('hidden');
}

export function hideCustomAlert() {
    if (dom.customAlertModalEl) dom.customAlertModalEl.classList.add('hidden');
}

export function displayEssenceReaction() {
    for (const reaction of essenceReactions) {
        if (gameState.essence >= reaction.threshold && gameState.lastEssenceReactionThreshold < reaction.threshold) {
            if (dom.lilithEssenceReactionEl) dom.lilithEssenceReactionEl.textContent = reaction.text;
            gameState.lastEssenceReactionThreshold = reaction.threshold;
            timeoutManager.set('essenceReaction', () => {
                if (dom.lilithEssenceReactionEl) dom.lilithEssenceReactionEl.textContent = '';
            }, 5000);
            break;
        }
    }
}

export function displayLilithThought() {
    if (gameState.lilithThoughtsOverride) {
        if (dom.lilithThoughtEl && dom.lilithThoughtEl.textContent !== gameState.lilithThoughtsOverride) {
            dom.lilithThoughtEl.textContent = gameState.lilithThoughtsOverride;
            timeoutManager.clear('lilithThought');
        }
        return;
    }

    const now = Date.now();
    if (now - gameState.lastThoughtTimestamp < BALANCE_MODIFIERS.thoughts.minIntervalMs && dom.lilithThoughtEl?.textContent !== '') return;

    const currentStageThoughts = lilithThoughts[gameState.lilithStage];
    if (!currentStageThoughts) {
        if (dom.lilithThoughtEl) dom.lilithThoughtEl.textContent = '';
        return;
    }

    const possibleThoughts = currentStageThoughts.filter(thought => {
        const stageMatch = thought.stageRequired !== undefined ? gameState.lilithStage >= thought.stageRequired : true;
        const corruptionMatch = true; // ignore corruption gating for now
        let flagMatch = thought.requiresFlag ? gameState.playerChoiceFlags.includes(thought.requiresFlag) : true;
        if (thought.requiresFlagSecondary && flagMatch) {
            flagMatch = gameState.playerChoiceFlags.includes(thought.requiresFlagSecondary);
        } else if (thought.requiresFlagSecondary && !flagMatch) {
             flagMatch = false;
        }
        const noFlagMatch = thought.requiresNoFlag ? !gameState.playerChoiceFlags.includes(thought.requiresNoFlag) : true;
        return stageMatch && corruptionMatch && flagMatch && noFlagMatch;
    });

    if (possibleThoughts.length > 0) {
        const randomThought = possibleThoughts[Math.floor(Math.random() * possibleThoughts.length)];
        if (dom.lilithThoughtEl) dom.lilithThoughtEl.textContent = randomThought.text;
        gameState.lastThoughtTimestamp = now;
        timeoutManager.set('lilithThought', () => {
            if (dom.lilithThoughtEl && dom.lilithThoughtEl.textContent === randomThought.text && !gameState.lilithThoughtsOverride) {
                dom.lilithThoughtEl.textContent = '';
            }
        }, BALANCE_MODIFIERS.thoughts.displayDurationMs);
    } else {
        if (now - gameState.lastThoughtTimestamp >= BALANCE_MODIFIERS.thoughts.minIntervalMs && dom.lilithThoughtEl) {
            dom.lilithThoughtEl.textContent = '';
        }
    }
}

export function displayInitialVocalThought() {
    if (!dom.lilithVocalThoughtDisplayEl || gameState.firstVocalThoughtShown) return;

    const initialThought = lilithVocalThoughts.find(t => t.id === 'initial_vocal_thought');
    if (initialThought) {
        dom.lilithVocalThoughtDisplayEl.textContent = initialThought.text;
        dom.lilithVocalThoughtDisplayEl.classList.toggle('italic-thought', initialThought.isItalic);
        gameState.firstVocalThoughtShown = true;
        uiStateCache.lilithVocalThought = initialThought.text;
        timeoutManager.set('vocalThoughtFade', () => {
            if (dom.lilithVocalThoughtDisplayEl && dom.lilithVocalThoughtDisplayEl.textContent === initialThought.text) {
                 dom.lilithVocalThoughtDisplayEl.textContent = '';
                 uiStateCache.lilithVocalThought = '';
            }
        }, VOCAL_THOUGHT_FADE_DURATION);
    }
}

export function displayRandomVocalThought() {
    if (!gameState.lilithBecameVocal || !dom.lilithVocalThoughtDisplayEl || !gameState.firstVocalThoughtShown) {
        if(dom.lilithVocalThoughtDisplayEl && uiStateCache.lilithVocalThought !== "") {
             dom.lilithVocalThoughtDisplayEl.textContent = "";
             uiStateCache.lilithVocalThought = "";
        }
        return;
    }

    const possibleThoughts = lilithVocalThoughts.filter(thought => {
        if (thought.id === 'initial_vocal_thought') return false;
        if (thought.stageRequired && gameState.lilithStage < thought.stageRequired) return false;
        // Corruption-based filters are disabled
        if (thought.requiresFlag && !thought.requiresFlag.every(flag => gameState.playerChoiceFlags.includes(flag))) return false;
        if (thought.requiresNoFlag && thought.requiresNoFlag.some(flag => gameState.playerChoiceFlags.includes(flag))) return false;
        if (thought.sexualPreference) {
            const pref = gameState.sexualPreferences[thought.sexualPreference.key];
            if (!pref?.unlocked || pref.level < thought.sexualPreference.level) return false;
            if (thought.sexualPreference.subCategory && !pref.subCategories?.includes(thought.sexualPreference.subCategory)) return false;
        }
        return true;
    });

    if (possibleThoughts.length === 0) return;

    let selectableThoughts = possibleThoughts.filter(t => !lastVocalThoughtIndices.includes(lilithVocalThoughts.indexOf(t)));
    if (selectableThoughts.length === 0) {
        selectableThoughts = possibleThoughts;
        lastVocalThoughtIndices = [];
    }
    
    const selectedThought = selectableThoughts[Math.floor(Math.random() * selectableThoughts.length)];
    const originalIndexOfSelected = lilithVocalThoughts.indexOf(selectedThought);

    dom.lilithVocalThoughtDisplayEl.textContent = selectedThought.text;
    dom.lilithVocalThoughtDisplayEl.classList.toggle('italic-thought', selectedThought.isItalic);
    uiStateCache.lilithVocalThought = selectedThought.text;

    if (originalIndexOfSelected !== -1) {
        lastVocalThoughtIndices.push(originalIndexOfSelected);
        if (lastVocalThoughtIndices.length > MAX_RECENT_VOCAL_THOUGHTS) lastVocalThoughtIndices.shift();
    }

    timeoutManager.set('vocalThoughtFade', () => {
        if (dom.lilithVocalThoughtDisplayEl && dom.lilithVocalThoughtDisplayEl.textContent === selectedThought.text) {
             dom.lilithVocalThoughtDisplayEl.textContent = '';
             uiStateCache.lilithVocalThought = '';
        }
    }, VOCAL_THOUGHT_FADE_DURATION);
}


function updateResourceDisplay() {
    updateTextContentIfNeeded(dom.essenceCountEl, Math.floor(gameState.essence).toString(), 'essence');
    updateTextContentIfNeeded(dom.darkEssenceCountEl, Math.floor(gameState.darkEssence).toString(), 'darkEssence');
    let currentPassiveEssence = gameState.passiveEssencePerSecond;
    if (gameState.eliteMinion.apprentice.recruited && eliteMinions.arch_succubus_apprentice) {
         currentPassiveEssence += eliteMinions.arch_succubus_apprentice.passiveEssenceGeneration;
    }
    updateTextContentIfNeeded(dom.passiveEssenceRateEl, currentPassiveEssence.toFixed(1), 'passiveEssenceRate');
    updateTextContentIfNeeded(dom.corruptionCountEl, gameState.corruption.toString(), 'corruption');
    updateTextContentIfNeeded(dom.essencePerClickEl, gameState.essencePerClick.toString(), 'essencePerClick');
}

function updateLilithDisplay() {
    const currentStageData = lilithStages[gameState.lilithStage];
    if (currentStageData) {
        const newLilithNameStage = `${gameState.lilithName || 'Sukkub'} - Etap ${currentStageData.name}`;
        updateTextContentIfNeeded(dom.lilithNameStageEl, newLilithNameStage, 'lilithNameStage');
        const newImageSrc = currentStageData.imagePath || PLACEHOLDER_IMG;
        const newImageAlt = currentStageData.name ? `${currentStageData.name} - Obraz Lilith` : 'Obraz Lilith';
        updateImageIfNeeded(dom.lilithImgTag, newImageSrc, newImageAlt, 'lilithImageSrc', 'lilithImageAlt');
        const newDescription = typeof improvedStageDescriptions[gameState.lilithStage] === 'function'
            ? improvedStageDescriptions[gameState.lilithStage](gameState)
            : (currentStageData.description || "Opis niedostępny.");
        updateTextContentIfNeeded(dom.lilithDescriptionEl, newDescription, 'lilithDescription');
    }
    updateButtonStateIfNeeded(dom.generateEssenceButton, gameState.essenceGenerationUnlocked, 'essenceGenerationUnlocked');
    displayLilithThought();
    if (gameState.lilithBecameVocal && !gameState.firstVocalThoughtShown) {
        displayInitialVocalThought();
    } else if (!gameState.lilithBecameVocal && dom.lilithVocalThoughtDisplayEl && uiStateCache.lilithVocalThought !== "") {
        dom.lilithVocalThoughtDisplayEl.textContent = "";
        uiStateCache.lilithVocalThought = "";
    }
}


export function updateDisplay() {
    if (dirtyFlags.all || dirtyFlags.resources) updateResourceDisplay();
    if (dirtyFlags.all || dirtyFlags.lilithDisplay) updateLilithDisplay();
    
    // POPRAWIONA LOGIKA WIDOCZNOŚCI PANELU INTERAKCJI
    if (dirtyFlags.all || dirtyFlags.dialogues) {
        renderAvailableDialogues();
        if (gameState.activeDialogue) {
            if (dom.interactionContentWrapperEl) dom.interactionContentWrapperEl.classList.remove('hidden');
        } else {
            if (dom.interactionContentWrapperEl) dom.interactionContentWrapperEl.classList.add('hidden');
        }
    }
    
    if (dirtyFlags.all || dirtyFlags.upgrades) renderUpgrades();
    if (dirtyFlags.all || dirtyFlags.research) renderResearchProjects();
    if (dirtyFlags.all || dirtyFlags.rituals) renderDarkRituals();
    if (dirtyFlags.all || dirtyFlags.lore) renderDiscoveredLore();
    if (dirtyFlags.all || dirtyFlags.upgradeChoices) renderUpgradeChoices();
    if (dirtyFlags.all || dirtyFlags.temptations) renderTemptations();
    if (dirtyFlags.all || dirtyFlags.minions) renderMinionsArea();
    if (dirtyFlags.all || dirtyFlags.sexualPreferences) renderSexualPreferences();
    if (dirtyFlags.all || dirtyFlags.diary) renderDiaryEntriesList();

    clearDirtyFlags();
}

export function clearAllUiTimeouts() {
    timeoutManager.clearAll();
}
