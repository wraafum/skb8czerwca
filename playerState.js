// playerState.js
import {
    upgrades as allUpgrades,
    researchProjects as allResearchProjects,
    temptationMissions as allTemptationMissions,
    darkRituals as allDarkRituals,
    choiceUpgradeGroups as allChoiceUpgradeGroups
} from './gameSystems.js';
// Usunięto import 'stopAllIntervals', ponieważ będzie on teraz wywoływany w main.js
import { setUpgradeUnlocked, setResearchProjectUnlocked } from './stateUpdaters.js'; // For initializeDefaultUnlocks

// Domyślny stan gry
function getDefaultGameState() {
    const defaultUpgradesState = JSON.parse(JSON.stringify(allUpgrades)).map(u => ({
        id: u.id,
        purchased: u.purchased || false,
        unlocked: u.unlocked || u.initialUnlockedState || false
    }));
    const defaultResearchProjectsState = JSON.parse(JSON.stringify(allResearchProjects)).map(rp => ({
        id: rp.id,
        isCompleted: rp.isCompleted || false,
        unlocked: rp.unlocked || rp.initialUnlockedState || false // Uwzględnij initialUnlockedState
    }));
    const defaultTemptationMissionsState = JSON.parse(JSON.stringify(allTemptationMissions)).map(tm => ({
        id: tm.id,
        isCompleted: tm.isCompleted || false,
        isActive: tm.isActive || false,
        timeRemaining: tm.timeRemaining || 0,
        assignedMinions: tm.assignedMinions || 0,
        isActiveApprentice: tm.isActiveApprentice || false,
        timeRemainingApprentice: tm.timeRemainingApprentice || 0
    }));
    const defaultDarkRitualsState = JSON.parse(JSON.stringify(allDarkRituals)).map(dr => ({
        id: dr.id,
        isCompleted: dr.isCompleted || false
    }));
    const defaultChoiceUpgradeGroupsState = Object.keys(allChoiceUpgradeGroups).reduce((acc, key) => {
        acc[key] = { chosen: allChoiceUpgradeGroups[key].chosen || false };
        return acc;
    }, {});

    return {
        essence: 0,
        darkEssence: 0,
        corruption: 0,
        lilithStage: 0,
        lilithName: "Sukkub",
        essencePerClick: 1,
        passiveEssencePerSecond: 0,
        passiveDarkEssencePerSecond: 0,
        corruptionBonusMultiplier: 1.0,
        darkEssenceMultiplier: 1.0,
        completedDialogues: [],
        playerChoiceFlags: [],
        unlockedDiaryEntryIds: [],
        actionModifiers: { purityChance: 0 },
        activeDialogue: null,
        lastEssenceReactionThreshold: 0,
        lastThoughtTimestamp: 0,
        essenceGenerationUnlocked: false,
        initialInteractionCompleted: false,
        activeChoiceGroupId: null,
        discoveredLore: [],
        nestUpgrades: { bed: 0, lighting: 0, altar: 0, decor_skulls: false },
        activeTemptation: null,
        activeTemptationApprentice: null,
        minions: {
            praktykanci: { count: 0, unlocked: false }
        },
        eliteMinion: {
            apprentice: { recruited: false, level: 0, name: "Uczennica Arcysukkuba" }
        },
        sexualPreferences: {
            vanilla: { unlocked: true, level: 1, maxLevel: 10, description: "Podstawowe formy intymności - pocałunki, czuły seks, romantyczne gesty" },
            bdsm: { unlocked: false, level: 0, maxLevel: 7, description: "Dominacja, uległość, związanie, kary i nagrody", subCategories: ['bondage', 'dominance', 'submission', 'pain_pleasure'] },
            exhibitionism: { unlocked: false, level: 0, maxLevel: 5, description: "Publiczne akty, ryzyko przyłapania, pokazywanie się" },
            roleplay: { unlocked: false, level: 0, maxLevel: 5, description: "Odgrywanie ról, kostiumy, fantazje" },
            corruption_play: { unlocked: false, level: 0, maxLevel: 5, description: "Deprawacja niewiniątek, korupcja czystych dusz, zakazane pragnienia" },
            popular_fetish: { unlocked: false, level: 0, maxLevel: 5, description: "Pozostałe popularne fetysze, np. sikanie, fiksacja oralna", subCategories: ['watersports', 'oral_fixation'] },
            group_dynamics: { unlocked: false, level: 0, maxLevel: 5, description: "Organy kultowe, grupowe rytuały, dzielenie się Lilith" }
        },
        upgradesState: defaultUpgradesState,
        researchProjectsState: defaultResearchProjectsState,
        temptationMissionsState: defaultTemptationMissionsState,
        darkRitualsState: defaultDarkRitualsState,
        choiceUpgradeGroupsState: defaultChoiceUpgradeGroupsState,
        lilithBecameVocal: false,
        firstVocalThoughtShown: false,
        lilithThoughtsOverride: null,
    };
}

export let gameState = getDefaultGameState();

export const GAME_SAVE_KEY = 'succubusCorruptionGameSave_v1.2';

export function saveGame() {
    try {
        const serializedState = JSON.stringify(gameState);
        localStorage.setItem(GAME_SAVE_KEY, serializedState);
        console.log("Gra zapisana!");
        return true;
    } catch (error) {
        console.error("Błąd podczas zapisywania gry:", error);
        return false;
    }
}

export function loadGame() {
    // Usunięto stąd wywołanie stopAllIntervals(), zostanie wywołane w main.js
    try {
        const serializedState = localStorage.getItem(GAME_SAVE_KEY);
        if (serializedState === null) {
            console.log("Brak zapisanego stanu gry dla klucza:", GAME_SAVE_KEY);
             // Próba migracji ze starego zapisu
            const oldSaveKey = 'succubusCorruptionGameSave_v1.1';
            const oldSerializedState = localStorage.getItem(oldSaveKey);
            if (oldSerializedState) {
                console.log(`Znaleziono starszy zapis gry (${oldSaveKey}). Próba migracji...`);
                const loadedOldGs = JSON.parse(oldSerializedState);
                const defaultStateForMigration = getDefaultGameState();
                gameState = { ...defaultStateForMigration, ...loadedOldGs }; // Połączenie stanów
                gameState.playerChoiceFlags = loadedOldGs.playerChoiceFlags || defaultStateForMigration.playerChoiceFlags;
                gameState.completedDialogues = loadedOldGs.completedDialogues || defaultStateForMigration.completedDialogues;
                localStorage.removeItem(oldSaveKey);
                console.log("Migracja zakończona. Zapisz grę, aby użyć nowego formatu.");
            } else {
                gameState = getDefaultGameState();
                initializeDefaultUnlocks();
                return false;
            }
        } else {
            const loadedGs = JSON.parse(serializedState);
            const defaultStateForLoad = getDefaultGameState();
            gameState = { ...defaultStateForLoad, ...loadedGs };
        }

        gameState.completedDialogues = gameState.completedDialogues || [];
        gameState.playerChoiceFlags = gameState.playerChoiceFlags || [];
        gameState.unlockedDiaryEntryIds = gameState.unlockedDiaryEntryIds || [];

        console.log("Gra wczytana!");
        initializeDefaultUnlocks();
        return true;
    } catch (error) {
        console.error("Błąd podczas wczytywania gry:", error);
        gameState = getDefaultGameState();
        initializeDefaultUnlocks();
        return false;
    }
}

export function resetGame() {
    // Usunięto stąd wywołanie stopAllIntervals(), zostanie wywołane w main.js
    localStorage.removeItem(GAME_SAVE_KEY);
    localStorage.removeItem('succubusCorruptionGameSave_v1.1');
    gameState = getDefaultGameState();
    initializeDefaultUnlocks();
    console.log("Gra zresetowana.");
    return true;
}


export function initializeDefaultUnlocks() {
    if (!gameState.initialInteractionCompleted) {
        const firstUpgradeState = gameState.upgradesState.find(s => s.id === 'essence_boost_1');
        if (firstUpgradeState && !firstUpgradeState.unlocked) {
            setUpgradeUnlocked('essence_boost_1', true);
        }

        const firstResearchState = gameState.researchProjectsState.find(s => s.id === 'rp_basic_essence_upgrades');
        if (firstResearchState && !firstResearchState.unlocked) {
            setResearchProjectUnlocked('rp_basic_essence_upgrades', true);
        }
    }
}
