// main.js
import * as dom from './domElements.js';
import { saveGame, loadGame, resetGame, GAME_SAVE_KEY } from './playerState.js';
// POPRAWKA: Zaimportowano funkcje czyszczące interwały i timeouty
import { initGame, generateEssence, stopAllIntervals } from './gameLogic.js';
import { showCustomAlert, hideCustomAlert, updateDisplay, clearAllUiTimeouts } from './uiUpdates.js';
// NOWE: Import funkcji aktualizujących zasoby dla przycisków testowych
import { updateEssence, updateDarkEssence, updateCorruption } from './stateUpdaters.js';

import { validateUpgradeConfig, validateResearchConfig, validateTemptationConfig } from './gameConfig.js';
import { upgrades, researchProjects, temptationMissions } from './gameSystems.js';
=======
// Import definicji i walidatorów konfiguracji
import { upgrades, researchProjects, temptationMissions } from './gameSystems.js';
import { validateUpgradeConfig, validateResearchConfig, validateTemptationConfig } from './gameConfig.js';

// Validate configuration consistency
const upgradesValid = validateUpgradeConfig(upgrades.map(u => u.id));
const researchValid = validateResearchConfig(researchProjects.map(rp => rp.id));
const temptationsValid = validateTemptationConfig(temptationMissions.map(t => t.id));
if (!upgradesValid || !researchValid || !temptationsValid) {
    console.warn('Detected configuration issues with game data.');
    if (typeof showCustomAlert === 'function') {
        showCustomAlert('Wykryto problemy z konfiguracją. Sprawdź konsolę.');
    }
}

// =======================================================
// NOWA FUNKCJA DO REGULACJI WYSOKOŚCI PANELU
// =======================================================
function updateInteractionPanelHeight() {
    // Pobieramy odwołania do panelu Lilith i panelu interakcji
    const lilithPanel = document.getElementById('lilith-card-panel');
    const interactionPanel = document.getElementById('active-interaction-section');

    // Sprawdzamy, czy oba elementy istnieją w DOM
    if (lilithPanel && interactionPanel) {
        // Pobieramy aktualną wysokość panelu Lilith w pikselach
        const lilithHeight = lilithPanel.offsetHeight;
        // Obliczamy 4/6 tej wysokości
        const targetHeight = lilithHeight * (4 / 6);
        // Ustawiamy wysokość panelu interakcji, dodając 'px'
        interactionPanel.style.height = `${targetHeight}px`;
    }
}


// Inicjalizacja gry
document.addEventListener('DOMContentLoaded', () => {
    // Podpięcie event listenerów do przycisków zapisu/odczytu
    updateInteractionPanelHeight();
    window.addEventListener('resize', updateInteractionPanelHeight);
    validateUpgradeConfig(upgrades.map(u => u.id));
    validateResearchConfig(researchProjects.map(r => r.id));
    validateTemptationConfig(temptationMissions.map(t => t.id));
    if(dom.saveGameButton) {
        dom.saveGameButton.onclick = () => {
            if (saveGame()) {
                showCustomAlert("Gra została pomyślnie zapisana!");
            } else {
                showCustomAlert("Wystąpił błąd podczas zapisywania gry.");
            }
        };
    }

    if(dom.loadGameButton) {
        dom.loadGameButton.onclick = () => {
            // POPRAWKA: Pełne czyszczenie przed wczytaniem stanu
            stopAllIntervals();
            clearAllUiTimeouts();

            if (loadGame()) {
                initGame(); // Ponowna inicjalizacja logiki gry po wczytaniu nowego stanu
                showCustomAlert("Gra została pomyślnie wczytana!");
            } else {
                showCustomAlert("Nie znaleziono zapisu gry lub wystąpił błąd.");
            }
        };
    }
    
    if(dom.resetGameButton) {
        dom.resetGameButton.onclick = () => {
            // Użycie natywnego confirm jest proste, ale blokuje wątek. W przyszłości można rozważyć własny modal.
            const confirmed = confirm("Czy na pewno chcesz zresetować grę? Cały postęp zostanie utracony.");
            if (confirmed) {
                // POPRAWKA: Pełne czyszczenie przed resetem stanu
                stopAllIntervals();
                clearAllUiTimeouts();

                if (resetGame()) {
                    initGame(); // Ponowna inicjalizacja logiki gry po resecie
                    showCustomAlert("Gra została zresetowana.");
                }
            }
        };
    }

    // Podpięcie pozostałych event listenerów
    // ZMIANA: Usunięto przycisk, teraz klikamy w obrazek Lilith
    if(dom.lilithImgTag) {
        dom.lilithImgTag.onclick = generateEssence;
    }

    // NOWE: Logika do przełączania widoczności listy wpisów w pamiętniku
    if(dom.diaryToggleIcon) {
        dom.diaryToggleIcon.onclick = () => {
            if (dom.diaryEntriesListEl) {
                dom.diaryEntriesListEl.classList.toggle('hidden');
                // Opcjonalnie: ukryj otwarty wpis, jeśli zamykamy listę
                if (dom.diaryEntryContentAreaEl && !dom.diaryEntryContentAreaEl.classList.contains('hidden')) {
                    dom.diaryEntryContentAreaEl.classList.add('hidden');
                }
            }
        };
    }

    // NOWE: Podpięcie przycisków testowych (przeniesione dla porządku)
    if(dom.cheatEssenceButton) {
        dom.cheatEssenceButton.onclick = () => {
            updateEssence(10000);
            showCustomAlert("Dodano 10000 Esencji!");
            updateDisplay();
        };
    }

    if(dom.cheatDarkEssenceButton) {
        dom.cheatDarkEssenceButton.onclick = () => {
            updateDarkEssence(10000);
            showCustomAlert("Dodano 10000 Mrocznej Esencji!");
            updateDisplay();
        };
    }

    if(dom.cheatCorruptionButton) {
        dom.cheatCorruptionButton.onclick = () => {
            updateCorruption(10000);
            showCustomAlert("Dodano 10000 Korupcji!");
            updateDisplay();
        };
    }

    if(dom.customAlertCloseButtonEl) {
        dom.customAlertCloseButtonEl.onclick = hideCustomAlert;
    }
    
    if(dom.closeDiaryEntryButton) {
        dom.closeDiaryEntryButton.onclick = () => {
            if (dom.diaryEntryContentAreaEl && dom.diaryEntriesListEl) {
                dom.diaryEntryContentAreaEl.classList.add('hidden');
                dom.diaryEntriesListEl.classList.remove('hidden');
            }
        };
    }
    
    // Automatyczne ładowanie gry przy starcie, jeśli istnieje zapis
    if (localStorage.getItem(GAME_SAVE_KEY)) {
        if (loadGame()) { 
            console.log("Automatycznie wczytano zapisany stan gry.");
        } else {
            console.log("Nie udało się automatycznie wczytać zapisu, startuję nową grę.");
        }
    }

    initGame(); // Główna funkcja inicjalizująca logikę gry i UI
});