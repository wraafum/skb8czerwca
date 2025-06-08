// characterProgression.js

// NOWE: Import balance modifiers from config
import { BALANCE_MODIFIERS } from './gameConfig.js';
import { PLACEHOLDER_IMG } from './assets.js';

export const improvedStageDescriptions = {
    0: (gs) => {
        let base = "Lilith wciąż się przyzwyczaja do nowej sytuacji. Jej postawa oscyluje między akademicką pewnością siebie a nerwowością nowicjuszki.";
        if (gs.playerChoiceFlags.includes('player_attempted_calm_summon')) { base += " Twoje spokojne podejście pozwala jej czasem zapomnieć o strachu, choć wciąż jest czujna."; }
        else if (gs.playerChoiceFlags.includes('player_asserted_dominance_summon')) { base += " Twoja dominacja wywołuje w niej mieszane uczucia - instynktowną uległość zmieszaną z akademicką dumą."; }
        else if (gs.playerChoiceFlags.includes('player_charmed_summon')) { base += " Twoje komplementy sprawiają, że czasem zapomina o wyuczonej pozie i pokazuje prawdziwą siebie."; }
        if (gs.playerChoiceFlags.includes('nest_bed_1_purchased')) { base += " Jej nowe posłanie wydaje się zapewniać jej odrobinę komfortu w tej nieznanej sytuacji."; }
        return base;
    },
    1: (gs) => { // Odblokowany po summoning_ritual_completed (Breaking Point narrativeStage 0)
        let base = "Lilith zaczyna ostrożnie testować granice. Jej akademicka wiedza ściera się z rosnącą ciekawością wobec Ciebie i tego świata.";
        if (gs.playerChoiceFlags.includes('discussed_academy')) { base += " Rozmowy o akademii dodają jej pewności siebie, choć czasem zdradza swoją niepewność, zwłaszcza gdy poruszasz temat praktyki."; }
        if (gs.playerChoiceFlags.includes('teased_about_experience')) { base += " Twoje docinki o braku doświadczenia motywują ją do... przemyśleń i obserwacji."; }
        if (gs.playerChoiceFlags.includes('first_touch_tension_completed')) { base += " Ten pierwszy, nieśmiały (lub śmiały) dotyk wciąż rezonuje w jej myślach."; }
        return base;
    },
    2: (gs) => { // Odblokowany po first_touch_tension_completed (Breaking Point narrativeStage 1)
        let base = "Ciekawość Lilith przechodzi w coś więcej. Coraz częściej zapomina o 'właściwych procedurach' na rzecz instynktu i odczuć, które w niej budzisz. Zaczyna otwarciej komunikować swoje myśli.";
        if (gs.playerChoiceFlags.includes('bold_first_touch')) { base += " Pamięta twój pierwszy, śmiały dotyk i czasem drży na samo wspomnienie, zastanawiając się, co będzie dalej."; }
        if (gs.playerChoiceFlags.includes('vocal_breakthrough_dialogue_completed')) { base += " Odkąd może dzielić się swoimi myślami na głos, czuje się bliżej Ciebie, choć czasem ją to peszy.";}
        return base;
    },
    3: (gs) => { // Odblokowany po vocal_breakthrough_dialogue_completed (Breaking Point narrativeStage 2)
        let base = "W Lilith budzą się nowe, nieznane jej dotąd pragnienia i instynkty. Zaczyna rozumieć swoją naturę w kontekście Twojej obecności. Jej akademicka wiedza ustępuje miejsca bardziej pierwotnym odruchom, a sny stają się coraz bardziej... sugestywne.";
        if (gs.playerChoiceFlags.includes('first_real_kiss_completed')) { base += " Ten pierwszy, prawdziwy pocałunek obudził w niej coś, czego nie było w żadnym podręczniku – głód bliskości."; }
        if (gs.playerChoiceFlags.includes('dream_confession_completed')) { base += " Wyznanie o snach było dla niej trudne, ale poczuła ulgę, dzieląc się tym z Tobą."; }
        return base;
    },
    4: (gs) => { // Odblokowany po first_real_kiss_completed (Breaking Point narrativeStage 3)
        let base = "Lilith zaczyna świadomie, choć może jeszcze z nutą nieśmiałości, eksperymentować ze swoim urokiem i wpływem na Ciebie. Testuje granice, a jej dotyk staje się bardziej celowy. Teoria łączy się z praktyką w coraz bardziej intymny sposób.";
        if (gs.playerChoiceFlags.includes('essence_connection_established')) { base += " Połączenie waszych esencji dodało jej pewności i głębszego zrozumienia waszej więzi, czuje Twoje pragnienia niemal jak własne."; }
        if (gs.playerChoiceFlags.includes('morning_surprise_completed')) { base += " Wasze poranki stały się... bardziej ekscytujące. Odkrywa nowe sposoby na czerpanie przyjemności i dawanie jej Tobie.";}
        return base;
    },
    5: (gs) => { // Odblokowany po morning_surprise_completed (Breaking Point narrativeStage 4)
        let base = "Lilith w pełni akceptuje swoją rolę uwodzicielki i kochanki. Jej ruchy są płynne i pełne gracji, a każde słowo jest starannie dobrane, by kusić i prowokować. Zna swoją wartość, swoje ciało i Twoje pragnienia – i nie boi się ich używać.";
        if (gs.playerChoiceFlags.includes('breaking_point_true_desire_completed')) { base += " Wyznanie prawdziwego pragnienia było dla niej przełomem, teraz jest gotowa na pełne zjednoczenie.";}
        return base;
    },
    6: (gs) => { // Odblokowany po breaking_point_true_desire_completed (Breaking Point narrativeStage 5)
        let base = "Lilith nie tylko uwodzi, ale dominuje. Jej pewność siebie jest niemal namacalna. Czerpie siłę z Waszego pożądania i nie waha się przejmować inicjatywy w najbardziej bezpośredni i perwersyjny sposób. Granice zaczynają się zacierać.";
        if (gs.playerChoiceFlags.includes('first_anal_sex_milestone_completed')) { base += " Przekroczenie kolejnego tabu uczyniło ją istotą bez zahamowań, gotową na wszystko dla Waszej wspólnej rozkoszy.";}
        return base;
    },
    7: (gs) => { // Odblokowany po first_anal_sex_milestone_completed (Breaking Point narrativeStage 6)
        let base = "Lilith osiągnęła szczyt swojej transformacji jako Twoja partnerka. Jest uosobieniem mrocznej zmysłowości, idealnym połączeniem akademickiej wiedzy i pierwotnego instynktu. Jej oddanie Tobie i korupcji jest absolutne. Wasza więź przekracza zwykłe pojęcie relacji demona i śmiertelnika.";
        if (gs.playerChoiceFlags.includes('perfect_union_event_completed')) { base += " Wasze dusze i ciała są splecione w jedno, tworząc symfonię rozkoszy i mroku.";}
        return base;
    },
    8: (gs) => { // Odblokowany po rytuale (Breaking Point narrativeStage 7 to perfect_union)
        let base = "Lilith stała się Arcysukkubem. Jej moc jest niemal boska, a jej wpływ na rzeczywistość namacalny. Pożądanie i korupcja to teraz jej domena, a Ty jesteś w centrum jej wszechświata.";
        if (gs.playerChoiceFlags.includes('unleashed_corruption_plague')) {
            base += " Miasta drżą przed jej mocą, a sama rzeczywistość ugina się pod naporem jej żądzy, którą dzieli się z Tobą.";
        }
        if (gs.eliteMinion && gs.eliteMinion.apprentice && gs.eliteMinion.apprentice.recruited) {
            base += " U jej boku kroczy wierna uczennica, gotowa spełniać jej (i Twoje) najmroczniejsze rozkazy.";
        }
        return base;
    }
};

export const lilithStages = [
    { name: "Przyzwana", imagePath: PLACEHOLDER_IMG, description: improvedStageDescriptions[0] },
    { name: "Obserwująca", imagePath: PLACEHOLDER_IMG, description: improvedStageDescriptions[1] },
    { name: "Ciekawska", imagePath: PLACEHOLDER_IMG, description: improvedStageDescriptions[2] },
    { name: "Kuszona Wewnętrznie", imagePath: PLACEHOLDER_IMG, description: improvedStageDescriptions[3] },
    { name: "Eksperymentująca", imagePath: PLACEHOLDER_IMG, description: improvedStageDescriptions[4] },
    { name: "Uwodzicielska", imagePath: PLACEHOLDER_IMG, description: improvedStageDescriptions[5] },
    { name: "Dominująca Pokusą", imagePath: PLACEHOLDER_IMG, description: improvedStageDescriptions[6] },
    { name: "Skorumpowana Całkowicie", imagePath: PLACEHOLDER_IMG, description: improvedStageDescriptions[7] },
    { name: "Arcysukkub", imagePath: PLACEHOLDER_IMG, description: improvedStageDescriptions[8] }
];

// Pozostała część pliku (lilithVocalThoughts, lilithThoughts, etc.) bez zmian w tej iteracji,
// ale pamiętaj, że ich warunki `stageRequired` i `requiresFlag` również powinny być spójne z nową logiką progresji.

export const lilithVocalThoughts = [
    {
        id: 'initial_vocal_thought',
        text: "(Głośno) Och, Mistrzu... Coś się we mnie zmieniło. Od teraz będziesz słyszał moje myśli. Wszystkie. Przygotuj się.",
        isItalic: false
    },
    {
        text: "Czasem zastanawiam się, czy te wszystkie książki w Akademii miały jakikolwiek sens... w porównaniu do tego, czego uczę się tutaj, z Tobą.",
        stageRequired: 2, 
        corruptionMin: 100, 
        requiresFlag: ['lilith_vocal_system_unlocked'] // Ta flaga jest ustawiana w onSelected w 'vocal_breakthrough_dialogue'
    },
    {
        text: "Twoje dłonie... Zastanawiam się, jak by to było, gdybyś dotykał mnie nimi... wszędzie. Tak, jak wtedy, gdy... ach, nieważne.",
        stageRequired: 2,
        corruptionMin: 120,
        requiresFlag: ['bold_first_touch', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Czuję się dziwnie... swobodnie, mówiąc Ci o tym wszystkim. To jakby jakaś tama we mnie puściła.",
        stageRequired: 2,
        corruptionMin: 110,
        requiresFlag: ['lilith_vocal_system_unlocked']
    },
    {
        text: "Jak to możliwe, że Twoje palce są tak zręczne i precyzyjne w odnajdywaniu moich najwilgotniejszych sekretów? Proszę, nie mów że to przez Dotę 2!!!",
        stageRequired: 3, 
        corruptionMin: 200,
        requiresFlag: ['first_petting_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Czy to normalne, że na samą myśl o Tobie robi mi się... gorąco? I to nie tylko od temperatury w tym wymiarze.",
        stageRequired: 3,
        corruptionMin: 220,
        requiresFlag: ['first_real_kiss_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Zaczynam rozumieć, dlaczego niektóre sukkuby tak łatwo przywiązywały się do swoich przyzywaczy. To... uzależniające.",
        stageRequired: 4,
        corruptionMin: 320,
        requiresFlag: ['essence_connection_established', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Wiesz, że gdy myślę o Twoim kutasie, to w moich ustach zaczyna się nadprodukcja śliny?",
        stageRequired: 4,
        corruptionMin: 350,
        requiresFlag: ['first_oral_sex_by_lilith_completed', 'lilith_vocal_system_unlocked'],
        sexualPreference: { key: 'popular_fetish', subCategory: 'oral_fixation', level: 1 }
    },
    {
        text: "Wyobraziłam sobie, że wchodzisz tak głęboko, że widać zarys twojego kutasa pod moją skórą. Ahh♥!",
        stageRequired: 5, 
        corruptionMin: 580,
        requiresFlag: ['first_vaginal_sex_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "To... to co dzisiaj zrobiłeś, było przyjemne. O wiele przyjemniejsze niż symulacje w Akademii. Czy moglibyśmy to powtórzyć?",
        stageRequired: 4,
        corruptionMin: 300,
        requiresFlag: ['first_petting_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Twoje palce są takie ciepłe... W podręcznikach pisali o 'strefach erogennych', ale nie sądziłam, że reakcja będzie aż tak natychmiastowa. Chcę więcej...",
        stageRequired: 4,
        corruptionMin: 320,
        requiresFlag: ['first_petting_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Zauważyłam, że kiedy robię tak - lekko muska Twoje krocze przez materiał spodni - to Twoje tętno przyspiesza. Fascynujące. Co by się stało, gdybym zrobiła to bez tej irytującej bariery materiału?",
        stageRequired: 4,
        corruptionMin: 350,
        requiresFlag: ['sexual_exploration_gentle_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Ha! Dzisiaj ubrałam się specjalnie dla ciebie. A raczej... rozebrałam.",
        stageRequired: 5,
        corruptionMin: 500,
        requiresFlag: ['first_vaginal_sex_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Nudzi mi się. Wiesz, że mam fiksację oralną? Może mógłbyś mi pomóc?",
        stageRequired: 5,
        corruptionMin: 520,
        requiresFlag: ['first_oral_sex_by_lilith_completed', 'lilith_vocal_system_unlocked'],
        sexualPreference: { key: 'popular_fetish', subCategory: 'oral_fixation', level: 1 }
    },
    {
        text: "Czasem zastanawiam się, jaka jest Twoja najbardziej zdeprawowana fantazja. I czy odważysz się ją ze mną zrealizować.",
        stageRequired: 5,
        corruptionMin: 550,
        requiresFlag: ['breaking_point_true_desire_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Czy wiesz, Mistrzu, że sukkuby mają bardzo wrażliwe ogony? Zwłaszcza u nasady. Tak tylko mówię... gdybyś szukał nowych miejsc do pieszczot.",
        stageRequired: 5,
        corruptionMin: 580,
        requiresFlag: ['rp_succubus_anatomy_secrets', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Patrzysz na moje piersi, prawda? Są dzisiaj jakieś większe, co? To pewnie przez Ciebie.",
        stageRequired: 5,
        corruptionMin: 600,
        requiresFlag: ['first_vaginal_sex_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Jestem pokusą. Twoją osobistą, małą (no, może nie taką małą) pokusą.",
        stageRequired: 5,
        corruptionMin: 650,
        requiresFlag: ['breaking_point_true_desire_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Wciąż czuję na języku smak naszego pierwszego razu... I doskonale wiesz, że nie mam na myśli pocałunku, Mistrzu. Twój kutas jest uzależniający.",
        stageRequired: 5,
        corruptionMin: 500,
        requiresFlag: ['first_oral_sex_by_lilith_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Lubię, gdy wypełniasz moje gardło. Całkowicie.",
        stageRequired: 5,
        corruptionMin: 550,
        requiresFlag: ['first_oral_sex_by_lilith_completed', 'lilith_vocal_system_unlocked'],
        sexualPreference: { key: 'popular_fetish', subCategory: 'oral_fixation', level: 2 } 
    },
    {
        text: "Ostatnio dręczy mnie pewna wizja... Widzę, jak twoje gęste, gorące nasienie spływa po moich nabrzmiałych piersiach, tworząc lepkie ścieżki. Ech! Chciałabym, żeby to była jawa.",
        stageRequired: 5,
        corruptionMin: 600,
        requiresFlag: ['first_vaginal_sex_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Widzisz coś na twarzy swojej Sukkubicy... To chyba... Trochę Twojej zaschniętej spermy. Zostawiłam specjalnie, by każdy widział do kogo należę!",
        isItalic: true,
        stageRequired: 5,
        corruptionMin: 650,
        requiresFlag: ['first_oral_sex_by_lilith_completed', 'lilith_vocal_system_unlocked'], 
        sexualPreference: { key: 'exhibitionism', level: 1 }
    },
    {
        text: "Nie próbuj się opierać. Zerżniesz mnie dziś, czy tego chcesz, czy nie. A wiem, że chcesz.",
        stageRequired: 6,
        corruptionMin: 750,
        requiresFlag: ['first_vaginal_sex_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Twoje pieszczoty są miłe, ale to ja tu decyduję, kiedy i jak będziemy się bawić. Chociaż w sumie, to ja zawszę lubię się z Tobą bawić.",
        stageRequired: 6,
        corruptionMin: 780,
        requiresFlag: ['dominant_teaching_success', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Spełniłbyś moje kaprysy, Mistrzu? Mam ich dzisiaj wyjątkowo dużo.",
        stageRequired: 6,
        corruptionMin: 800,
        requiresFlag: ['first_anal_sex_milestone_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Lubię czuć Twoją moszne na mojej twarzy. To takie... upokarzająco przyjemne.",
        stageRequired: 6,
        corruptionMin: 850,
        requiresFlag: ['first_oral_sex_by_lilith_completed', 'lilith_vocal_system_unlocked'], 
        sexualPreference: { key: 'bdsm', subCategory: 'submission', level: 1 } 
    },
    {
        text: "Sprawdzałam dziś kalorie i ilość białka w nasieniu - wyszło mi, że to bardzo zbilansowany posiłek. Powinnam jeść częściej.",
        stageRequired: 6,
        corruptionMin: 900,
        requiresFlag: ['first_oral_sex_by_lilith_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Chcę, byś wziął mnie brutalnie, gdy ja błagam o litość - ale czy to jest w ogóle wiarygodne? Sukubica błagająca o litość? Powinnam chyba błagać o więcej...",
        stageRequired: 6,
        corruptionMin: 700,
        requiresFlag: ['first_vaginal_sex_completed', 'lilith_vocal_system_unlocked'],
        sexualPreference: { key: 'bdsm', subCategory: 'pain_pleasure', level: 2 }
    },
    {
        text: "Jaki masz dziś kaprys, Panie? Jestem gotowa spełnić każdy.",
        stageRequired: 7,
        corruptionMin: 1000,
        requiresFlag: ['first_anal_sex_milestone_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Czy jest jakaś granica, której jeszcze razem nie przekroczyliśmy? Jakaś perwersja, której nie zasmakowaliśmy? Jeśli tak, musimy to nadrobić.",
        stageRequired: 7,
        corruptionMin: 1100,
        requiresFlag: ['perfect_union_event_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Czy wymagam tak wiele, chcąc cie w każdym z moich otworów? Jednocześnie?",
        stageRequired: 7,
        corruptionMin: 1200,
        requiresFlag: ['first_anal_sex_milestone_completed', 'lilith_vocal_system_unlocked'] 
    },
    {
        text: "Moje piersi jako poduszki dla Twoich bioder, moje usta jako pochwa, a moje łzy jako Twój lubrykant. Brzmi jak plan.",
        stageRequired: 7,
        corruptionMin: 1300,
        requiresFlag: ['complete_corruption_love_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Co lubię? Ach, między innymi ssanie, połykanie, lizanie i bycie Twoją dziwką. Muszę jeszcze pomyśleć...",
        stageRequired: 7,
        corruptionMin: 1400,
        requiresFlag: ['first_oral_sex_by_lilith_completed', 'first_vaginal_sex_completed', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Nie potrzebuję już podręczników. W zasadzie to zdobyłam tyle Twojej spermy, że sama mogłabym je pisać. Chcesz pierwszą lekcję?",
        stageRequired: 8,
        corruptionMin: 2000,
        requiresFlag: ['lilith_is_arch_succubus', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Tabu nie istnieją. Są tylko możliwości.",
        stageRequired: 8,
        corruptionMin: 2100,
        requiresFlag: ['lilith_is_arch_succubus', 'lilith_vocal_system_unlocked']
    },
    {
        text: "Orgia. Teraz.",
        stageRequired: 8,
        corruptionMin: 2200,
        requiresFlag: ['lilith_is_arch_succubus', 'lilith_vocal_system_unlocked'],
        sexualPreference: { key: 'group_dynamics', level: 2 }
    },
    {
        text: "Moja wiedza o esencjach i płynach ustrojowych jest teraz kompletna. Zdobyłam tyle Twojej cennej spermy, że mogłabym napisać encyklopedię o jej właściwościach i zastosowaniach. Chcesz praktyczną demonstrację? Mogę zacząć od Twoich ust.",
        stageRequired: 8,
        corruptionMin: 2300,
        requiresFlag: ['lilith_is_arch_succubus', 'lilith_vocal_system_unlocked']
    },
    {
        text: "100 gorylów przeciwko jednemu mężczyźnie? Panie, a gdyby tak 100 płodnych dziewic przeciwko Tobie? Jestem w stanie to zaaranżować. Albo 100 demonów. Albo ja w 100 postaciach.",
        stageRequired: 8,
        corruptionMin: 2500,
        requiresFlag: ['lilith_is_arch_succubus', 'reality_warping_orgy_completed', 'lilith_vocal_system_unlocked']
    }
];

export const lilithThoughts = {
    0: [
        { text: "(Kim jest ten człowiek? Jego obecność... czuję ją całym ciałem.)", corruption: [0, 29] }, 
        { text: "(Akademia nie przygotowała mnie na to. Na prawdziwego przyzywacza. Jest... intensywny.)", corruption: [0, 29] },
        { text: "(Spokojny głos... ale co kryje się pod spodem? Jakie ma zamiary?)", corruption: [0,29], requiresFlag: 'player_attempted_calm_summon' },
        { text: "(Ta władczość w jego głosie... nie powinnam lubić jak to brzmi, a jednak... coś we mnie drży.)", corruption: [10,29], requiresFlag: 'player_asserted_dominance_summon' },
        { text: "(On też nie wie co robi? To pocieszające i przerażające zarazem. Jesteśmy w tym razem?)", corruption: [0,29], requiresFlag: 'player_was_surprised_summon'},
        { text: "(Powiedział że jestem piękna... czemu to brzmiało inaczej niż komplementy na zajęciach? Bardziej... osobiście?)", corruption: [5,29], requiresFlag: 'player_charmed_summon'}
    ],
    1: [ 
        { text: "(Obserwuję każdy jego ruch. Muszę zrozumieć czego chce... i czego ja chcę.)", corruption: [30, 79], requiresFlag: 'academic_pride_completed' },
        { text: "(Pytał o akademię... może mogę go czymś zaimponować? Albo... może on chce mnie czegoś nauczyć?)", corruption: [35, 79], requiresFlag: 'discussed_academy' },
        { text: "(Jego dłonie... zastanawiam się jakie byłyby w dotyku. Ciepłe? Szorstkie? Delikatne?)", corruption: [40,79], requiresFlag: 'early_observations_completed'},
        { text: "(Wszystkie te książki... a ja wciąż nie wiem jak się przy nim zachować. Może powinnam po prostu... być sobą? Tylko kim ja jestem?)", corruption: [35,79], requiresFlag: 'academic_pride_completed'}
    ],
    2: [ 
        { text: "(Ten chaos w mojej głowie gdy na mnie patrzy... to nie było w żadnym podręczniku. To... ekscytujące.)", corruption: [80, 179], requiresFlag: 'vocal_breakthrough_dialogue_completed'},
        { text: "(Jego dotyk zostawia ślady na mojej skórze. Niewidzialne, ale czuję je godzinami. Chcę ich więcej.)", corruption: [90, 179], requiresFlag: 'first_touch_tension_completed'},
        { text: "(Może powinnam spróbować czegoś... spontanicznego? Co najgorszego może się stać? Że mu się spodoba?)", corruption: [100, 179], requiresFlag: 'vocal_breakthrough_dialogue_completed' },
        { text: "(Czy on wie jak bardzo go pragnę? Czy to widać? Czy słychać w moich myślach?)", corruption: [120,179], requiresFlag: 'lilith_vocal_system_unlocked'}, 
    ],
    3: [
        { text: "(Jego zapach... czuję go nawet gdy go nie ma. To mnie rozprasza i... podnieca.)", corruption: [180, 349], requiresFlag: 'first_real_kiss_completed' },
        { text: "(Każdej nocy śnię o jego rękach, ustach... Budzę się... niezaspokojona i mokra.)", corruption: [200, 349], requiresFlag: 'dream_confession_completed' },
        { text: "(Co by powiedział profesor Luxuria widząc mnie teraz? Pewnie byłby dumny... albo zazdrosny.)", corruption: [220, 349], requiresFlag: 'first_real_kiss_completed' },
    ],
    4: [
        { text: "(Więź esencji... czuję go nawet teraz. Jego emocje, pragnienia... wszystko. To jakbyśmy byli jednym.)", corruption: [350,549], requiresFlag: 'essence_connection_established'},
        { text: "(Jestem uzależniona. Od jego dotyku, głosu, samej obecności. Od niego.)", corruption: [380,549], requiresFlag: 'sexual_exploration_gentle_completed'},
        { text: "(Może czas pokazać mu czego nauczyłam się... praktykując sama, myśląc o nim?)", corruption: [400,549], requiresFlag: 'first_petting_completed'},
    ],
    5: [
        { text: "(Jego reakcje... są takie... interesujące. Podoba mi się to uczucie władzy, jakie daje mi jego pożądanie. I moja uległość wobec niego.)", corruption: [550,799], requiresFlag: 'morning_surprise_completed' }, 
        { text: "(Czy on naprawdę rozumie, czego chcę? Czy muszę być bardziej... bezpośrednia? Tak, muszę.)", corruption: [580,799], requiresFlag: 'breaking_point_true_desire_completed' } 
    ],
    6: [
        { text: "(Wiem, czego chcę. I wiem, jak to zdobyć. On będzie mój, ciałem i duszą.)", corruption: [800, 1099], requiresFlag: 'first_anal_sex_milestone_completed' },
        { text: "(Poddaj mi się. Poczuj moją moc. Pragnij mnie tak, jak ja pragnę ciebie... albo i bardziej. Nie ma już granic.)", corruption: [850,1099], requiresFlag: 'dominant_demand_completed' }
    ],
    7: [
        { text: "(Nie ma już odwrotu. I nie chcę go. Jestem tym, kim miałam być. Twoją doskonałą, wyuzdaną sukkubą, kochanką, boginią.)", corruption: [1100,1999], requiresFlag: 'complete_corruption_love_completed' },
        { text: "(Każda moja komórka płonie dla ciebie. Jesteś moim wszystkim. Moim przeznaczeniem.)", corruption: [1200,1999], requiresFlag: 'perfect_union_event_completed' }
    ],
    8: [
        { text: "(Rzeczywistość to tylko płótno dla moich pragnień... i twoich, Mistrzu. Razem stworzymy nasz własny raj... lub piekło.)", corruption: [2000,10000], requiresFlag: 'lilith_is_arch_succubus' },
        { text: "(Czuję, jak sama tkanka istnienia drży pod moją mocą... To upajające. A ty jesteś źródłem tej mocy.)", corruption: [2100,10000], requiresFlag: 'lilith_is_arch_succubus' }
    ]
};

export const additionalThoughts = {
    sexualThoughts: [
        "(Jego smak... mogłabym się od niego uzależnić.)",
        "(Czy on wie, że gdy tak na mnie patrzy, zapominam całą łacinę?)",
        "(Teoretycznie wiem co robić... praktycznie drżą mi ręce.)",
        "(Każdy jego dotyk to jak mała eksplozja w mojej głowie.)",
        "(To lepsze niż wszystkie symulacje w akademii razem wzięte.)"
    ],
    postIntimacyThoughts: [
        "(Wciąż czuję go na sobie... w sobie... wszędzie.)",
        "(Czy to normalne, że chcę więcej już teraz?)",
        "(Moje ciało pamięta każdy jego dotyk. To fascynujące... i uzależniające.)",
        "(Teraz rozumiem czemu inne sukkuby były tak obsesyjne na punkcie swoich ludzi.)",
        "(On jest mój. Tylko nie wiem czy to ja go posiadam, czy on mnie.)"
    ]
};

// ZMIANA: Użycie wartości z konfiguracji
export const essenceReactions = [
    { threshold: BALANCE_MODIFIERS.essenceReactions[0].threshold, text: "Twoja obecność jest niemal namacalna... emanuje z ciebie niezwykła siła." },
    { threshold: BALANCE_MODIFIERS.essenceReactions[1].threshold, text: "Czuję, jak twoja energia rośnie... to intrygujące." },
    { threshold: BALANCE_MODIFIERS.essenceReactions[2].threshold, text: "Coś się w tobie zmienia... czuję to." }
];

export const upgradeReactions = {
    'passive_essence_1': "Ten 'Ponętny Widok'... czuję delikatny, stały przepływ energii. To... przyjemne.",
    'passive_essence_2': "Ten 'Ołtarz Rozkoszy'... jego moc jest znacznie silniejsza. Zaczynasz mnie zadziwiać, śmiertelniku.",
    'charm_scroll_1': "Ta 'Sztuka Subtelnej Perswazji'... czuję, jak moje słowa nabierają nowej mocy. Ciekawa jestem, jak to wykorzystamy.",
    'purity_chance_1': "Ta 'Alchemia Pożądania'... wibruje dziwną energią. Jakby balansował na krawędzi światła i cienia, czystości i grzechu."
};

export const darkEssenceReactions = {
    'nest_bed_1_purchased': "To posłanie... pachnie domem. Dziękuję, że o mnie dbasz.",
    'nest_dark_altar_1_purchased': "Ten ołtarz... czuję jak przyciąga mroczną energię. To ekscytujące.",
    'nest_decor_skulls_purchased': "Czaszki? Ktoś tu ma gotyckie zapędy... Podoba mi się.",
    'dark_gift_shadow_kiss': "Pocałunek Otchłani... brzmi jak nazwa koktajlu w barze dla demonów. Ale czuję jego moc.",
    'ritual_shadow_bond': "Więzy Cienia... czuję jak nasze dusze splatają się jeszcze mocniej."
};