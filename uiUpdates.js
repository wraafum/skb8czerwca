// === PEŁNA, POPRAWNA ZAWARTOŚĆ PLIKU: uiUpdates.js ===

import * as dom from './domElements.js';
import { gameState } from './playerState.js';
import { lilithStages, essenceReactions, lilithThoughts, lilithVocalThoughts, improvedStageDescriptions } from './characterProgression.js';
import { dialogues, diaryEntries } from './narrativeElements.js';
import { upgrades as allUpgrades, researchProjects as allResearchProjects, temptationMissions as allTemptationMissions, darkRituals as allDarkRituals, choiceUpgradeGroups, eliteMinions, isGameAreaUnlocked } from './gameSystems.js';
import { timeoutManager } from './timeoutManager.js';
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
        const corruptionMatch = thought.corruption ? (gameState.corruption >= thought.corruption[0] && gameState.corruption <= thought.corruption[1]) : true;
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
        if (thought.corruptionMin && gameState.corruption < thought.corruptionMin) return false;
        if (thought.corruptionMax && gameState.corruption > thought.corruptionMax) return false;
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

function renderUpgradeChoices() {
    if (!dom.upgradeChoicesContainerEl || !dom.upgradeChoicePromptEl || !dom.upgradeChoicesListEl || !dom.upgradesListEl) return;
    if (!gameState.activeChoiceGroupId) {
        dom.upgradeChoicesContainerEl.classList.add('hidden');
        if (dom.upgradesListEl.parentElement) dom.upgradesListEl.parentElement.classList.remove('hidden');
        return;
    }
    if (dom.upgradesListEl.parentElement) dom.upgradesListEl.parentElement.classList.add('hidden');
    dom.upgradeChoicesContainerEl.classList.remove('hidden');
    const choiceGroupDef = choiceUpgradeGroups[gameState.activeChoiceGroupId];
    const choiceGroupState = gameState.choiceUpgradeGroupsState[gameState.activeChoiceGroupId];
    if (!choiceGroupDef || (choiceGroupState && choiceGroupState.chosen)) {
        clearActiveChoiceGroupId();
        renderUpgradeChoices();
        return;
    }
    dom.upgradeChoicePromptEl.textContent = choiceGroupDef.prompt;
    dom.upgradeChoicesListEl.innerHTML = '';
    choiceGroupDef.choices.forEach(choice => {
        const choiceDiv = document.createElement('div');
        choiceDiv.classList.add('upgrade-choice-item', 'mb-3', 'p-3', 'border', 'rounded-md');
        choiceDiv.style.borderColor = 'rgb(var(--color-secondary))';
        const nameEl = document.createElement('h4');
        nameEl.classList.add('text-lg', 'font-semibold', 'mb-1');
        nameEl.style.color = 'rgb(var(--color-secondary))';
        nameEl.textContent = choice.name;
        choiceDiv.appendChild(nameEl);
        const descEl = document.createElement('p');
        descEl.classList.add('text-sm', 'text-text-muted', 'mb-2');
        descEl.textContent = choice.description;
        choiceDiv.appendChild(descEl);
        const button = document.createElement('button');
        button.classList.add('interactive-button', 'button-secondary');
        button.textContent = "Wybierz To Ulepszenie";
        button.onclick = () => import('./gameLogic.js').then(logic => logic.selectUpgradeChoice(gameState.activeChoiceGroupId, choice.id));
        choiceDiv.appendChild(button);
        dom.upgradeChoicesListEl.appendChild(choiceDiv);
    });
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
        const newImageSrc = currentStageData.imagePath || 'images/lilith_placeholder.png';
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

function renderDiaryEntriesList() {
    if (!dom.diaryEntriesListEl) return;
    dom.diaryEntriesListEl.innerHTML = '';
    const sortedEntries = diaryEntries.filter(entry => gameState.unlockedDiaryEntryIds.includes(entry.id));
    sortedEntries.forEach(entry => {
        const button = document.createElement('button');
        button.classList.add('interactive-button', 'diary-entry-button-custom');
        button.textContent = entry.title;
        button.onclick = () => showDiaryEntry(entry.id);
        dom.diaryEntriesListEl.appendChild(button);
    });
}

function showDiaryEntry(entryId) {
    const entry = diaryEntries.find(e => e.id === entryId);
    if (entry && dom.diaryEntryTitleEl && dom.diaryEntryTextEl && dom.diaryEntryContentAreaEl && dom.diaryEntriesListEl) {
        dom.diaryEntryTitleEl.textContent = entry.title;
        dom.diaryEntryTextEl.textContent = entry.text;
        dom.diaryEntryContentAreaEl.classList.remove('hidden');
        dom.diaryEntriesListEl.classList.add('hidden');
    }
}

function renderAvailableDialogues() {
    if (!dom.availableDialoguesEl) return;
    dom.availableDialoguesEl.innerHTML = ''; 
    if (!gameState.initialInteractionCompleted) {
        const introDialogue = dialogues.find(d => d.id === 'summoning_ritual');
        if (introDialogue && !gameState.completedDialogues.includes('summoning_ritual')) {
            const button = document.createElement('button');
            button.classList.add('interactive-button', 'button-primary');
            button.textContent = introDialogue.title;
            button.onclick = () => import('./gameLogic.js').then(logic => logic.startDialogue(introDialogue.id));
            dom.availableDialoguesEl.appendChild(button);
        }
        return;
    }
    dialogues.filter(d => (d.isBreakingPoint || d.id === 'vocal_breakthrough_dialogue') && !gameState.completedDialogues.includes(d.id) && gameState.lilithStage >= d.stageRequired && gameState.corruption >= (d.corruptionRequired || 0) && (!d.condition || d.condition(gameState))).forEach(dialogue => {
        const button = document.createElement('button');
        button.classList.add('interactive-button', 'button-accent', 'border-2', 'border-yellow-400', 'pulse-animation');
        let titleText = `${dialogue.title}`;
        if(dialogue.isEvent || dialogue.isBreakingPoint) titleText = `🌟 ${titleText}`;
        if (dialogue.darkEssenceCost) titleText += ` (Koszt: ${dialogue.darkEssenceCost} ME)`;
        button.textContent = titleText;
        if (gameState.essence < dialogue.essenceCost || (dialogue.darkEssenceCost && gameState.darkEssence < dialogue.darkEssenceCost)) button.disabled = true;
        button.onclick = () => import('./gameLogic.js').then(logic => logic.startDialogue(dialogue.id));
        dom.availableDialoguesEl.appendChild(button);
    });
    dialogues.filter(d => !d.isBreakingPoint && d.id !== 'summoning_ritual' && d.id !== 'vocal_breakthrough_dialogue').forEach(dialogue => {
        if (gameState.completedDialogues.includes(dialogue.id) || gameState.lilithStage < dialogue.stageRequired) return;
        if (dialogue.requiresSexualPreference) {
            const pref = gameState.sexualPreferences[dialogue.requiresSexualPreference.key];
            if (!pref?.unlocked || pref.level < dialogue.requiresSexualPreference.level) return;
        }
        if (dialogue.requiresFlag && !gameState.playerChoiceFlags.includes(dialogue.requiresFlag)) return;
        if (dialogue.condition && !dialogue.condition(gameState)) return;
        const canShowAnyOption = !dialogue.options.length || dialogue.options.some(opt => !opt.requiresFlag || gameState.playerChoiceFlags.includes(opt.requiresFlag));
        if (!canShowAnyOption) return;
        const button = document.createElement('button');
        button.classList.add('interactive-button', 'button-primary');
        let titleText = dialogue.title;
        if (dialogue.isSexual) titleText = `🔞 ${titleText}`;
        if (dialogue.isEvent) titleText = `🌟 ${titleText}`;
        let costTextArr = [];
        if (dialogue.essenceCost > 0) costTextArr.push(`${dialogue.essenceCost}E`);
        if (dialogue.darkEssenceCost > 0) costTextArr.push(`${dialogue.darkEssenceCost}ME`);
        if (costTextArr.length > 0) titleText += ` (Koszt: ${costTextArr.join(', ')})`;
        else if (dialogue.essenceCost === 0 && !dialogue.darkEssenceCost) titleText += ` (Darmowe)`;
        button.textContent = titleText;
        if (gameState.essence < dialogue.essenceCost || (dialogue.darkEssenceCost && gameState.darkEssence < dialogue.darkEssenceCost)) button.disabled = true;
        button.onclick = () => import('./gameLogic.js').then(logic => logic.startDialogue(dialogue.id));
        dom.availableDialoguesEl.appendChild(button);
    });
}

function renderUpgrades() {
    if (!dom.upgradesListEl) return;
    dom.upgradesListEl.innerHTML = '';
    allUpgrades.forEach(upgradeDef => {
        const upgradeState = gameState.upgradesState.find(s => s.id === upgradeDef.id);
        if (!upgradeState) return;
        const isChoiceUnlockPending = upgradeDef.type === 'choice_unlock' && (!gameState.choiceUpgradeGroupsState[upgradeDef.unlocksChoiceGroupId] || !gameState.choiceUpgradeGroupsState[upgradeDef.unlocksChoiceGroupId].chosen);
        if (upgradeDef.id === 'train_praktykant_1' && !gameState.minions.praktykanci.unlocked) return;
        if (upgradeDef.id === 'recruit_arch_succubus_apprentice' && (!gameState.playerChoiceFlags.includes('lilith_is_arch_succubus') || gameState.eliteMinion.apprentice.recruited)) return;
        if (!upgradeState.unlocked || (upgradeState.purchased && !isChoiceUnlockPending && upgradeDef.id !== 'train_praktykant_1' && upgradeDef.id !== 'recruit_arch_succubus_apprentice')) return;
        if (upgradeDef.requiredStage && gameState.lilithStage < upgradeDef.requiredStage) return;
        if (upgradeDef.corruptionRequired && gameState.corruption < upgradeDef.corruptionRequired) return;
        const tooltipContainer = document.createElement('div');
        tooltipContainer.classList.add('tooltip-container');
        const button = document.createElement('button');
        button.classList.add('interactive-button', 'button-primary');
        let costText = `${upgradeDef.cost}E`;
        if (upgradeDef.darkEssenceCost) costText += `, ${upgradeDef.darkEssenceCost}ME`;
        button.textContent = `${upgradeDef.name} (Koszt: ${costText})`;
        if ((upgradeState.purchased && !isChoiceUnlockPending && upgradeDef.id !== 'train_praktykant_1' && upgradeDef.id !== 'recruit_arch_succubus_apprentice') || gameState.essence < upgradeDef.cost || (upgradeDef.darkEssenceCost && gameState.darkEssence < upgradeDef.darkEssenceCost)) button.disabled = true;
        button.onclick = () => import('./gameLogic.js').then(logic => logic.buyUpgrade(upgradeDef.id));
        const tooltipText = document.createElement('span');
        tooltipText.classList.add('tooltip-text');
        tooltipText.textContent = upgradeDef.description;
        tooltipContainer.appendChild(button);
        tooltipContainer.appendChild(tooltipText);
        dom.upgradesListEl.appendChild(tooltipContainer);
    });
}

function renderResearchProjects() {
    if (!dom.researchAreaEl || !dom.researchProjectsListEl) return;
    if (!isGameAreaUnlocked('research', gameState)) {
        dom.researchAreaEl.classList.add('hidden');
        return;
    }
    dom.researchAreaEl.classList.remove('hidden');
    dom.researchProjectsListEl.innerHTML = '';
    allResearchProjects.forEach(projectDef => {
        const projectState = gameState.researchProjectsState.find(s => s.id === projectDef.id);
        if (!projectState || !projectState.unlocked || projectState.isCompleted || gameState.lilithStage < projectDef.requiredStage) return;
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('research-item', 'mb-3', 'p-3', 'border', 'rounded-md');
        projectDiv.style.borderColor = 'rgba(var(--color-border-light), 0.5)';
        const nameEl = document.createElement('h4');
        nameEl.classList.add('text-lg', 'font-semibold', 'mb-1');
        nameEl.style.color = 'rgb(var(--color-primary-light))';
        nameEl.textContent = projectDef.name;
        projectDiv.appendChild(nameEl);
        const descEl = document.createElement('p');
        descEl.classList.add('text-sm', 'text-text-muted', 'mb-2');
        descEl.textContent = projectDef.description;
        projectDiv.appendChild(descEl);
        let costText = `${projectDef.cost}E`;
        if (projectDef.darkEssenceCost) costText += `, ${projectDef.darkEssenceCost}ME`;
        const costEl = document.createElement('p');
        costEl.classList.add('text-xs', 'text-text-muted', 'opacity-75', 'mb-2');
        costEl.textContent = `Koszt: ${costText}`;
        projectDiv.appendChild(costEl);
        const button = document.createElement('button');
        button.classList.add('interactive-button', 'button-secondary');
        button.textContent = "Rozpocznij Badanie";
        if (gameState.essence < projectDef.cost || (projectDef.darkEssenceCost && gameState.darkEssence < projectDef.darkEssenceCost)) button.disabled = true;
        button.onclick = () => import('./gameLogic.js').then(logic => logic.startResearch(projectDef.id));
        projectDiv.appendChild(button);
        dom.researchProjectsListEl.appendChild(projectDiv);
    });
}

function renderDiscoveredLore() {
    if (!dom.loreDropsContentEl) return;
    dom.loreDropsContentEl.innerHTML = '';
    gameState.discoveredLore.slice().reverse().forEach(lore => {
        const loreEl = document.createElement('div');
        loreEl.classList.add('lore-drop-custom', 'mb-2');
        loreEl.innerHTML = `<strong>${lore.name}:</strong> ${lore.text}`;
        dom.loreDropsContentEl.appendChild(loreEl);
    });
}

function renderDarkRituals() {
    if (!dom.ritualsAreaEl || !dom.darkRitualsListEl) return;
    if (!isGameAreaUnlocked('rituals', gameState)) {
        dom.ritualsAreaEl.classList.add('hidden');
        return;
    }
    dom.ritualsAreaEl.classList.remove('hidden');
    dom.darkRitualsListEl.innerHTML = '';
    allDarkRituals.forEach(ritualDef => {
        const ritualState = gameState.darkRitualsState.find(s => s.id === ritualDef.id);
        if (!ritualState || ritualState.isCompleted || gameState.lilithStage < ritualDef.requiredStage || (ritualDef.corruptionRequired && gameState.corruption < ritualDef.corruptionRequired)) return;
        if (ritualDef.id === 'ritual_arch_succubus_ascension' && gameState.playerChoiceFlags.includes('lilith_is_arch_succubus')) return;
        const ritualDiv = document.createElement('div');
        ritualDiv.classList.add('ritual-item', 'mb-3', 'p-3', 'border', 'rounded-md');
        ritualDiv.style.borderColor = 'rgb(var(--color-accent))';
        const nameEl = document.createElement('h4');
        nameEl.classList.add('text-lg', 'font-semibold', 'mb-1');
        nameEl.style.color = 'rgb(var(--color-accent))';
        nameEl.textContent = ritualDef.name;
        ritualDiv.appendChild(nameEl);
        const descEl = document.createElement('p');
        descEl.classList.add('text-sm', 'text-text-muted', 'mb-2');
        descEl.textContent = ritualDef.description;
        ritualDiv.appendChild(descEl);
        const effectDescEl = document.createElement('p');
        effectDescEl.classList.add('text-sm', 'italic', 'text-text-muted', 'opacity-75', 'mb-2');
        effectDescEl.textContent = `Efekt: ${ritualDef.effectDescription}`;
        ritualDiv.appendChild(effectDescEl);
        const costEl = document.createElement('p');
        costEl.classList.add('text-xs', 'text-text-muted', 'opacity-75', 'mb-2');
        costEl.textContent = `Koszt: ${ritualDef.essenceCost} Esencji, ${ritualDef.darkEssenceCost} Mrocznej Esencji`;
        ritualDiv.appendChild(costEl);
        const button = document.createElement('button');
        button.classList.add('interactive-button', 'button-accent');
        button.textContent = "Rozpocznij Rytuał";
        if (gameState.essence < ritualDef.essenceCost || gameState.darkEssence < ritualDef.darkEssenceCost) button.disabled = true;
        button.onclick = () => import('./gameLogic.js').then(logic => logic.startDarkRitual(ritualDef.id));
        ritualDiv.appendChild(button);
        dom.darkRitualsListEl.appendChild(ritualDiv);
    });
}

function renderTemptations() {
    if (!dom.temptationsAreaEl || !dom.availableTemptationsListEl || !dom.activeTemptationDisplayEl) return;
    if (!isGameAreaUnlocked('temptations', gameState)) {
        dom.temptationsAreaEl.classList.add('hidden');
        return;
    }
    dom.temptationsAreaEl.classList.remove('hidden');
    dom.availableTemptationsListEl.innerHTML = '';
    const activeTemptState = gameState.temptationMissionsState.find(t => t.id === gameState.activeTemptation);
    if (gameState.activeTemptation && activeTemptState?.isActive) {
        const activeTemptDef = allTemptationMissions.find(t => t.id === gameState.activeTemptation);
        dom.activeTemptationDisplayEl.classList.remove('hidden');
        dom.activeTemptationTextEl.textContent = `Aktywna Pokusa (Lilith): ${activeTemptDef.title}`;
        dom.activeTemptationTimerEl.textContent = `Pozostały czas: ${activeTemptState.timeRemaining}s`;
    } else {
        dom.activeTemptationDisplayEl.classList.add('hidden');
        if (dom.activeTemptationNarrativeEl) dom.activeTemptationNarrativeEl.textContent = '';
    }
    const activeApprenticeTemptState = gameState.temptationMissionsState.find(t => t.id === gameState.activeTemptationApprentice);
    if (gameState.activeTemptationApprentice && activeApprenticeTemptState?.isActiveApprentice) {
        const activeApprenticeTemptDef = allTemptationMissions.find(t => t.id === gameState.activeTemptationApprentice);
        dom.activeApprenticeTemptationDisplayEl.classList.remove('hidden');
        dom.activeApprenticeTemptationTextEl.textContent = `Aktywna Pokusa (Uczennica): ${activeApprenticeTemptDef.title}`;
        dom.activeApprenticeTemptationTimerEl.textContent = `Pozostały czas: ${activeApprenticeTemptState.timeRemainingApprentice}s`;
    } else {
        dom.activeApprenticeTemptationDisplayEl.classList.add('hidden');
        if (dom.activeApprenticeTemptationNarrativeEl) dom.activeApprenticeTemptationNarrativeEl.textContent = '';
    }
    if (gameState.activeTemptation || gameState.activeTemptationApprentice) {
        dom.availableTemptationsListEl.innerHTML = '<p class="text-center italic" style="color: rgb(var(--color-accent));">Ktoś jest obecnie zajęty kuszeniem...</p>';
    } else {
        allTemptationMissions.forEach(temptationDef => {
            const temptationState = gameState.temptationMissionsState.find(ts => ts.id === temptationDef.id) || { assignedMinions: 0, isCompleted: false };
            if ((temptationState.isCompleted && !temptationDef.isRepeatable) || gameState.lilithStage < temptationDef.requiredLilithStage || gameState.corruption < temptationDef.requiredCorruption) return;
            const temptationDiv = document.createElement('div');
            temptationDiv.classList.add('temptation-item-custom', 'mb-3', 'p-4', 'rounded-lg', 'shadow-md');
            const nameEl = document.createElement('h4');
            nameEl.classList.add('text-lg', 'font-semibold', 'mb-1');
            nameEl.style.color = 'rgb(var(--color-accent))';
            nameEl.textContent = temptationDef.title;
            temptationDiv.appendChild(nameEl);
            const descEl = document.createElement('p');
            descEl.classList.add('text-sm', 'text-text-muted', 'my-2');
            descEl.textContent = temptationDef.description;
            temptationDiv.appendChild(descEl);
            const costEl = document.createElement('p');
            costEl.classList.add('text-xs', 'text-text-muted', 'opacity-75', 'mb-2');
            costEl.textContent = `Koszt: ${temptationDef.essenceCost}E, ${temptationDef.darkEssenceCost}ME. Czas: ${temptationDef.durationSeconds}s. Szansa bazowa: ${temptationDef.successChanceBase * 100}%`;
            temptationDiv.appendChild(costEl);
            const lilithButton = document.createElement('button');
            lilithButton.classList.add('interactive-button', 'temptation-button-custom', 'mt-2');
            lilithButton.textContent = "Rozpocznij Pokusę (Lilith)";
            if (gameState.essence < temptationDef.essenceCost || gameState.darkEssence < temptationDef.darkEssenceCost || gameState.activeTemptation) {
                lilithButton.disabled = true;
            }
            lilithButton.onclick = () => import('./gameLogic.js').then(logic => logic.startTemptation(temptationDef.id, false));
            temptationDiv.appendChild(lilithButton);
            if (gameState.eliteMinion.apprentice.recruited && !gameState.activeTemptationApprentice) {
                const apprenticeButton = document.createElement('button');
                apprenticeButton.classList.add('interactive-button', 'temptation-button-apprentice-custom', 'mt-1');
                apprenticeButton.textContent = "Rozpocznij Pokusę (Uczennica)";
                if (gameState.essence < temptationDef.essenceCost || gameState.darkEssence < temptationDef.darkEssenceCost) {
                    apprenticeButton.disabled = true;
                }
                apprenticeButton.onclick = () => import('./gameLogic.js').then(logic => logic.startTemptation(temptationDef.id, true));
                temptationDiv.appendChild(apprenticeButton);
            }
            if (gameState.minions.praktykanci.unlocked && gameState.minions.praktykanci.count > 0) {
                const minionControlsDiv = document.createElement('div');
                minionControlsDiv.classList.add('minion-assignment-controls', 'my-2', 'flex', 'items-center', 'justify-center');
                const assignLabel = document.createElement('span');
                assignLabel.textContent = 'Przypisz Praktykantów (Bonus dla Lilith): ';
                assignLabel.classList.add('mr-2', 'text-sm');
                minionControlsDiv.appendChild(assignLabel);
                const minusButton = document.createElement('button');
                minusButton.textContent = '-';
                minusButton.classList.add('interactive-button', 'minion-adjust-button');
                minusButton.onclick = () => import('./gameLogic.js').then(logic => logic.changeAssignedMinions(temptationDef.id, -1));
                minionControlsDiv.appendChild(minusButton);
                const assignedCountSpan = document.createElement('span');
                assignedCountSpan.id = `assigned-minions-${temptationDef.id}`;
                assignedCountSpan.textContent = temptationState.assignedMinions || 0;
                assignedCountSpan.classList.add('mx-2', 'font-semibold');
                minionControlsDiv.appendChild(assignedCountSpan);
                const plusButton = document.createElement('button');
                plusButton.textContent = '+';
                plusButton.classList.add('interactive-button', 'minion-adjust-button');
                plusButton.onclick = () => import('./gameLogic.js').then(logic => logic.changeAssignedMinions(temptationDef.id, 1));
                minionControlsDiv.appendChild(plusButton);
                temptationDiv.appendChild(minionControlsDiv);
            }
            dom.availableTemptationsListEl.appendChild(temptationDiv);
        });
    }
}

function renderMinionsArea() {
    if (!dom.minionsAreaEl) return;
    if (!isGameAreaUnlocked('minions', gameState)) {
        dom.minionsAreaEl.classList.add('hidden');
        return;
    }
    dom.minionsAreaEl.classList.remove('hidden');
    dom.praktykanciCountEl.textContent = gameState.minions.praktykanci.count;
    if (gameState.eliteMinion.apprentice.recruited) {
        dom.eliteApprenticeDisplayEl.classList.remove('hidden');
        dom.eliteApprenticeStatusEl.textContent = `Zrekrutowano (Poziom ${gameState.eliteMinion.apprentice.level})`;
    } else {
        dom.eliteApprenticeDisplayEl.classList.add('hidden');
    }
    dom.minionActionsListEl.innerHTML = '';
}

function renderSexualPreferences() {
    if (!dom.sexualPreferencesListEl) return;
    if (!isGameAreaUnlocked('preferences', gameState)) {
        if (dom.preferencesAreaEl) dom.preferencesAreaEl.classList.add('hidden');
        return;
    }
    if (dom.preferencesAreaEl) dom.preferencesAreaEl.classList.remove('hidden');
    dom.sexualPreferencesListEl.innerHTML = '';
    for (const key in gameState.sexualPreferences) {
        const pref = gameState.sexualPreferences[key];
        if (pref.unlocked) {
            const prefDiv = document.createElement('div');
            prefDiv.classList.add('preference-item-custom');
            const nameEl = document.createElement('strong');
            nameEl.textContent = `${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}: `;
            prefDiv.appendChild(nameEl);
            const levelEl = document.createElement('span');
            levelEl.textContent = `Poziom ${pref.level}/${pref.maxLevel}`;
            prefDiv.appendChild(levelEl);
            const descEl = document.createElement('p');
            descEl.classList.add('text-xs', 'italic', 'description-text');
            descEl.textContent = pref.description;
            prefDiv.appendChild(descEl);
            const levelBarContainer = document.createElement('div');
            levelBarContainer.classList.add('level-bar-container');
            const levelBar = document.createElement('div');
            levelBar.classList.add('level-bar');
            levelBar.style.width = `${(pref.level / pref.maxLevel) * 100}%`;
            levelBarContainer.appendChild(levelBar);
            prefDiv.appendChild(levelBarContainer);
            dom.sexualPreferencesListEl.appendChild(prefDiv);
        }
    }
}

// --- Główna funkcja aktualizacji UI ---
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