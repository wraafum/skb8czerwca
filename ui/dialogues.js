import * as dom from '../domElements.js';
import { gameState } from '../playerState.js';
import { dialogues, diaryEntries } from '../narrativeElements.js';

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
            button.onclick = () => import('../gameLogic.js').then(logic => logic.startDialogue(introDialogue.id));
            dom.availableDialoguesEl.appendChild(button);
        }
        return;
    }
    dialogues.filter(d => (d.isBreakingPoint || d.id === 'vocal_breakthrough_dialogue') && !gameState.completedDialogues.includes(d.id) && gameState.lilithStage >= d.stageRequired && (!d.condition || d.condition(gameState))).forEach(dialogue => {
        const button = document.createElement('button');
        button.classList.add('interactive-button', 'button-accent', 'border-2', 'border-yellow-400', 'pulse-animation');
        if (dialogue.imagePath) {
            const img = document.createElement('img');
            img.src = dialogue.imagePath;
            img.alt = dialogue.title;
            img.classList.add('dialogue-icon');
            button.appendChild(img);
        }
        let titleText = `${dialogue.title}`;
        if(dialogue.isEvent || dialogue.isBreakingPoint) titleText = `🌟 ${titleText}`;
        if (dialogue.darkEssenceCost) titleText += ` (Koszt: ${dialogue.darkEssenceCost} ME)`;
        button.textContent = titleText;
        if (gameState.essence < dialogue.essenceCost || (dialogue.darkEssenceCost && gameState.darkEssence < dialogue.darkEssenceCost)) button.disabled = true;
        button.onclick = () => import('../gameLogic.js').then(logic => logic.startDialogue(dialogue.id));
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
        if (dialogue.imagePath) {
            const img = document.createElement('img');
            img.src = dialogue.imagePath;
            img.alt = dialogue.title;
            img.classList.add('dialogue-icon');
            button.appendChild(img);
        }
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
        button.onclick = () => import('../gameLogic.js').then(logic => logic.startDialogue(dialogue.id));
    dom.availableDialoguesEl.appendChild(button);
    });
}

export { renderDiaryEntriesList, showDiaryEntry, renderAvailableDialogues };


