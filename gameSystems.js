// gameSystems.js
// Definicje mechanik i systemów gry.

// Import state updaters
import {
    addPlayerChoiceFlag,
    updateCorruption,
    updateDarkEssence, // For nest_decor_skulls
    setNestUpgrade,
    increasePassiveDarkEssencePerSecond,
    setCorruptionBonusMultiplier,
    setMinionUnlocked,
    increaseMinionCount,
    setEliteMinionRecruited,
    setEliteMinionLevel,
    setUpgradeUnlocked, // For onComplete in research
    setResearchProjectUnlocked, // Added missing import
    setLilithStage      // For ritual_arch_succubus_ascension
    // Import other updaters as needed
} from './stateUpdaters.js';
import * as ui from './uiUpdates.js'; // For ritual_arch_succubus_ascension UI updates

// NOWE: Import centralized balancing configuration
import {
    UPGRADE_COSTS,
    UPGRADE_VALUES,
    RESEARCH_COSTS,
    RESEARCH_REWARDS,
    RITUAL_COSTS,
    RITUAL_REWARDS,
    TEMPTATION_COSTS,
    TEMPTATION_DURATIONS,
    TEMPTATION_SUCCESS_RATES,
    TEMPTATION_REWARDS,
    TEMPTATION_REQUIREMENTS,
    NEST_UPGRADE_REWARDS,
    CHOICE_UPGRADE_VALUES,
    ELITE_MINION_STATS,
    BALANCE_MODIFIERS
} from './gameConfig.js';

// NOWE: Centralized unlock conditions for game areas
export const gameAreaUnlocks = {
    research: {
        requiredStage: 0,
        requiredFlags: ['initial_interaction_completed'],
        description: "Badania nad Naturą Sukkubów"
    },
    rituals: {
        requiredStage: 3,
        requiredFlags: ['initial_interaction_completed'],
        description: "Mroczne Rytuały"
    },
    temptations: {
        requiredStage: 2,
        requiredFlags: ['system_temptations_unlocked'],
        description: "System Pokus"
    },
    minions: {
        requiredStage: 5,
        requiredFlags: ['minions_praktykanci_unlocked'],
        alternativeCondition: (gameState) => {
            // Show if either praktykanci are unlocked OR elite apprentice is recruited
            return gameState.minions?.praktykanci?.unlocked || gameState.eliteMinion?.apprentice?.recruited;
        },
        description: "Twoi Słudzy"
    },
    preferences: {
        requiredStage: 0,
        requiredFlags: ['initial_interaction_completed'],
        description: "Preferencje Seksualne Lilith"
    },
    diary: {
        requiredStage: 0,
        description: "Pamiętnik Lilith"
    }
};

// Helper function to check if a game area should be unlocked
export function isGameAreaUnlocked(areaId, gameState) {
    const unlockConditions = gameAreaUnlocks[areaId];
    if (!unlockConditions) {
        console.warn(`No unlock conditions defined for game area: ${areaId}`);
        return true; // Default to unlocked if no conditions defined
    }

    // Check stage requirement
    if (unlockConditions.requiredStage !== undefined && gameState.lilithStage < unlockConditions.requiredStage) {
        return false;
    }

    // Check corruption requirement (if defined)
    if (unlockConditions.requiredCorruption !== undefined && gameState.corruption < unlockConditions.requiredCorruption) {
        return false;
    }

    // Check required flags
    if (unlockConditions.requiredFlags) {
        for (const flag of unlockConditions.requiredFlags) {
            if (flag === 'initial_interaction_completed' && !gameState.initialInteractionCompleted) {
                return false;
            } else if (flag !== 'initial_interaction_completed' && !gameState.playerChoiceFlags.includes(flag)) {
                return false;
            }
        }
    }

    // Check alternative condition (if defined)
    if (unlockConditions.alternativeCondition) {
        return unlockConditions.alternativeCondition(gameState);
    }

    return true;
}

export const upgrades = [
    // --- WCZESNA GRA - Zmodyfikowane ulepszenia ---
    {
        id: 'essence_boost_1',
        name: 'Szepty Pokusy', 
        cost: UPGRADE_COSTS.essence_boost_1.essence,
        darkEssenceCost: UPGRADE_COSTS.essence_boost_1.darkEssence || undefined,
        description: 'Lilith uczy się subtelnie wpływać na Twoje myśli, delikatnie zwiększając przypływ Esencji przy każdym Twoim skupieniu (kliknięciu). (+1 Esencja/klik)', 
        type: 'click_boost',
        value: UPGRADE_VALUES.essence_boost_1,
        purchased: false, 
        unlocked: false, 
        initialUnlockedState: true 
    },
    {
        id: 'passive_essence_1',
        name: 'Ponętny Widok', 
        cost: UPGRADE_COSTS.passive_essence_1.essence,
        darkEssenceCost: UPGRADE_COSTS.passive_essence_1.darkEssence || undefined,
        description: 'Sama obecność i widok Lilith staje się źródłem inspiracji... i Esencji. (Generuje 0.5 Esencji na sekundę).', 
        type: 'passive_essence',
        value: UPGRADE_VALUES.passive_essence_1,
        purchased: false,
        unlocked: false,
        initialUnlockedState: false, 
        requiredStage: 0, 
    },
    {
        id: 'purity_chance_1',
        name: 'Alchemia Pożądania', 
        cost: UPGRADE_COSTS.purity_chance_1.essence,
        darkEssenceCost: UPGRADE_COSTS.purity_chance_1.darkEssence || undefined,
        description: 'Twoje skupienie na Esencji, w połączeniu z aurą Lilith, pozwala transmutować część czystej energii w Mroczną Esencję. (Kliknięcia Esencji mają 10% szansy dać 1 Mroczną Esencję).', 
        type: 'action_modifier',
        effectKey: 'purityChance',
        value: UPGRADE_VALUES.purity_chance_1,
        purchased: false,
        unlocked: false,
        initialUnlockedState: false,
        requiredStage: 1,
    },
    {
        id: 'charm_scroll_1',
        name: 'Sztuka Subtelnej Perswazji', 
        cost: UPGRADE_COSTS.charm_scroll_1.essence,
        darkEssenceCost: UPGRADE_COSTS.charm_scroll_1.darkEssence || undefined,
        description: 'Lilith dzieli się podstawami demonicznej perswazji, co zwiększa efektywność niektórych opcji dialogowych. (Odblokowuje specjalne interakcje lub wzmacnia istniejące).', 
        type: 'dialogue_modifier',
        flag: 'hasCharmScroll', 
        purchased: false,
        unlocked: false,
        initialUnlockedState: false,
        requiredStage: 1,
    },
    {
        id: 'essence_boost_2',
        name: 'Wzmożone Pragnienie',
        cost: UPGRADE_COSTS.essence_boost_2.essence,
        darkEssenceCost: UPGRADE_COSTS.essence_boost_2.darkEssence || undefined,
        description: 'Wasza więź się zacieśnia, a pragnienie Lilith intensyfikuje Twoją zdolność do generowania Esencji. (+5 Esencji/klik)',
        type: 'click_boost',
        value: UPGRADE_VALUES.essence_boost_2, 
        purchased: false, 
        unlocked: false, 
        initialUnlockedState: false, 
        requiredStage: 2
    },
    {
        id: 'passive_essence_2',
        name: 'Ołtarz Rozkoszy',
        cost: UPGRADE_COSTS.passive_essence_2.essence,
        darkEssenceCost: UPGRADE_COSTS.passive_essence_2.darkEssence || undefined,
        description: 'Ołtarz, teraz nasycony waszą wspólną energią i wspomnieniami, emanuje potężnym strumieniem Esencji. (Generuje 5 Esencji na sekundę).',
        type: 'passive_essence',
        value: UPGRADE_VALUES.passive_essence_2, 
        purchased: false, 
        unlocked: false, 
        initialUnlockedState: false, 
        requiredStage: 3
    },
    {
        id: 'essence_mastery_choice_unlock',
        name: "Rozdroża Mistrzostwa Esencji",
        cost: UPGRADE_COSTS.essence_mastery_choice_unlock.essence,
        darkEssenceCost: UPGRADE_COSTS.essence_mastery_choice_unlock.darkEssence || undefined,
        description: "Osiągnąłeś punkt, w którym musisz zdecydować, jak dalej rozwijać swoje mistrzostwo nad esencją – czy skupić się na intensywnym, aktywnym pozyskiwaniu, czy na stałym, pasywnym przepływie.",
        type: 'choice_unlock',
        unlocksChoiceGroupId: 'essence_mastery_1',
        purchased: false, unlocked: false, initialUnlockedState: false, requiredStage: 2
    },
    {
        id: 'nest_bed_upgrade_1',
        name: 'Wygodniejsze Gniazdko dla Lilith',
        cost: UPGRADE_COSTS.nest_bed_upgrade_1.essence,
        darkEssenceCost: UPGRADE_COSTS.nest_bed_upgrade_1.darkEssence,
        description: 'Bardziej komfortowe i intymne posłanie dla Lilith. Może poprawi jej nastrój i uczyni ją bardziej... otwartą na Twoje sugestie? (+10 Korupcji jednorazowo, odblokowuje nowe myśli/reakcje).',
        type: 'nest_upgrade',
        onPurchase: (gs) => { 
            setNestUpgrade('bed', 1); 
            updateCorruption(NEST_UPGRADE_REWARDS.nest_bed_upgrade_1.corruption); 
            addPlayerChoiceFlag('nest_bed_1_purchased'); 
        },
        purchased: false, 
        unlocked: false, 
        initialUnlockedState: false, 
        requiredStage: 1 
    },
    {
        id: 'nest_dark_altar_1',
        name: 'Ołtarz Szeptów Otchłani',
        cost: UPGRADE_COSTS.nest_dark_altar_1.essence,
        darkEssenceCost: UPGRADE_COSTS.nest_dark_altar_1.darkEssence,
        description: 'Prosty ołtarz poświęcony mrocznym mocom, teraz rezonujący z szeptami z Otchłani. Powinien zwiększyć pasywny napływ Mrocznej Esencji i... zainspirować Lilith. (+0.2 ME/s, +15 Korupcji).',
        type: 'passive_dark_essence_bonus', // This type implies its value directly affects passiveDarkEssencePerSecond
        value: UPGRADE_VALUES.nest_dark_altar_1, // The amount to increase passiveDarkEssencePerSecond by
        onPurchase: (gs) => { 
            setNestUpgrade('altar', 1); 
            updateCorruption(NEST_UPGRADE_REWARDS.nest_dark_altar_1.corruption); 
            addPlayerChoiceFlag('nest_dark_altar_1_purchased'); 
            // The passiveDarkEssencePerSecond is handled by gameLogic.js based on upgradeDef.value
        },
        purchased: false, unlocked: false, initialUnlockedState: false, requiredStage: 3
    },
    {
        id: 'nest_decor_skulls',
        name: "Trofea pożądania (Czaszki)",
        cost: UPGRADE_COSTS.nest_decor_skulls.essence,
        darkEssenceCost: UPGRADE_COSTS.nest_decor_skulls.darkEssence,
        description: "Kilka interesujących czaszek, być może poprzednich 'partnerów' sukkubów, jako ozdoba gniazdka Lilith. Z pewnością poczuje się bardziej jak w domu. (+15 Korupcji, +10 ME).",
        type: 'nest_upgrade',
        onPurchase: (gs) => { 
            setNestUpgrade('decor_skulls', true); 
            updateCorruption(NEST_UPGRADE_REWARDS.nest_decor_skulls.corruption); 
            updateDarkEssence(NEST_UPGRADE_REWARDS.nest_decor_skulls.darkEssence); // Direct update for one-time gain
            addPlayerChoiceFlag('nest_decor_skulls_purchased');
        },
        purchased: false, unlocked: false, initialUnlockedState: false, requiredStage: 1
    },
    {
        id: 'dark_gift_shadow_kiss',
        name: 'Mroczny Dar: Pocałunek Otchłani',
        cost: UPGRADE_COSTS.dark_gift_shadow_kiss.essence, 
        darkEssenceCost: UPGRADE_COSTS.dark_gift_shadow_kiss.darkEssence,
        description: 'Wzmocnij zdolność Lilith do generowania Mrocznej Esencji poprzez intensyfikację jej połączenia z Otchłanią, naznaczoną mrocznym pocałunkiem. (+10% do generowanej Mrocznej Esencji).',
        type: 'dark_essence_multiplier', // This type implies its value adds to gameState.darkEssenceMultiplier
        value: UPGRADE_VALUES.dark_gift_shadow_kiss, 
        purchased: false, 
        unlocked: false, 
        initialUnlockedState: false, 
        requiredStage: 3
    },
    {
        id: 'train_praktykant_1',
        name: 'Przywołaj Pomniejszego Demona Służebnego',
        cost: UPGRADE_COSTS.train_praktykant_1.essence,
        darkEssenceCost: UPGRADE_COSTS.train_praktykant_1.darkEssence,
        description: 'Naucz Lilith przyzywać i kontrolować pomniejsze demony, które mogą asystować w bardziej przyziemnych (lub nieprzyzwoitych) zadaniach i Pokusach. (Odblokowuje 1 Sługę).',
        type: 'minion_training',
        minionType: 'praktykanci',
        value: UPGRADE_VALUES.train_praktykant_1, 
        purchased: false, 
        unlocked: false, 
        initialUnlockedState: false,
        requiredStage: 5,
        onPurchase: (gs) => {
            if (!gs.minions.praktykanci.unlocked) {
                 setMinionUnlocked('praktykanci', true);
            }
            increaseMinionCount('praktykanci', UPGRADE_VALUES.train_praktykant_1);
        }
    },
    {
        id: 'recruit_arch_succubus_apprentice',
        name: "Przyjmij Oddaną Uczennicę",
        cost: UPGRADE_COSTS.recruit_arch_succubus_apprentice.essence,
        darkEssenceCost: UPGRADE_COSTS.recruit_arch_succubus_apprentice.darkEssence,
        description: "Młoda, ambitna sukkubica, zafascynowana potęgą Lilith, pragnie oddać się jej (i Tobie) w służbę. Potrafi samodzielnie prowadzić Pokusy i generuje Esencję.",
        type: 'elite_minion_recruitment',
        minionId: 'apprentice', // Matching the key in gameState.eliteMinion
        purchased: false, 
        unlocked: false,
        initialUnlockedState: false,
        requiredStage: 8,
        onPurchase: (gs) => {
            setEliteMinionRecruited('apprentice', true);
            setEliteMinionLevel('apprentice', 1);
        }
    },
    {
        id: 'arch_power_reality_converter',
        name: "Tkaczka Rzeczywistości (Moc Arcysukkuba)",
        cost: UPGRADE_COSTS.arch_power_reality_converter.essence,
        darkEssenceCost: UPGRADE_COSTS.arch_power_reality_converter.darkEssence,
        description: "Jako Arcysukkub, Lilith może naginać osnowę rzeczywistości, manifestując Wasze najmroczniejsze pragnienia. Deszcz nad miastem staje się deszczem pożądania, a rzeki płyną czystą esencją. (Znaczący pasywny bonus do generowania Mrocznej Esencji i Korupcji).",
        type: 'arch_power',
        requiredStage: 8, 
        purchased: false, 
        unlocked: false, 
        initialUnlockedState: false,
        onPurchase: (gs) => {
            // Assuming increasePassiveDarkEssencePerSecond and setCorruptionBonusMultiplier exist in stateUpdaters
            increasePassiveDarkEssencePerSecond(UPGRADE_VALUES.arch_power_reality_converter); 
            setCorruptionBonusMultiplier(UPGRADE_VALUES.arch_power_reality_converter_corruption); // Assuming this adds 0.2 to the current multiplier
            addPlayerChoiceFlag('reality_converter_active');
        }
    },
    {
        id: 'arch_power_omnipresent_holes',
        name: "Wszechobecne Portale Rozkoszy (Moc Arcysukkuba)",
        cost: UPGRADE_COSTS.arch_power_omnipresent_holes.essence,
        darkEssenceCost: UPGRADE_COSTS.arch_power_omnipresent_holes.darkEssence,
        description: "Lilith, w pełni swej mocy, może tworzyć zmysłowe portale połączone bezpośrednio z jej ciałem, dostępne w każdym miejscu i czasie. (Odblokowuje nowe, ekstremalne interakcje seksualne i znacznie zwiększa satysfakcję Lilith oraz generowanie zasobów z tych interakcji).",
        type: 'arch_power',
        requiredStage: 8, 
        purchased: false, 
        unlocked: false, 
        initialUnlockedState: false,
        onPurchase: (gs) => {
            addPlayerChoiceFlag('omnipresent_holes_active');
        }
    }
];

export const choiceUpgradeGroups = {
    'essence_mastery_1': {
        prompt: "Wybierz swoją specjalizację w Mistrzostwie Esencji:",
        choices: [
            { 
                id: 'click_focus_max', 
                name: "Mistrz Aktywnej Koncentracji", 
                description: "Twoje kliknięcia, nasycone pożądaniem, stają się niezwykle potężne. (+15 Esencji/klik)", 
                cost: 0, 
                type: CHOICE_UPGRADE_VALUES.essence_mastery_1.click_focus_max.type, 
                value: CHOICE_UPGRADE_VALUES.essence_mastery_1.click_focus_max.value, 
                isChoice: true 
            },
            { 
                id: 'passive_flow_max', 
                name: "Arcymistrz Pasywnego Przepływu", 
                description: "Twoje ołtarze i więź z Lilith emanują niezwykłą mocą, zapewniając stały napływ energii. (+8 Esencji/sek)", 
                cost: 0, 
                type: CHOICE_UPGRADE_VALUES.essence_mastery_1.passive_flow_max.type, 
                value: CHOICE_UPGRADE_VALUES.essence_mastery_1.passive_flow_max.value, 
                isChoice: true 
            }
        ],
        chosen: false 
    }
};

export const researchProjects = [
    {
        id: 'rp_basic_essence_upgrades',
        name: "Podstawy Wzmocnień Esencji",
        description: "Zbadaj proste metody wzmacniania przepływu Esencji i jej oczyszczania w kontekście obecności Sukkuba.",
        cost: RESEARCH_COSTS.rp_basic_essence_upgrades.essence,
        darkEssenceCost: RESEARCH_COSTS.rp_basic_essence_upgrades.darkEssence || undefined,
        loreDrop: "Nawet najprostsze skupienie woli, wzmocnione demoniczną aurą, może zintensyfikować przepływ energii życiowej. Odkryto też, że pewne 'zanieczyszczenia' tej energii mogą krystalizować się w Mroczną Esencję pod wpływem Lilith.",
        requiredStage: 0,
        corruptionGain: RESEARCH_REWARDS.rp_basic_essence_upgrades.corruption,
        isCompleted: false, 
        unlocked: false, 
        initialUnlockedState: true, 
        onComplete: (gs, gameDefs) => {
            setUpgradeUnlocked('passive_essence_1', true);
            setUpgradeUnlocked('purity_chance_1', true);
            setResearchProjectUnlocked('rp_advanced_essence_manipulation', true);
        }
    },
    {
        id: 'rp_intro_arcane_arts',
        name: "Wstęp do Sztuk Tajemnych Sukkuba",
        description: "Poznaj podstawy magii stosowanej przez sukkuby, aby zwiększyć swój wpływ i zrozumieć ich metody perswazji.",
        cost: RESEARCH_COSTS.rp_intro_arcane_arts.essence,
        darkEssenceCost: RESEARCH_COSTS.rp_intro_arcane_arts.darkEssence,
        loreDrop: "Sukkuby od wieków posługują się subtelnymi zaklęciami, by wzmacniać swój urok i manipulować emocjami śmiertelników. Pierwszym krokiem jest nauka tworzenia prostych zwojów nasyconych ich energią.",
        requiredStage: 1,
        corruptionGain: RESEARCH_REWARDS.rp_intro_arcane_arts.corruption,
        isCompleted: false, unlocked: false, initialUnlockedState: false,
        onComplete: (gs, gameDefs) => {
            setUpgradeUnlocked('charm_scroll_1', true);
        }
    },
    {
        id: 'rp_advanced_essence_manipulation',
        name: "Zaawansowana Manipulacja Esencją",
        description: "Głębsze zrozumienie przepływu i transformacji esencji w kontekście waszej rosnącej więzi z Lilith.",
        cost: RESEARCH_COSTS.rp_advanced_essence_manipulation.essence,
        darkEssenceCost: RESEARCH_COSTS.rp_advanced_essence_manipulation.darkEssence,
        loreDrop: "Mistrzowskie opanowanie esencji pozwala na tworzenie potężniejszych ołtarzy i bardziej efektywne skupianie mocy, zwłaszcza gdy jest ona filtrowana przez demoniczną naturę.",
        requiredStage: 2,
        corruptionGain: RESEARCH_REWARDS.rp_advanced_essence_manipulation.corruption,
        isCompleted: false, unlocked: false, initialUnlockedState: false,
        onComplete: (gs, gameDefs) => {
            setUpgradeUnlocked('essence_boost_2', true);
            setUpgradeUnlocked('passive_essence_2', true);
        }
    },
    {
        id: 'rp_essence_transfer_basics',
        name: "Podstawy Transferu Esencji (Więź)",
        description: "Zbadaj podstawowe mechanizmy pozyskiwania i transferu esencji między istotami, skupiając się na tworzeniu symbiotycznej więzi z Lilith.",
        cost: RESEARCH_COSTS.rp_essence_transfer_basics.essence,
        darkEssenceCost: RESEARCH_COSTS.rp_essence_transfer_basics.darkEssence || undefined,
        loreDrop: "Odkryto starożytny zwój opisujący techniki harmonizowania przepływów energetycznych między demonem a jego partnerem. Kluczem jest wzajemne zaufanie, otwartość i... dzielenie się najgłębszymi pragnieniami.",
        unlocksInteractionId: 'essence_connection',
        requiredStage: 3, 
        corruptionGain: RESEARCH_REWARDS.rp_essence_transfer_basics.corruption, 
        isCompleted: false, unlocked: false, initialUnlockedState: false,
        onComplete: (gs) => { addPlayerChoiceFlag('unlocked_rp_essence_transfer_basics'); }
    },
    {
        id: 'rp_succubus_anatomy_secrets',
        name: "Sekrety Anatomii Sukkuba (Intymność)",
        description: "Dogłębna analiza fizjologii Lilith może odkryć nowe punkty wrażliwości, źródła mocy i sposoby na pogłębienie waszej intymnej więzi.",
        cost: RESEARCH_COSTS.rp_succubus_anatomy_secrets.essence,
        darkEssenceCost: RESEARCH_COSTS.rp_succubus_anatomy_secrets.darkEssence || undefined,
        loreDrop: "Fragment z 'Cielesnego Atlasu Demonów Niższych', bogato ilustrowany, ujawnia zaskakujące połączenia nerwowe w skrzydłach, u podstawy ogona oraz w innych, bardziej... ukrytych miejscach sukkubów. Wiedza ta obiecuje nowe doznania.",
        unlocksInteractionId: 'sexual_exploration_gentle',
        requiredStage: 4, 
        corruptionGain: RESEARCH_REWARDS.rp_succubus_anatomy_secrets.corruption, 
        isCompleted: false, unlocked: false, initialUnlockedState: false,
        onComplete: (gs) => { addPlayerChoiceFlag('unlocked_rp_succubus_anatomy_secrets'); }
    },
    {
        id: 'rp_dark_anatomy_wings',
        name: "Mroczna Anatomia: Magia Skrzydeł",
        description: "Głębsze zrozumienie unerwienia i magicznych właściwości podstawy skrzydeł Lilith, klucz do jej ukrytych mocy i wrażliwości.",
        cost: RESEARCH_COSTS.rp_dark_anatomy_wings.essence,
        darkEssenceCost: RESEARCH_COSTS.rp_dark_anatomy_wings.darkEssence,
        loreDrop: "Notatki z sekcji demona skrzydlatego wspominają o 'plexus alarum', skupisku nerwów odpowiedzialnym za intensywne doznania erotyczne i przepływ surowej energii magicznej. Dotyk w tym miejscu może być... transformujący.",
        requiredStage: 3, 
        corruptionGain: RESEARCH_REWARDS.rp_dark_anatomy_wings.corruption, 
        isCompleted: false, unlocked: false, initialUnlockedState: false,
        onComplete: (gs) => { addPlayerChoiceFlag('rp_wings_mastery_unlocked'); }
    },
    {
        id: 'rp_forbidden_knowledge_whispers',
        name: "Zakazana Wiedza: Rytuał Szeptów Pożądania",
        description: "Odkryj starożytny rytuał pozwalający Lilith sączyć pokusy i erotyczne sugestie bezpośrednio do umysłów śmiertelników na odległość.",
        cost: RESEARCH_COSTS.rp_forbidden_knowledge_whispers.essence,
        darkEssenceCost: RESEARCH_COSTS.rp_forbidden_knowledge_whispers.darkEssence,
        loreDrop: "Strona z 'Grimuaru Szeptów Nocy' opisuje metodę projekcji myśli nasyconych demoniczną energią pożądania, zdolnych przełamać słabe bariery mentalne i rozpalić ukryte żądze.",
        requiredStage: 4, 
        corruptionGain: RESEARCH_REWARDS.rp_forbidden_knowledge_whispers.corruption, 
        isCompleted: false, unlocked: false, initialUnlockedState: false,
        onComplete: (gs) => { addPlayerChoiceFlag('rp_whisper_ritual_unlocked'); }
    },
    {
        id: 'rp_mind_manipulation_basics',
        name: "Manipulacja Umysłem: Podstawy Sugestii Erotycznej",
        description: "Naucz Lilith podstawowych technik wpływania na umysły słabszych istot, zwiększając jej skuteczność w Pokusach i... waszych prywatnych interakcjach.",
        cost: RESEARCH_COSTS.rp_mind_manipulation_basics.essence,
        darkEssenceCost: RESEARCH_COSTS.rp_mind_manipulation_basics.darkEssence,
        loreDrop: "Akademicki podręcznik 'Sugestia dla Początkujących Demonów Rozkoszy' zawiera rozdział o wykorzystywaniu tonu głosu, mowy ciała i feromonów do subtelnego naginania woli i rozbudzania pożądania.",
        requiredStage: 3, 
        corruptionGain: RESEARCH_REWARDS.rp_mind_manipulation_basics.corruption, 
        isCompleted: false, unlocked: false, initialUnlockedState: false,
        onComplete: (gs) => { addPlayerChoiceFlag('rp_suggestion_basics_unlocked'); }
    },
    {
        id: 'rp_unlock_temptations',
        name: "Odblokowanie Systemu Pokus (Zdalne Kuszenie)",
        description: "Zgłęb wiedzę na temat wykorzystywania mocy sukkuba do aktywnego kuszenia śmiertelników i zbierania ich esencji na odległość, bez bezpośredniego kontaktu.",
        cost: RESEARCH_COSTS.rp_unlock_temptations.essence,
        darkEssenceCost: RESEARCH_COSTS.rp_unlock_temptations.darkEssence,
        loreDrop: "Lilith odkrywa starożytny tekst opisujący, jak sukkuby mogą wysyłać swoje emanacje – projekcje swojej zmysłowości – by kusić i deprawować dusze na odległość, zbierając obfite plony grzechu i pożądania.",
        requiredStage: 2, 
        corruptionGain: RESEARCH_REWARDS.rp_unlock_temptations.corruption, 
        isCompleted: false, unlocked: false, initialUnlockedState: false,
        onComplete: (gs) => { addPlayerChoiceFlag('system_temptations_unlocked'); }
    },
    {
        id: 'rp_unlock_minions_basic',
        name: "Sztuka Mniejszego Przyzwania: Demoniczni Słudzy",
        description: "Opanuj podstawy przyzywania i szkolenia mniejszych demonicznych sług, którzy mogą pomagać Lilith w jej zadaniach i zaspokajać jej (oraz Twoje) potrzeby.",
        cost: RESEARCH_COSTS.rp_unlock_minions_basic.essence,
        darkEssenceCost: RESEARCH_COSTS.rp_unlock_minions_basic.darkEssence,
        loreDrop: "Lilith odkrywa, że jej rosnąca moc pozwala jej na formowanie pomniejszych bytów z czystej esencji i cienia, które mogą wykonywać proste polecenia, asystować w rytuałach i wspomagać ją w misjach kuszenia.",
        requiredStage: 5,
        corruptionGain: RESEARCH_REWARDS.rp_unlock_minions_basic.corruption,
        isCompleted: false, unlocked: false, initialUnlockedState: false,
        onComplete: (gs, gameDefs) => {
            addPlayerChoiceFlag('minions_praktykanci_unlocked');
            setMinionUnlocked('praktykanci', true);
            setUpgradeUnlocked('train_praktykant_1', true);
        }
    },
    {
        id: 'rp_advanced_seduction_techniques',
        name: "Zaawansowane Techniki Uwodzenia (Mistrzostwo Pokus)",
        description: "Badania nad bardziej wyrafinowanymi metodami manipulacji pożądaniem, pozwalające Lilith na mistrzowskie kontrolowanie emocji i żądz swoich ofiar, co znacznie zwiększa skuteczność Pokus.",
        cost: RESEARCH_COSTS.rp_advanced_seduction_techniques.essence,
        darkEssenceCost: RESEARCH_COSTS.rp_advanced_seduction_techniques.darkEssence,
        loreDrop: "Mistrzowskie techniki uwodzenia pozwalają nie tylko kusić, ale wręcz tkać misterną sieć pożądania wokół ofiary, czyniąc ją całkowicie bezbronną wobec wpływu Sukkuba i gotową oddać wszystko dla chwili zapomnienia.",
        requiredStage: 5, 
        corruptionGain: RESEARCH_REWARDS.rp_advanced_seduction_techniques.corruption, 
        isCompleted: false, unlocked: false, initialUnlockedState: false,
        onComplete: (gs) => { addPlayerChoiceFlag('advanced_seduction_unlocked'); }
    }
];

export const darkRituals = [
    {
        id: 'ritual_shadow_bond',
        name: "Rytuał Więzów Cienia i Rozkoszy",
        description: "Wzmocnij demoniczną więź z Lilith poprzez rytuał splatający Wasze cienie i esencje rozkoszy. Zwiększa jej podatność na korupcję i efektywność zdobywania korupcji z intymnych interakcji.",
        essenceCost: RITUAL_COSTS.ritual_shadow_bond.essence,
        darkEssenceCost: RITUAL_COSTS.ritual_shadow_bond.darkEssence,
        requiredStage: 4,
        effectDescription: "+10% do zdobywanej korupcji z interakcji (permanentnie). +30 Korupcji natychmiast. Odblokowuje nowe, bardziej intensywne opcje dialogowe.",
        onComplete: (gs) => { 
            setCorruptionBonusMultiplier(RITUAL_REWARDS.ritual_shadow_bond.corruptionBonusMultiplier); // Assuming this adds to the multiplier
            updateCorruption(RITUAL_REWARDS.ritual_shadow_bond.corruption);
            addPlayerChoiceFlag('shadow_bond_ritual_completed');
        },
        isCompleted: false 
    },
    {
        id: 'ritual_arch_succubus_ascension',
        name: "Rytuał Wzniesienia Arcysukkuba",
        description: "Przeprowadź ostateczny, bluźnierczy rytuał, aby Lilith osiągnęła pełnię swojej demonicznej mocy i stała się Arcysukkubem. To otworzy nowe, przerażające możliwości i scementuje Waszą wspólną dominację.",
        essenceCost: RITUAL_COSTS.ritual_arch_succubus_ascension.essence,
        darkEssenceCost: RITUAL_COSTS.ritual_arch_succubus_ascension.darkEssence,
        requiredStage: 7,
        effectDescription: "Lilith staje się Arcysukkubem (Etap 8). Odblokowuje możliwość rekrutacji Uczennicy Arcysukkuba oraz nowe, potężne interakcje i ulepszenia godne jej statusu.",
        onComplete: (gs, gameDefs) => { 
            addPlayerChoiceFlag('lilith_is_arch_succubus');

            const archSuccubusStageTarget = RITUAL_REWARDS.ritual_arch_succubus_ascension.targetStage; 
            const maxStage = gameDefs && gameDefs.lilithStages ? gameDefs.lilithStages.length - 1 : archSuccubusStageTarget;
            const newStage = Math.min(archSuccubusStageTarget, maxStage);

            if (gs.lilithStage < newStage) {
                setLilithStage(newStage); // Use updater
                if (gameDefs && gameDefs.lilithStages && typeof ui !== 'undefined' && ui.showCustomAlert) { 
                     ui.showCustomAlert(`Lilith osiągnęła nowy etap: ${gameDefs.lilithStages[gs.lilithStage].name}!`);
                     if (ui.markLilithDisplayDirty) ui.markLilithDisplayDirty();
                     if (ui.markDialoguesDirty) ui.markDialoguesDirty();
                     if (ui.markUpgradesDirty) ui.markUpgradesDirty();
                }
            }
            setUpgradeUnlocked('recruit_arch_succubus_apprentice', true);
            setUpgradeUnlocked('arch_power_reality_converter', true);
            setUpgradeUnlocked('arch_power_omnipresent_holes', true);
        },
        isCompleted: false
    }
];

export const temptationMissions = [
    {
        id: 'tempt_corrupt_cleric', 
        title: "Pokusa: Skruszyć Wiarę Kleryka",
        description: "Młody, gorliwy kleryk w pobliskiej wiosce opiera się wszelkim pokusom. Czy Lilith zdoła skruszyć jego wiarę i zasiać w jego sercu ziarno pożądania, kusząc go wizjami zakazanych rozkoszy?",
        requiredLilithStage: TEMPTATION_REQUIREMENTS.tempt_corrupt_cleric.stage,
        requiredCorruption: TEMPTATION_REQUIREMENTS.tempt_corrupt_cleric.corruption,
        essenceCost: TEMPTATION_COSTS.tempt_corrupt_cleric.essence, 
        darkEssenceCost: TEMPTATION_COSTS.tempt_corrupt_cleric.darkEssence,
        durationSeconds: TEMPTATION_DURATIONS.tempt_corrupt_cleric, 
        successChanceBase: TEMPTATION_SUCCESS_RATES.tempt_corrupt_cleric,
        rewards: { 
            success: { 
                narrative: "Kleryk spędził bezsenną noc, dręczony wizjami zesłanymi przez Lilith. Jego wiara została zachwiana, a dusza naznaczona pożądaniem. Esencja jego upadku jest słodka.", 
                corruption: TEMPTATION_REWARDS.tempt_corrupt_cleric.success.corruption, 
                darkEssence: TEMPTATION_REWARDS.tempt_corrupt_cleric.success.darkEssence, 
                essence: TEMPTATION_REWARDS.tempt_corrupt_cleric.success.essence 
            }, 
            failure: { 
                narrative: "Wiara kleryka okazała się silniejsza niż podszepty Lilith. Odprawił modły oczyszczające, wzmacniając swoją duszę, ale Lilith czuje, że zasiała ziarno wątpliwości.", 
                corruption: TEMPTATION_REWARDS.tempt_corrupt_cleric.failure.corruption, 
                darkEssence: TEMPTATION_REWARDS.tempt_corrupt_cleric.failure.darkEssence 
            } 
        },
        isRepeatable: false 
    },
    {
        id: 'tempt_seduce_knight', 
        title: "Pokusa: Złamać Przysięgę Cnotliwego Rycerza",
        description: "Dumny rycerz słynie ze swojej cnoty i wierności. Czy Lilith, przybierając postać niewinnej damy w opałach, zdoła go uwieść i zmusić do złamania przysięgi w imię chwilowej namiętności?",
        requiredLilithStage: TEMPTATION_REQUIREMENTS.tempt_seduce_knight.stage,
        requiredCorruption: TEMPTATION_REQUIREMENTS.tempt_seduce_knight.corruption,
        essenceCost: TEMPTATION_COSTS.tempt_seduce_knight.essence, 
        darkEssenceCost: TEMPTATION_COSTS.tempt_seduce_knight.darkEssence,
        durationSeconds: TEMPTATION_DURATIONS.tempt_seduce_knight, 
        successChanceBase: TEMPTATION_SUCCESS_RATES.tempt_seduce_knight,
        rewards: { 
            success: { 
                narrative: "Zbroja rycerza leży porzucona, a jego przysięga jest już tylko wspomnieniem. Lilith delektuje się jego upadkiem i esencją jego złamanego honoru.", 
                corruption: TEMPTATION_REWARDS.tempt_seduce_knight.success.corruption, 
                darkEssence: TEMPTATION_REWARDS.tempt_seduce_knight.success.darkEssence, 
                essence: TEMPTATION_REWARDS.tempt_seduce_knight.success.essence 
            }, 
            failure: { 
                narrative: "Rycerz oparł się pokusie, jego honor pozostał nietknięty, choć Lilith dostrzegła w jego oczach błysk pożądania. Potrzeba silniejszych metod.", 
                corruption: TEMPTATION_REWARDS.tempt_seduce_knight.failure.corruption, 
                darkEssence: TEMPTATION_REWARDS.tempt_seduce_knight.failure.darkEssence 
            } 
        },
        isRepeatable: false
    },
    {
        id: 'tempt_incite_orgy_village_festival', 
        title: "Pokusa: Rozpętać Ekstatyczną Orgię na Wiejskim Festynie",
        description: "Zbliża się lokalny festyn, pełen radości i... tłumionych żądz. Czy Lilith zdoła zasiać ziarno niepohamowanej namiętności i doprowadzić do publicznego skandalu, który zasili ją potężną dawką esencji?",
        requiredLilithStage: TEMPTATION_REQUIREMENTS.tempt_incite_orgy_village_festival.stage,
        requiredCorruption: TEMPTATION_REQUIREMENTS.tempt_incite_orgy_village_festival.corruption,
        essenceCost: TEMPTATION_COSTS.tempt_incite_orgy_village_festival.essence, 
        darkEssenceCost: TEMPTATION_COSTS.tempt_incite_orgy_village_festival.darkEssence,
        durationSeconds: TEMPTATION_DURATIONS.tempt_incite_orgy_village_festival, 
        successChanceBase: TEMPTATION_SUCCESS_RATES.tempt_incite_orgy_village_festival,
        rewards: { 
            success: { 
                narrative: "Festyn zamienił się w scenę dantejskich uciech. Moralność wioski legła w gruzach, a Lilith pęka z dumy i mrocznej mocy, kąpiąc się w falach czystej żądzy.", 
                corruption: TEMPTATION_REWARDS.tempt_incite_orgy_village_festival.success.corruption, 
                darkEssence: TEMPTATION_REWARDS.tempt_incite_orgy_village_festival.success.darkEssence, 
                essence: TEMPTATION_REWARDS.tempt_incite_orgy_village_festival.success.essence 
            }, 
            failure: { 
                narrative: "Mieszkańcy wioski, choć kuszeni, zachowali pozory przyzwoitości. Lilith czuje, że potrzebuje więcej mocy, by złamać ich opory, ale udało jej się zebrać nieco rozproszonej energii.", 
                corruption: TEMPTATION_REWARDS.tempt_incite_orgy_village_festival.failure.corruption, 
                darkEssence: TEMPTATION_REWARDS.tempt_incite_orgy_village_festival.failure.darkEssence 
            } 
        },
        isRepeatable: false
    }
];

export const eliteMinions = {
    arch_succubus_apprentice: {
        id: "arch_succubus_apprentice",
        name: "Uczennica Arcysukkuba",
        description: "Młoda, ambitna sukkubica, zafascynowana potęgą Lilith, pragnie oddać się jej (i Tobie) w służbę. Potrafi samodzielnie prowadzić Pokusy i generuje Esencję.",
        passiveEssenceGeneration: ELITE_MINION_STATS.arch_succubus_apprentice.passiveEssenceGeneration,
        temptationEffectivenessModifier: ELITE_MINION_STATS.arch_succubus_apprentice.temptationEffectivenessModifier, 
    }
};