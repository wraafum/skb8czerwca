import { setNestUpgrade, updateCorruption, updateDarkEssence, increasePassiveDarkEssencePerSecond, setCorruptionBonusMultiplier, addPlayerChoiceFlag, setEliteMinionRecruited, setEliteMinionLevel, setMinionUnlocked, increaseMinionCount } from "../stateUpdaters.js";
import { UPGRADE_COSTS, UPGRADE_VALUES, NEST_UPGRADE_REWARDS } from "../gameConfig.js";

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
