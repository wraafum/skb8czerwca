import * as dom from '../domElements.js';
import { gameState } from '../playerState.js';
import { upgrades as allUpgrades, researchProjects as allResearchProjects, temptationMissions as allTemptationMissions, darkRituals as allDarkRituals, choiceUpgradeGroups, eliteMinions, isGameAreaUnlocked } from '../gameSystems.js';
import { clearActiveChoiceGroupId } from '../stateUpdaters.js';

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
        button.onclick = () => import('../gameLogic.js').then(logic => logic.buyUpgrade(upgradeDef.id));
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
        button.onclick = () => import('../gameLogic.js').then(logic => logic.startResearch(projectDef.id));
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
        button.onclick = () => import('../gameLogic.js').then(logic => logic.startDarkRitual(ritualDef.id));
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
            if (gameState.essence < temptationDef.essenceCost || gameState.darkEssence < temptationDef.darkEssenceCost || gameState.activeTemptation || (temptationState.isCompleted && !temptationDef.isRepeatable)) {
                lilithButton.disabled = true;
            }
            lilithButton.onclick = () => import('../gameLogic.js').then(logic => logic.startTemptation(temptationDef.id, false));
            temptationDiv.appendChild(lilithButton);
            if (gameState.eliteMinion.apprentice.recruited && !gameState.activeTemptationApprentice) {
                const apprenticeButton = document.createElement('button');
                apprenticeButton.classList.add('interactive-button', 'temptation-button-apprentice-custom', 'mt-1');
                apprenticeButton.textContent = "Rozpocznij Pokusę (Uczennica)";
                if (gameState.essence < temptationDef.essenceCost || gameState.darkEssence < temptationDef.darkEssenceCost || (temptationState.isCompleted && !temptationDef.isRepeatable)) {
                    apprenticeButton.disabled = true;
                }
                apprenticeButton.onclick = () => import('../gameLogic.js').then(logic => logic.startTemptation(temptationDef.id, true));
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
                minusButton.onclick = () => import('../gameLogic.js').then(logic => logic.changeAssignedMinions(temptationDef.id, -1));
                minionControlsDiv.appendChild(minusButton);
                const assignedCountSpan = document.createElement('span');
                assignedCountSpan.id = `assigned-minions-${temptationDef.id}`;
                assignedCountSpan.textContent = temptationState.assignedMinions || 0;
                assignedCountSpan.classList.add('mx-2', 'font-semibold');
                minionControlsDiv.appendChild(assignedCountSpan);
                const plusButton = document.createElement('button');
                plusButton.textContent = '+';
                plusButton.classList.add('interactive-button', 'minion-adjust-button');
                plusButton.onclick = () => import('../gameLogic.js').then(logic => logic.changeAssignedMinions(temptationDef.id, 1));
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
        button.textContent = 'Wybierz To Ulepszenie';
        button.onclick = () => import('../gameLogic.js').then(logic => logic.selectUpgradeChoice(gameState.activeChoiceGroupId, choice.id));
        choiceDiv.appendChild(button);
        dom.upgradeChoicesListEl.appendChild(choiceDiv);
    });
}

export { renderUpgrades, renderResearchProjects, renderDarkRituals, renderTemptations, renderMinionsArea, renderSexualPreferences, renderUpgradeChoices };
// --- Główna funkcja aktualizacji UI ---

