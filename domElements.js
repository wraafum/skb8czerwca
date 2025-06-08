// domElements.js

// Elementy DOM dla zasobów i statystyk
export const essenceCountEl = document.getElementById('essence-count');
export const darkEssenceCountEl = document.getElementById('dark-essence-count');
export const passiveEssenceRateEl = document.getElementById('passive-essence-rate');
export const passiveDarkEssenceRateEl = document.getElementById('passive-dark-essence-rate');
export const corruptionCountEl = document.getElementById('corruption-count');
export const essencePerClickEl = document.getElementById('essence-per-click');

// Elementy DOM dla Lilith
export const lilithNameStageEl = document.getElementById('lilith-name-stage');
export const lilithImageEl = document.getElementById('lilith-image');
export const lilithDescriptionEl = document.getElementById('lilith-description');
export const lilithEssenceReactionEl = document.getElementById('lilith-essence-reaction');
export const lilithUpgradeReactionEl = document.getElementById('lilith-upgrade-reaction');
export const lilithThoughtEl = document.getElementById('lilith-thought');

// Przyciski
export const generateEssenceButton = document.getElementById('generate-essence-button');
export const saveGameButton = document.getElementById('save-game-button');
export const loadGameButton = document.getElementById('load-game-button');
export const resetGameButton = document.getElementById('reset-game-button');

// NOWE: Przyciski testowe
export const cheatEssenceButton = document.getElementById('cheat-essence-button');
export const cheatDarkEssenceButton = document.getElementById('cheat-dark-essence-button');
export const cheatCorruptionButton = document.getElementById('cheat-corruption-button');

// Elementy DOM dla dialogów - ZMIENIONE: Rozdzielenie na listę i aktywną interakcję
export const dialogueSectionEl = document.getElementById('dialogue-section');
export const availableDialoguesEl = document.getElementById('available-dialogues');

// NOWE: Elementy dla aktywnej interakcji (oddzielone od listy)
export const activeInteractionSectionEl = document.getElementById('active-interaction-section');
export const currentDialogueAreaEl = document.getElementById('current-dialogue-area');
export const dialogueTextEl = document.getElementById('dialogue-text');
export const dialogueOptionsEl = document.getElementById('dialogue-options');
export const dialogueResponseEl = document.getElementById('dialogue-response');

// Elementy DOM dla ulepszeń
export const upgradesSectionEl = document.getElementById('upgrades-section');
export const upgradesListEl = document.getElementById('upgrades-list');
export const upgradeChoicesContainerEl = document.getElementById('upgrade-choices-container');
export const upgradeChoicePromptEl = document.getElementById('upgrade-choice-prompt');
export const upgradeChoicesListEl = document.getElementById('upgrade-choices-list');

// Elementy DOM dla badań
export const researchAreaEl = document.getElementById('research-area');
export const researchProjectsListEl = document.getElementById('research-projects-list');
export const loreDropsDisplayEl = document.getElementById('lore-drops-display');
export const loreDropsContentEl = document.getElementById('lore-drops-content');

// Elementy DOM dla pamiętnika
export const diaryContainerEl = document.getElementById('diary-container');
export const diaryEntriesListEl = document.getElementById('diary-entries-list');
export const diaryEntryContentAreaEl = document.getElementById('diary-entry-content-area-custom');
export const diaryEntryTitleEl = document.getElementById('diary-entry-title-custom');
export const diaryEntryTextEl = document.getElementById('diary-entry-text');
export const closeDiaryEntryButton = document.getElementById('close-diary-entry-button');

// Elementy DOM dla rytuałów
export const ritualsAreaEl = document.getElementById('rituals-area');
export const darkRitualsListEl = document.getElementById('dark-rituals-list');

// Elementy DOM dla pokus
export const temptationsAreaEl = document.getElementById('temptations-area');
export const availableTemptationsListEl = document.getElementById('available-temptations-list');
export const activeTemptationDisplayEl = document.getElementById('active-temptation-display-custom');
export const activeTemptationTextEl = document.getElementById('active-temptation-text');
export const activeTemptationTimerEl = document.getElementById('active-temptation-timer');
export const activeTemptationNarrativeEl = document.getElementById('active-temptation-narrative-custom');
export const activeApprenticeTemptationDisplayEl = document.getElementById('active-apprentice-temptation-display-custom');
export const activeApprenticeTemptationTextEl = document.getElementById('active-apprentice-temptation-text');
export const activeApprenticeTemptationTimerEl = document.getElementById('active-apprentice-temptation-timer');
export const activeApprenticeTemptationNarrativeEl = document.getElementById('active-apprentice-temptation-narrative-custom');


// Elementy DOM dla sług
export const minionsAreaEl = document.getElementById('minions-area');
export const praktykanciCountEl = document.getElementById('praktykanci-count');
export const eliteApprenticeDisplayEl = document.getElementById('elite-apprentice-display');
export const eliteApprenticeStatusEl = document.getElementById('elite-apprentice-status');
export const minionActionsListEl = document.getElementById('minion-actions-list');

// Elementy DOM dla preferencji seksualnych
export const preferencesAreaEl = document.getElementById('preferences-area');
export const sexualPreferencesListEl = document.getElementById('sexual-preferences-list');

// Modal
export const customAlertModalEl = document.getElementById('custom-alert-modal');
export const customAlertMessageEl = document.getElementById('custom-alert-message');
export const customAlertCloseButtonEl = document.getElementById('custom-alert-close-button');

// ZMIANA: Zamiast odwoływać się do diva jako miejsca na obraz, będziemy teraz mieli bezpośrednie odwołanie do tagu <img>
export const lilithImageContainerEl = document.getElementById('lilith-image'); // Kontener (div) zostaje, jeśli chcesz zachować jego style (np. tło, animacje)
export const lilithImgTag = document.getElementById('lilith-img-tag');      // NOWE: Odwołanie do tagu <img>

// NOWE: Element dla głośnych myśli Lilith
export const lilithVocalThoughtDisplayEl = document.getElementById('lilith-vocal-thought-display');

export const diaryToggleIcon = document.getElementById('diary-toggle-icon');
export const interactionContentWrapperEl = document.getElementById('interaction-content-wrapper');
