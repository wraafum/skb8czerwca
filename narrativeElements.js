// narrativeElements.js
import {
    addPlayerChoiceFlag,
    setLilithName,
    setLilithStage,
    setEssenceGenerationUnlocked,
    setInitialInteractionCompleted,
    setUpgradeUnlocked,
    setLilithBecameVocal,
    setResearchProjectUnlocked,
    setLilithThoughtsOverride,
    addCompletedDialogue, // POPRAWKA: Zaimportowano brakującą funkcję
    setSexualPreferenceUnlocked // POPRAWKA: Dodano import brakującej funkcji
} from './stateUpdaters.js';
import * as ui from './uiUpdates.js';

export const dialogues = [
    {
        id: 'summoning_ritual',
        title: 'Rytuał Przyzwania',
        stageRequired: 0,
        narrativeStage: 0,
        essenceCost: 0,
        isEvent: true, isBreakingPoint: true,
        text: (gs) => "Krąg przywołań wciąż dymi, a powietrze gęstnieje. W centrum światło pulsuje, formując sylwetkę od dołu do góry, jakby rzeźbiło ją z mroku i pragnienia. Najpierw pojawia się zarys bioder, nienaturalnie idealny. Potem długie nogi, zakończone stopami, które zdają się ledwo muskać kamienną posadzkę. Jej skóra lśni w półmroku, gładka jak polerowany obsydian. Dopiero na końcu materializują się skrzydła – nie anielskie, a skórzaste, napięte na delikatnych kościach, rozwijające się z cichym, suchym szelestem. W powietrzu unosi się zapach ozonu, kadzidła i czegoś słodkiego, niemal jadalnego. Gdy mgła opada, widzisz ją w całości – idealnie nagą. To ciało młodej sukkubicy w pełni jej mocy i niewinności zarazem; smukła talia, gładka, pozbawiona skaz skóra i biust, który wydaje się być arcydziełem samego pożądania. Dwie idealnie kształtne, jędrne piersi, zwieńczone sterczącymi, różowymi brodawkami, drgają lekko od chłodu innego wymiaru lub od szoku samego istnienia. Stoi przed tobą przez jedno uderzenie serca, doskonała i bezbronna, zanim demoniczna magia nie utka wokół niej prostego, ciemnego stroju. Przez ułamek sekundy jej oczy są szeroko otwarte ze zdziwienia, a potem szybko mrużą się w wyćwiczonej pozie wyniosłości.",
        options: [
            { id: 'sr_calm', text: "Jestem tym, który cię wezwał. Możesz czuć się bezpiecznie.", response: "Unosi podbródek, choć zauważasz jak jej ogon owija się wokół własnej kostki - gest zdradzający niepokój. 'Bezpiecznie? Cóż...' przerywa, jakby szukała odpowiednich słów. 'Wiem co się dzieje. Przyzwanie, pakt, wymiana esencji... Znam teorię.' Jej głos jest melodyjny, ale słyszysz w nim nutę niepewności. 'Jestem Lilith. I... tak, jestem tu z tobą. Chyba.'", corruption: 15, darkEssence: 5, setsFlag: 'player_attempted_calm_summon', onSelected: () => { setLilithThoughtsOverride("(Jego głos jest... spokojny..."); setLilithName("Lilith"); } },
            { id: 'sr_dominant', text: "Na kolana, demonie. Zostałaś przyzwana by mi służyć.", response: "Jej oczy błyskają gniewem, ale ciało instynktownie drga, jakby chciało się podporządkować. 'Ja... Co?!' Walczy z impulsem przez moment, jej duma ściera się z demoniczną naturą. 'Nie jestem zwykłym demonem! Jestem...' przerywa, gdy jej kolana mimowolnie uginają się. 'To nie fair! W akademii mówili, że będę mieć wybór!' Patrzy na ciebie spode łba, mieszanina buntu i... czegoś jeszcze w jej spojrzeniu.", corruption: 15, darkEssence: 12, setsFlag: 'player_asserted_dominance_summon', onSelected: () => { setLilithThoughtsOverride("(Czuję jak moje ciało chce się podporządkować..."); setLilithName("Lilith"); } },
            { id: 'sr_charming', text: "Wybacz zamieszanie. Nie codziennie spotyka się tak piękną istotę.", response: "Mruga zaskoczona, a na jej policzkach pojawia się delikatny rumieniec. 'P-piękną? Ja?' Prostuje się dumnie, odzyskując część pewności siebie. 'Oczywiście że jestem! To znaczy... wiem, że jestem. Profesor Charm & Seduction zawsze to powtarzał.' Uśmiecha się nieśmiało, bawiąc się kosmykiem włosów. 'Ty też jesteś... to znaczy, dla człowieka... Ugh, dlaczego to jest takie trudne?!' Ostatnie słowa wymyka się jej przypadkowo.", corruption: 15, darkEssence: 7, setsFlag: 'player_charmed_summon', onSelected: () => { setLilithThoughtsOverride("(Powiedział, że jestem piękna..."); setLilithName("Lilith"); } },
            { id: 'sr_confused_player', text: "Cholera... to naprawdę zadziałało? Kim jesteś?", response: "Patrzy na ciebie z mieszaniną niedowierzania i irytacji. 'Czekaj, ty nie wiesz co robisz?!' Jej perfekcyjna poza załamuje się. 'Świetnie! Po prostu świetnie! Moje pierwsze przyzwanie i trafiam na amatora!' Krzyżuje ramiona, ale po chwili jej wyraz twarzy łagodnieje. 'Jestem Lilith. Sukkub. Właśnie mnie przyzwałeś, więc... gratulacje? Chyba oboje musimy się teraz jakoś dogadać.'", corruption: 15, darkEssence: 4, setsFlag: 'player_was_surprised_summon', onSelected: () => { setLilithThoughtsOverride("(On jest równie zagubiony co ja..."); setLilithName("Lilith"); } }
        ],
        onComplete: (gs, gameDefs) => {
            setEssenceGenerationUnlocked(true);
            setInitialInteractionCompleted(true);
            addPlayerChoiceFlag('summoning_ritual_completed');
            addCompletedDialogue('summoning_ritual');

            const newStage = Math.min(1, gameDefs.lilithStages.length - 1);
            if (gs.lilithStage < newStage) {
                setLilithStage(newStage);
                ui.showCustomAlert(`Lilith osiągnęła nowy etap: ${gameDefs.lilithStages[gs.lilithStage].name}!`);
                ui.markLilithDisplayDirty();
                ui.markDialoguesDirty();
                ui.markUpgradesDirty();
                ui.markResearchDirty();
            }

            setUpgradeUnlocked('essence_boost_1', true);
            setResearchProjectUnlocked('rp_basic_essence_upgrades', true);

            setTimeout(() => { setLilithThoughtsOverride(null); }, 13000);
        }
    },
    // ... reszta pliku pozostaje bez zmian ...
    {
        id: 'academic_pride',
        title: 'Duma Akademicka',
        stageRequired: 0,
        narrativeStage: 1,
        essenceCost: 10,
        condition: (gs) => gs.completedDialogues.includes('summoning_ritual'),
        text: (gs) => "...'Wiesz co? Może ci się wydaje, że jestem tylko jakimś przypadkowym demonem, ale ja skończyłam Akademię Infernalną z wyróżnieniem!' Mówiąc to, wypina dumnie pierś, a jej kręgosłup prostuje się jak struna. Gdy jest tak napiętka, jej sutki stają się widoczne przez cienki materiał jej stroju. Jej ciało krzyczy o uznanie. Jednak jej ogon, jakby miał własny umysł, zdradza jej zdenerwowanie, wijąc się niespokojnie przy jej kostce.",
        options: [
            { id: 'ap_impressed', text: "To imponujące. Czego tam uczą przyszłe sukkuby?", response: "Jej oczy rozjaśniają się z entuzjazmem. 'O, wszystkiego! Teoria uwodzenia, anatomia śmiertelników, zarządzanie esencją...' Zaczyna wyliczać na palcach. 'Miałam najlepsze oceny z \"Praktycznych zastosowań dotyku\", \"Psychologii pożądania\" i... i...' Nagle się zacina, rumieniąc. 'No i z innych przedmiotów. Bardzo praktycznych. Które znam. Teoretycznie.'", corruption: 20, darkEssence: 5, setsFlag: 'discussed_academy' },
            { id: 'ap_tease', text: "Teoria to jedno, a praktyka to drugie. Jak ci idzie ta druga?", response: "Zaciska pięści, jej policzki płoną. 'P-praktyka?! Oczywiście że mam doświadczenie! Mnóstwo!' Unika twojego wzroku. 'Po prostu... wolę najpierw dokładnie przeanalizować sytuację. To profesjonalne podejście! Nie rzucam się od razu na... to znaczy, do... Wiesz co? Nieważne!' Odwraca się gwałtownie, ale słyszysz jak mamrocze: 'Głupi przyzywacz z głupimi pytaniami...'", corruption: 20, darkEssence: 8, setsFlag: 'discussed_academy', setsFlagSecondary: 'teased_about_experience' }
        ]
    },
    {
        id: 'early_observations',
        title: 'Pierwsze Spojrzenia',
        stageRequired: 1,
        narrativeStage: 1,
        essenceCost: 25,
        condition: (gs) => gs.completedDialogues.includes('academic_pride'),
        text: (gs) => "Lilith kręci się niespokojnie, a ty po prostu patrzysz. Twoje spojrzenie zdaje się fizycznie na niej ciążyć. Widzisz, jak pod cienkim materiałem jej stroju poruszają się mięśnie jej pleców. Obserwujesz delikatne drganie koniuszka jej ogona. Śledzisz wzrokiem linię jej szyi, zastanawiając się, jaka w dotyku jest jej skóra. Ona to czuje. Gdy się zbliżasz, prostuje się gwałtownie... 'Och, to ty. Znowu.'",
        options: [
            { id: 'eo_stare', text: "(Patrz na nią intensywnie, nie przerywając kontaktu wzrokowego)", response: "Jej policzki płoną. \"C-co ty wyprawiasz?! To bardzo niegrzeczne!\" Próbuje odwzajemnić spojrzenie, ale po chwili kapituluje. \"W podręczniku 'Dominacja Wzrokiem' pisali, że to JA mam hipnotyzować! A ty po prostu stoisz i wygrywasz!\" Przerywa, przygryzając wargę. \"Przestań, bo zaraz coś zrobię! Nie wiem co, ale na pewno będzie drastyczne!\"", corruption: 8, darkEssence: 2, setsFlag: 'player_stared_intensely' },
            {
                id: 'eo_fascinate',
                text: "Przepraszam, jeśli cię niepokoję. Po prostu mnie fascynujesz.",
                response: (gs) => {
                    if (gs.playerChoiceFlags.includes('hasCharmScroll')) {
                        return "Mruga zaskoczona, a jej wzrok łagodnieje jeszcze bardziej niż poprzednio. 'F-fascynuję? Ja?' Nerwowo bawi się końcówką ogona. 'To... to bardzo miłe. Nikt nigdy nie użył takiego słowa. Zwykle chcą tylko... no wiesz.' Uśmiecha się nieśmiało. 'Dziękuję. To sprawia, że czuję się... inaczej.'";
                    }
                    return "Mruga zaskoczona. \"F-fascynuję? Ja?\" Nerwowo bawi się końcówką ogona. \"To znaczy, oczywiście że fascynuję! Jestem sukkubem! To moja praca!\" Ale jej głos mięknie. \"Chociaż nikt nigdy tego tak nie ujął. Zwykle mówią 'pożądam cię' albo 'chcę cię posiąść'. Fascynacja brzmi jakbyś chciał mnie studiować, nie wykorzystać.\"";
                },
                corruption: 8,
                darkEssence: (gs) => gs.playerChoiceFlags.includes('hasCharmScroll') ? 3 : 1,
                setsFlag: 'player_showed_fascination'
            },
            { id: 'eo_stop_staring', text: "Mogę przestać patrzeć, jeśli ci to przeszkadza.", response: "\"Nie! To znaczy, rób co chcesz. To twoje przyzwanie, twoje zasady.\" Krzyżuje ramiona, ale kątem oka zerka czy faktycznie odwróciłeś wzrok. \"Tylko się zastanawiam. Czy patrzysz bo planujesz coś złego? Czy może po prostu ci się podobam? Bo jeśli to drugie, to mam konflikt interesów.\"", corruption: 8, darkEssence: 0, setsFlag: 'player_offered_to_stop_staring' }
        ],
        onComplete: (gs, gameDefs) => {
            addPlayerChoiceFlag('early_observations_completed');
        }
    },
    {
    id: 'shared_interest_grimoire_secrets',
    title: 'Wspólne Zainteresowanie: Sekrety Grimuaru',
    stageRequired: 1,
    narrativeStage: 1,
    essenceCost: 20,
    darkEssenceCost: 0,
    isSexual: false,
    isEvent: true,
    condition: (gs) => gs.completedDialogues.includes('early_observations'),
    text: (gs) => "Lilith z wypiekami na twarzy wertuje gruby, oprawiony w skórę tom, który znalazła w Twojej kolekcji. To rzadki grimuar o sztuce demonicznego uwodzenia. Jej oczy błyszczą pasją i niekłamaną ciekawością. \"Mistrzu! Ta księga! To prawdziwy skarb! 'Siedem Kręgów Rozkoszy i Perswazji'! Myślałam, że to tylko legenda! Analizowaliśmy fragmenty na zajęciach z Zaawansowanej Manipulacji, ale nigdy nie widziałam pełnego tekstu! Niektóre techniki są absolutnie genialne w swej prostocie! Czy Ty je stosowałeś?\"",
    options: [
        {
            id: 'sgs_analyze_together',
            text: "(\"Niektóre zasady są ponadczasowe, Lilith. Może przeanalizujemy kilka najbardziej obiecujących fragmentów razem? Chętnie poznam opinię ekspertki.\"",
            response: "Klaszcze w dłonie z autentycznym entuzjazmem, a jej skrzydła lekko drgają. \"Ekspertki! Och, jeszcze nie, ale pracuję nad tym wytrwale!\" Jej oczy błyszczą, gdy przysuwa się bliżej, a Ty czujesz ciepło emanujące od jej ciała. \"Który rozdział fascynuje Cię najbardziej? Ten o 'Więziach Szeptanych w Półmroku' czy może 'Dotyk, który Łamie Wolę'? Który rozdział kusi Cię najbardziej? Ten o 'Więziach Szeptanych w Półmroku' czy może 'Dotyk, który Łamie Wolę'? Och, musimy to *wypróbować*! Natychmiast! Czuję, jak te słowa już działają...\" Wskazuje palcem na zdobiony fragment w księdze, niemal wibrując z ekscytacji.",
            corruption: 15,
            darkEssence: 5,
            onSelected: () => {
                addPlayerChoiceFlag('grimoire_shared_interest');
            }
        },
        {
            id: 'sgs_joke_about_it',
            text: "(\"Traktuję to raczej jako historyczną ciekawostkę. Nie sądziłem, że ktoś jeszcze podchodzi do tego z takim zapałem. Ale widzę, że to Twoja prawdziwa pasja.\"",
            response: "Prostuje się dumnie, a w jej oczach zapala się ogień. \"Pasja? Mistrzu, to jest sztuka. Najwyższa forma ekspresji i interakcji! Jestem jej oddana bez reszty.\" Jej głos nabiera głębi. \"A Ty powinieneś czuć się zaszczycony, mając u swego boku entuzjastkę gotową zgłębiać wszelkie jej aspekty.\" Puszcza do Ciebie prowokacyjne oko, a kącik jej ust unosi się w wyzywającym uśmiechu.",
            corruption: 10,
            darkEssence: 2
        },
    ]
},
    {
        id: 'first_night_talk',
        title: 'Nocne Niespokojności',
        stageRequired: 1,
        narrativeStage: 1,
        essenceCost: 40,
        condition: (gs) => gs.completedDialogues.includes('early_observations'),
        text: (gs) => "Jest późno. Znajdujesz Lilith siedzącą skuloną w kącie, otulona skrzydłami jak kocem. Gdy się zbliżasz, unosi głowę - jej oczy błyszczą w ciemności.\n\"Nie mogę spać.\" Mówi cicho. \"W akademii spałyśmy w dormitorium. Było głośno, pełno innych sukkubów syczących i chichotających. Tu jest cicho. Za cicho. Słyszę własne myśli.\"",
        options: [
            { id: 'fnt_stay', text: "Mogę zostać z tobą...", response: "Jej oczy rozszerzają się na moment, zanim spuści wzrok. 'Jeśli... jeśli chcesz. Może wtedy te myśli... ucichną.' Przesuwa się nieznacznie, robiąc ci miejsce.", corruption: 10, darkEssence: 1, setsFlag: 'player_stayed_with_lilith_night'},
            { id: 'fnt_silent_presence', text: "(Usiądź obok niej w milczeniu...)", response: "Przez długą chwilę nic nie mówi, tylko wpatruje się w przestrzeń. Po chwili czujesz, jak jej skrzydło delikatnie muska twoje ramię. 'Dziękuję.' szepcze ledwo słyszalnie.", corruption: 10, darkEssence: 2, setsFlag: 'player_offered_silent_comfort'}
        ],
        onComplete: (gs, gameDefs) => { 
            setUpgradeUnlocked('nest_bed_upgrade_1', true);
        }
    },
    {
        id: 'curious_about_summoner',
        title: 'Ciekawskie Pytania o Ciebie',
        stageRequired: 1,
        narrativeStage: 1,
        essenceCost: 45,
        condition: (gs) => gs.completedDialogues.includes('first_night_talk') && gs.lilithStage >= 1 && !gs.completedDialogues.includes('curious_about_summoner'),
        text: (gs) => "Lilith podchodzi do ciebie z determinacją kogoś, kto zbierał się na odwagę przez ostatnią godzinę. W rękach trzyma mały notes.\n\"Mam pytania!\" oznajmia, machając notesem. \"Jako sukkub powinam znać swojego partnera. To część programu nauczania! Więc kim jesteś? Czym się zajmujesz poza przyzywaniem demonów? I dlaczego akurat sukkub?\"",
        options: [
            { id: 'cas_who_are_you', text: "Jestem kimś, kto bardzo chciał cię poznać...", response: "Rumieni się gwałtownie, ale jej oczy błyszczą ciekawością. 'Mnie? Dlaczego akurat mnie? Jest tyle innych... potężniejszych demonów.' Zapisuje coś szybko w notesie.", corruption: 12, darkEssence: 3, setsFlag: 'player_answered_about_self_charmingly' },
            { id: 'cas_what_do_you_like', text: "A co TY lubisz robić, poza studiowaniem podręczników?", response: "Zastyga. \"Co ja lubię?\" Powtarza jakby pierwszy raz usłyszała to pytanie. 'Ja... lubię czytać. Romanse. Te zakazane, o miłości między demonami a śmiertelnikami. Nie mów nikomu!' Szepcze konspiracyjnie.", corruption: 12, darkEssence: 2, setsFlag: 'lilith_revealed_reading_romances' }
        ]
    },
    {
        id: 'first_meal_together',
        title: 'Pierwsza Wspólna Kolacja',
        stageRequired: 1,
        narrativeStage: 1,
        essenceCost: 70,
        condition: (gs) => gs.completedDialogues.includes('curious_about_summoner') && !gs.completedDialogues.includes('first_meal_together'),
        text: (gs) => "Przygotowałeś posiłek dla was obojga. Lilith siedzi naprzeciwko, wpatrując się w talerz z naukową fascynacją.\n\"W akademii jedliśmy esencję emocjonalną podawaną w krystalicznych fiolkach.\" Dźga widelcem jedzenie. \"To jest dziwaczne. Solidna materia. Ale pachnie intrygująco.\"",
        options: [
            { id: 'fmt_feed_her', text: "Mogę cię nakarmić, jeśli nie wiesz jak zacząć.", response: "\"N-nakarmić?! Jak dziecko?!\" Jej protest jest głośny, ale nie odsuwa się gdy podnosisz widelec. \"To kompletnie niestosowne i och mój boże to jest pyszne!\" Otwiera usta na kolejny kęs. \"Jeszcze! Znaczy, tylko dla celów badawczych. Muszę poznać ludzkie zwyczaje żywieniowe.\"", corruption: 18, darkEssence: 5, setsFlag: 'player_fed_lilith' },
            { id: 'fmt_enjoy_food', text: "Jedzenie to przyjemność, nie tylko paliwo. Delektuj się.", response: "Bierze ostrożny kęs, potem większy. \"Przyjemność,\" powtarza zamyślona. \"W akademii przyjemność była narzędziem do kontrolowania innych.\" Oblizuje widelec. \"Ale to jest przyjemne samo w sobie. Bez celu. Bez manipulacji.\" Patrzy na ciebie podejrzliwie. \"Uczysz mnie złych rzeczy. Lubię to.\"", corruption: 18, darkEssence: 3, setsFlag: 'lilith_enjoyed_food_pleasure' }
        ]
    },
    {
        id: 'first_touch_tension',
        title: 'Pierwsze Napięcie (Przełomowe)',
        stageRequired: 1,
        narrativeStage: 1,
        essenceCost: 50,
        isBreakingPoint: true,
        condition: (gs) => gs.lilithStage >= 1 && !gs.completedDialogues.includes('first_touch_tension') &&
            gs.completedDialogues.includes('academic_pride') && 
            gs.completedDialogues.includes('early_observations') &&
            gs.completedDialogues.includes('first_night_talk') &&
            gs.completedDialogues.includes('curious_about_summoner') &&
            gs.completedDialogues.includes('first_meal_together'),
        text: (gs) => "Siedzicie blisko siebie. Może zbyt blisko - czujesz ciepło emanujące od jej skóry, delikatny zapach przypominający kadzidło i coś słodkiego. Lilith udaje, że czyta jakiś zwój, który zmaterializowała, ale widzisz jak co chwilę zerka na twoją dłoń leżącą blisko jej uda. Jej oddech jest płytszy niż zwykle.",
        options: [
            { 
                id: 'ftt_subtle', 
                text: "Delikatnie musnąć palcami jej dłoń, jakby przypadkiem.", 
                response: "Wzdryga się, ale nie cofa ręki. 'C-co ty...' zaczyna, ale głos jej się załamuje. Patrzysz jak gęsia skórka pokrywa jej ramię. 'To był... przypadek, prawda?' pyta, choć w jej głosie słychać nadzieję, że może jednak nie. Jej palce drżą lekko, jakby walczyła ze sobą czy odwzajemnić dotyk. 'W podręczniku pisali, że pierwszy kontakt fizyczny jest kluczowy dla... dla...' Milknie, gubiąc wątek.", 
                corruption: 25, 
                darkEssence: 6, 
                sexualPreferenceTag: 'vanilla', 
                onSelected: () => { addPlayerChoiceFlag('first_touch_subtle_chosen'); } 
            },
            { 
                id: 'ftt_bold', 
                text: "Położyć pewnie dłoń na jej udzie.", 
                response: "Jej oddech urywa się gwałtownie. 'Oh!' Zwój wypada jej z rąk i znika w obłoczku dymu. Patrzy na twoją dłoń jak zahipnotyzowana. 'To jest... Twoja ręka jest taka ciepła...' Jej skrzydła mimowolnie rozchylają się lekko - gest, którego sama nie jest świadoma. 'Czytałam, że dotyk może wywoływać kaskadę reakcji neurologicznych, ale...' przełyka ślinę, 'ale nie spodziewałam się że to będzie TAK intensywne.'", 
                corruption: 25, 
                darkEssence: 12, 
                setsFlag: 'bold_first_touch', 
                sexualPreferenceTag: 'vanilla', 
                onSelected: () => { addPlayerChoiceFlag('first_touch_bold_chosen'); } 
            }
        ],
        onComplete: (gs, gameDefs) => {
            addPlayerChoiceFlag('first_touch_tension_completed');
            const newStage = Math.min(2, gameDefs.lilithStages.length - 1);
            if (gs.lilithStage < newStage) {
                setLilithStage(newStage);
                ui.showCustomAlert(`Lilith osiągnęła nowy etap: ${gameDefs.lilithStages[gs.lilithStage].name}!`);
                ui.markLilithDisplayDirty();
                ui.markDialoguesDirty();
                ui.markUpgradesDirty();
                ui.markResearchDirty();
            }
        }
    },
    // --- Narrative Stage 2 ---
    {
    id: 'found_liliths_private_notebook',
    title: 'Scenariusz Fantazji',
    stageRequired: 2,
    narrativeStage: 2,
    essenceCost: 0,
    darkEssenceCost: 0,
    isSexual: false,
    isEvent: true,
    text: (gs) => "Pod stertą jej rzeczy znajdujesz mały notatnik. Jest inny niż się spodziewałeś - wygląda jak scenariusz filmowy, gdzie każda strona to nowa scena. 'SCENA 17: SYPIALNIA - NOC. LILITH (ubrana w jego koszulę) podchodzi do śpiącego MISTRZA. Pochyla się, jej włosy muskają jego policzek. LILITH (szeptem): Obudź się. Mam dla ciebie prezent.' Przewracasz stronę. 'SCENA 21: ŁAZIENKA - PORANEK. MISTRZ bierze prysznic. LILITH wchodzi, 'przypadkowo' upuszczając ręcznik. Ich oczy spotykają się w zaparowanym lustrze.'",
    options: [
        {
            id: 'ffs_find_climax',
            text: "(Szukaj dalej. Musisz zobaczyć, jak kończą się te sceny)",
            response: "Przewracasz kartki, aż Twoje palce zatrzymują się na stronie z jednym, wytłuszczonym słowem: 'FINAŁ'. Poniżej nie ma już dialogu. Jest tylko ściana tekstu, gęsta i chaotyczna, jakby pisana w gorączce. To strumień świadomości, zapis czystych, fizycznych doznań. Czytasz o paznokciach, które wgryzają się w plecy, zostawiając krwawe półksiężyce. O zębach zaciskających się na ramieniu, by stłumić krzyk. O ciałach, które 'miażdżą' się nawzajem, desperacko próbując stać się jednym. Słowo 'błaga' powtarza się w kontekście zarówno bólu, jak i rozkoszy. 'Eksplozja' nie jest triumfem, a gwałtownym, bolesnym uwolnieniem, po którym następuje cisza i smak soli na ustach. To nie jest fantazja o miłości. To jest zapis głodu tak wielkiego, że graniczy z samozniszczeniem. Zamykasz notatnik, a Twoje dłonie lekko drżą. Poczułeś nie tylko jej pożądanie, ale też jej głęboką, mroczną samotność.",
            corruption: 40,
            darkEssence: 15,
            onSelected: () => {
                addPlayerChoiceFlag('notebook_saw_the_fantasies');
            }
        },
        {
            id: 'ffs_act_out_a_scene',
            text: "(Zapamiętaj jedną ze scen. Odegrasz ją, gdy wróci, słowo w słowo)",
            response: "Wybierasz scenę. Tę o upuszczonym ręczniku. Uczysz się jej na pamięć. Każdego słowa, każdego gestu. Odkładasz notatnik, a w Twojej głowie rodzi się plan. Gdy wróci, odegrasz jej najskrytszą fantazję. Ciekawe jak zachowa się, gdy jej wyimaginowany świat stanie się rzeczywistością.",
            corruption: 35,
            darkEssence: 25,
            onSelected: () => {
                addPlayerChoiceFlag('notebook_will_act_out_scene');
            }
        }
    ]
},
    {
        id: 'accidental_sensitivity', 
        title: 'Przypadkowe Odkrycie Czułości Skrzydeł',
        stageRequired: 2, 
        narrativeStage: 2, 
        essenceCost: 60,
        condition: (gs) => gs.lilithStage >= 2 && gs.playerChoiceFlags.includes('first_touch_tension_completed'),
        text: (gs) => "Pomagasz Lilith sięgnąć książkę z wysokiej półki. Gdy podajesz jej tom, twoje palce przypadkowo muskają podstawę jej skrzydła.\n\"AH!\" Książka wypada jej z rąk. Twarz ma czerwoną jak burak. \"T-ty dotknąłeś mojego!\" Przełyka ślinę, dysząc. \"Nikt mnie nie uprzedził że to będzie jak porażenie prądem połączone z czymś znacznie przyjemniejszym!\"",
        options: [
            { 
                id: 'as_apologize', 
                text: "Przepraszam! Nie chciałem. Zrobiłem ci krzywdę?", 
                response: "\"Krzywdę? Nie, to było dokładnie przeciwne do krzywdy.\" Wachluje się ręką. \"W anatomii sukkubów mówili o strefach erogennych, ale pominęli część o tym jak bardzo są erogeniczne!\" Patrzy na swoje skrzydła z nowym respektem. \"Może powinniśmy to dokładniej zbadać? Dla nauki! Muszę skatalogować reakcje!\"", 
                corruption: 30, 
                darkEssence: 8, 
                setsFlag: 'discovered_wing_sensitivity', 
                sexualPreferenceTag: 'vanilla' 
            },
            { 
                id: 'as_touch_again', 
                text: "(Delikatnie dotknij tego samego miejsca, obserwując reakcję)", 
                response: "Jej ciało drży. \"O-oh bogowie piekielni!\" Kolana się pod nią uginają, odruchowo chwyta się twojej koszuli. \"To jak tysiąc małych ogni tańczących po nerwach!\" Oddycha ciężko, źrenice ma rozszerzone. \"Nie przestawaj. Muszę zrozumieć tę reakcję. Czysto akademicko. Nawet jeśli zaraz zemdleję.\"", 
                corruption: 30, 
                darkEssence: 12, 
                setsFlag: 'explored_wing_sensitivity', 
                sexualPreferenceTag: 'vanilla' 
            }
        ] 
    },
    {
        id: 'dance_lesson', 
        title: 'Lekcja Tańca (i Pokusy)',
        stageRequired: 2, 
        narrativeStage: 2, 
        essenceCost: 75,
        condition: (gs) => gs.lilithStage >= 2 && gs.completedDialogues.includes('accidental_sensitivity'),
        text: (gs) => "(Obserwuje Cię z figlarnym uśmieszkiem, kiedy prezentujesz kilka kroków. Sama wykonuje je z przesadną, niemal parodystyczną gracją.) \n\"'Mistrzu, czyżbyś był trochę... sztywny?' Sukubica sama natychmiast złapała rytm, a kołysanie jej bioder stało się hipnotyzujące.\"",
        options: [
            { id: 'dl_teach_slow_dance', text: "Skup się na jej ruchach obserwując jej wdzięk", response: "(Zatrzymuje się na chwilę, pozwalając Twojemu wzrokowi błądzić po jej figurze. Delikatnie oblizuje wargi.) \"'Patrz, mistrzu, ale nie dotykaj, dobrze?'\" Droczy się ze mną. \"'Ten taniec podobno jest w stanie pobudzić każdego śmiertelnika, czy działa na Ciebie, mistrzu?'\" Nie wierzę, że nie zobaczyła mojej erekcji.\"", corruption: 25, darkEssence: 5, setsFlag: 'danced_with_lilith', sexualPreferenceTag: 'vanilla' },
            { id: 'dl_ask_succubus_dance', text: "Podejdź bliżej, tak by każdy taneczny ruch prowadził do ocierania się waszych ciał", response: "'Och!' \"(Zaskoczona, gdy się zbliżasz, ale nie cofa się; czujesz, jak jej biodra przypadkowo muskają Twoje)\" 'Czy... czy wszystkie ludzkie tańce są takie... kontaktowe? Bo jeśli tak, to chyba... chyba zaczynam je lubić.'\"", corruption: 25, darkEssence: 8, setsFlag: 'lilith_attempted_succubus_dance' }
        ]
    },
    {
        id: 'theory_vs_reality', 
        title: 'Teoria Kontra Rzeczywistość (Konfrontacja)',
        stageRequired: 2, 
        narrativeStage: 2, 
        essenceCost: 90,
        condition: (gs) => gs.lilithStage >= 2 && gs.playerChoiceFlags.includes('discussed_academy') && gs.completedDialogues.includes('dance_lesson'),
        text: (gs) => { let intro = "Lilith przegląda jakieś notatki, mamrocząc pod nosem. Nagle rzuca pergaminem o ścianę z frustracją."; if (gs.playerChoiceFlags.includes('teased_about_experience')) { intro += " 'Wszystko jest nie tak jak w podręcznikach!' wybucha. 'A ty... ty się ze mnie śmiałeś!'"; } else { intro += " 'To wszystko kłamstwo!' wybucha nagle. 'Wszystkie te podręczniki, wszystkie wykłady!'"; } return intro; },
        options: [
            { id: 'tvr_comfort', text: "Co cię tak zdenerwowało? Chodź, porozmawiajmy.", response: "Siada obok ciebie, wciąż naburmuszona. 'Uczyli nas, że wszystko będzie... mechaniczne. Przewidywalne. Krok A prowadzi do B, które wywołuje reakcję C.' Patrzy na swoje dłonie. 'Ale kiedy ty mnie dotykasz, to... to jakby ktoś zapalił ogień pod moją skórą. Kiedy na mnie patrzysz, zapominam wszystkich formułek.' Jej głos staje się cichszy. 'I najbardziej przeraża mnie to, że... podoba mi się ten chaos.'", corruption: 40, darkEssence: 10 },
            { id: 'tvr_challenge', text: "Może czas przestać polegać na książkach i zaufać instynktom?", response: "Patrzy na ciebie z mieszaniną irytacji i... czegoś jeszcze. 'Instynktom? Wiesz co moje instynkty mi mówią?' Wstaje gwałtownie, podchodząc bliżej. 'Mówią mi, żebym...' Zatrzymuje się tuż przed tobą, jej oddech przyspiesza. 'Żebym przestała myśleć i po prostu...' Jej ręka unosi się, jakby chciała cię dotknąć, ale zawisa w powietrzu. 'Nie. Nie mogę. Co jeśli zrobię coś źle? Co jeśli... co jeśli ci się nie spodoba?'", corruption: 40, darkEssence: 15, setsFlag: 'challenged_instincts' }
        ]
    },
    {
        id: 'probe_bdsm_interest',
        title: 'Granice Kontroli (Sondaż BDSM)',
        stageRequired: 2, 
        narrativeStage: 2, 
        essenceCost: 70,
        condition: (gs) => gs.lilithStage >= 2 && (!gs.sexualPreferences.bdsm || !gs.sexualPreferences.bdsm.unlocked) && !gs.playerChoiceFlags.includes('player_rejects_bdsm') && gs.completedDialogues.includes('theory_vs_reality'),
        text: (gs) => "Lilith przegląda jeden ze starych grimuarów, który przyniósłeś. Marszczy czoło. \"Te opisy... rytuałów dominacji i uległości... Są takie... surowe. W akademii wspominali o tym tylko teoretycznie, jako o skrajnych formach pozyskiwania esencji.\" Podnosi na ciebie wzrok, jej oczy są pełne ciekawości. \"Zastanawiam się... jak to jest naprawdę? Ta cała gra władzy, bólu i przyjemności... Czy to cię... pociąga?\"",
        options: [
            {
                id: 'pbi_express_interest',
                text: "\"Władza i uległość mogą być... potężnymi afrodyzjakami. Jest w tym pewna mroczna ekscytacja.\"",
                response: "Oczy Lilith rozszerzają się lekko, a na jej policzkach pojawia się delikatny rumieniec. \"Rozumiem... Tak, to może być... intensywne. Może kiedyś, gdy będę gotowa... i ty też... moglibyśmy zbadać te granice razem?\" Głos jej drży.",
                corruption: 10,
                darkEssence: 8,
                onSelected: (gs) => {
                    setSexualPreferenceUnlocked('bdsm', true);
                    addPlayerChoiceFlag('player_open_to_bdsm');
                }
            },
            {
                id: 'pbi_reject_interest',
                text: "\"To chyba nie dla mnie, Lilith. Wolę bardziej... czułe formy bliskości.\"",
                response: "Lilith kiwa głową, choć w jej oczach pojawia się cień zawodu, szybko jednak maskowany uśmiechem. \"Oczywiście, Mistrzu. Twoje preferencje są dla mnie najważniejsze. Czułość też potrafi być... upajająca.\"",
                corruption: 3,
                darkEssence: 1,
                setsFlag: 'player_rejects_bdsm'
            }
        ]
    },
    {
        id: 'academic_technique_fail', 
        title: 'Anatomia Porównawcza (i Zakłopotanie)',
        stageRequired: 2, 
        narrativeStage: 2, 
        essenceCost: 100,
        condition: (gs) => gs.lilithStage >= 2 && gs.completedDialogues.includes('probe_bdsm_interest'),
        text: (gs) => "Mistrzu... przeglądałam w nocy notatki z 'Anatomii Porównawczej Śmiertelników i Demonów Niższych' - i mam pewne pytanie. Więc w sekcji o reprodukcji... ach, po prostu zapytam. Czy to prawda, że Twój, znaczy! Wasz organ reprodukcyjny... znacząco zmienia i rozmiar i twardość, w zależności od stymulacji? W akademii mieliśmy różne modele, ale były one wyciosane w kryształach, statyczne...",
        options: [
            { id: 'atf_laugh', text: "(Wyjaśnij cierpliwie podstawy ludzkiej fizjologii erekcji)", response: "Ach, rozumiem. To... o wiele bardziej dynamiczne niż sądziłam. I mówisz, że dotyk... albo nawet odpowiednie słowa... mogą to wywołać? Fascynujące. Muszę to zanotować. Dziękuję za... demonstrację... to znaczy, wyjaśnienie. (Lilith studiuje nerwowo wzrokiem Twoje krocze)", corruption: 30, darkEssence: 5, setsFlag: 'laughed_at_technique' },
            { id: 'atf_play_along', text: "Mój organ regularnie rośnie na Twój widok.", response: "Dostrzegłeś uśmiech w oczach Sukkubicy - i zakłopotanie na jej twarzy. \"'Ach, no tak, to chyba... normalne zachowanie wśród ludzi, prawda?'\"", corruption: 30, darkEssence: 6, setsFlag: 'played_along_technique' }
        ]
    },
    {
        id: 'vocal_breakthrough_dialogue',
        title: '⭐ Przełom: Głos Myśli',
        stageRequired: 2,
        narrativeStage: 2,
        essenceCost: 80,
        darkEssenceCost: 15,
        isEvent: true,
        isBreakingPoint: true,
        condition: (gs) => gs.lilithStage >= 2 && gs.playerChoiceFlags.includes('first_touch_tension_completed') && !gs.playerChoiceFlags.includes('lilith_vocal_system_unlocked') &&
            gs.completedDialogues.includes('accidental_sensitivity') && 
            gs.completedDialogues.includes('dance_lesson') &&
            gs.completedDialogues.includes('theory_vs_reality') &&
            gs.completedDialogues.includes('probe_bdsm_interest') &&
            gs.completedDialogues.includes('academic_technique_fail'),
        text: (gs) => "Lilith podchodzi do Ciebie, jej spojrzenie jest bardziej intensywne niż zwykle. Przez chwilę milczy, jakby zbierała myśli.\n\"Mistrzu...\" zaczyna cicho, ale w jej głosie jest nowa nuta pewności. \"Przybyłam na Twoje zawołanie wystraszona, ale już się tu zadomowiłam. Mam ci wiele do powiedzenia, wiesz?\"",
        options: [
            {
                id: 'vb_encourage',
                text: "Mów, Lilith. Chcę usłyszeć wszystko, co kłębi się w Twojej głowie.",
                response: "Uśmiecha się lekko, a w jej oczach pojawia się błysk. \"Dobrze, Mistrzu. Skoro tego chcesz...\" Bierze głęboki wdech. \"Od teraz... będziesz wiedział. Och, będziesz wiedział aż za dobrze. Czasem nawet wtedy, gdybym wolała, żebyś nie wiedział.\" Jej głos drży lekko, mieszanka ekscytacji i niepewności.",
                corruption: 30,
                darkEssence: 10,
                onSelected: () => { 
                    setLilithBecameVocal(true);
                    addPlayerChoiceFlag('lilith_vocal_system_unlocked');
                }
            },
            {
                id: 'vb_cautious',
                text: "Mów sobie ile chcesz, ale pamiętaj, że nie oznacza to, że będę Cię słuchał.",
                response: "Przechyla głowę. \"T-tak... Mogłam się tego spodziewać\" Wzrusza ramionami. \"W zasadzie, nie przyzwałeś mnie tutaj, ze względu na swoją empatię - jestem tylko Twoją demoniczną lalką. Ale mogę być wygadaną lalką.\"",
                corruption: 30,
                darkEssence: 10,
                onSelected: () => { 
                    setLilithBecameVocal(true);
                    addPlayerChoiceFlag('lilith_vocal_system_unlocked');
                }
            }
        ],
        onComplete: (gs, gameDefs) => {
            const newStage = Math.min(3, gameDefs.lilithStages.length - 1);
            if (gs.lilithStage < newStage) {
                setLilithStage(newStage);
                ui.showCustomAlert(`Lilith osiągnęła nowy etap: ${gameDefs.lilithStages[gs.lilithStage].name}!`);
                ui.markLilithDisplayDirty();
                ui.markDialoguesDirty();
                ui.markUpgradesDirty();
                ui.markResearchDirty();
            }
        }
    },
    // --- Narrative Stage 3 ---
    {
        id: 'dream_confession', 
        title: 'Sen czy Jawa',
        stageRequired: 3, 
        narrativeStage: 3, 
        essenceCost: 100,
        condition: (gs) => gs.lilithStage >= 3 && !gs.completedDialogues.includes('dream_confession') && gs.playerChoiceFlags.includes('lilith_vocal_system_unlocked'),
        text: (gs) => "Lilith podchodzi do ciebie rano, wygląda na niewyspana i zdeterminowaną.\n\"Muszę coś wyznać.\" Nie patrzy ci w oczy. \"Śnił mi się sen. O tobie. Robiliśmy rzeczy.\" Jej policzki płoną. \"Obudziłam się cała mokra ze...\". Sukubica zakłopotała się własnym słownictwem, przygryzła język. \"Au!\"",
        options: [
            { id: 'dc_your_desires', text: "To nie moja magia. To twoje własne pragnienia, Lilith.", response: "Wygląda jakbyś uderzył ją podręcznikiem. \"M-moje pragnienia? Ale ja jestem sukkubem! My kontrolujemy pragnienia, nie odwrotnie!\" Siada ciężko.", corruption: 35, darkEssence: 7, setsFlag: 'lilith_confronted_with_desires' },
            { id: 'dc_i_dream_too', text: "Ja też o tobie śnię. Każdej nocy.", response: "Podnosi głowę gwałtownie. \"Też? O mnie? Co robimy w twoich snach?\" Przełyka ślinę. \"Nie, czekaj! Nie chcę wiedzieć! Albo chcę? Och, nienawidzę tego zamieszania!\" Wstaje i zaczyna krążyć. \"Jeśli oboje śnimy o sobie nawzajem, to według podręcznika oznacza albo prawdziwą więź albo zatrucie pokarmowe. Wolałabym to pierwsze.\"", corruption: 35, darkEssence: 10, setsFlag: 'shared_dream_experience' }
        ],
        onComplete: (gs, gameDefs) => {
            addPlayerChoiceFlag('dream_confession_completed');
        }
    },
    {
        id: 'hot_weather_tease', 
        title: 'Gorący Dzień, Gorętsze Myśli',
        stageRequired: 3, 
        narrativeStage: 3, 
        essenceCost: 120,
        condition: (gs) => gs.lilithStage >= 3 && !gs.completedDialogues.includes('hot_weather_tease') && gs.completedDialogues.includes('dream_confession'),
        text: (gs) => "Jest upalny dzień. Lilith wachluje się skrzydłami, jej skóra lśni od potu.\n\"Nie spodziewałam się, że ludzki świat będzie taki wilgotny.\" Rozpina górne guziki. \"W piekle był suchy żar. Tu czuję się jak w saunie.\" Zauważa twoje spojrzenie. \"Podoba ci się widok spoconej demonicy?\"",
        options: [
            { id: 'hwt_compliment', text: "Bardzo. Wyglądasz olśniewająco.", response: "Uśmiecha się świadoma swojej mocy. \"Wiem.\" Ale pewność siebie szybko topnieje. \"Znaczy, naprawdę? Nawet taka spocona i rozczochrana?\" Podchodzi bliżej. \"Bo wiesz, mogłabym wyglądać jeszcze lepiej gdybyś pomógł mi zdjąć resztę tych ciuchów. Bo jest trochę za gorąco, ok!?\"", corruption: 40, darkEssence: 15, setsFlag: 'complimented_sweaty_lilith', sexualPreferenceTag: 'vanilla' },
            { id: 'hwt_cold_drink', text: "(Przynieś jej zimny napój i przyłóż do czoła)", response: "Zamyka oczy gdy zimne szkło dotyka skóry. \"Mmm, tak dobrze.\" Ten jęk jest bardziej zmysłowy niż planowała. Otwiera jedno oko. \"Zawsze się o mnie troszczysz. To podejrzane. I miłe. I podniecające? Jestem zdezorientowana i rozpalona. Znaczy się, rozgrzana! Rozgrzana od pogody!\"", corruption: 40, darkEssence: 8, setsFlag: 'cared_for_lilith_hot_day' }
        ]
    },
    {
        id: 'mentor_visit', 
        title: 'Wizyta Mentorki (Wydarzenie Fabularne)',
        stageRequired: 3, 
        narrativeStage: 3, 
        essenceCost: 0, 
        isEvent: true,
        condition: (gs) => gs.lilithStage >= 3 && !gs.completedDialogues.includes('mentor_visit') && gs.completedDialogues.includes('hot_weather_tease'),
        text: (gs) => "Pewnego wieczoru, gdy atmosfera w waszym gniazdku jest wyjątkowo gęsta od mrocznej energii, w pomieszczeniu materializuje się druga postać. Wyższa od Lilith, o ostrych rysach i oczach płonących zimnym ogniem. Jej skrzydła są imponujące, a cała postawa emanuje władzą i wiekami doświadczenia.\n\"Lilith,\" głos jest jak jedwab przeciągany po ostrzu. \"Azazel unosi brew z powolnością lodowca. 'Najwyraźniej. Jej spojrzenie omija Lilith i ląduje na tobie, badawcze i zimne jak dotyk stali. 'Akademia jest... *rozczarowana* twoim brakiem postępów, Lilith. Wysyłasz nam strzępy esencji, podczas gdy twoje siostry zatapiają całe królestwa w rozpuście.'\" ",
        options: [
            { id: 'mv_lilith_defend', text: "placeholder -- (Lilith staje między tobą a mentorką) \"Mistrzyni Azazel! Nie spodziewałam się ciebie tutaj.\"", response: "Azazel unosi brew. \"Najwyraźniej. Twoje postępy, a raczej ich specyfika, dotarły nawet do moich komnat. Akademia jest... zaniepokojona twoim brakiem raportów i nietypowym rozwojem więzi.\" Jej spojrzenie wraca do ciebie. \"Powiedz mi, śmiertelniku, jak udało ci się tak... 'oswoić' jedną z naszych bardziej obiecujących, choć naiwnych, studentek?\"", corruption: 8, darkEssence: 5, setsFlag: 'mentor_visit_confrontation_started' },
            { id: 'mv_player_speak_calmly', text: "-  placeholder (Spokojnie) \"Witaj. Lilith jest pod moją opieką...\"", response: "Azazel uśmiecha się chłodno. \"Opieką? Sukkuby nie potrzebują 'opieki', śmiertelniku. Potrzebują kierownictwa i celu. A celem Lilith jest służba potędze Piekieł, nie zabawa w dom z człowiekiem.\" Podchodzi bliżej Lilith. \"Powiedz mi, dziecko, czy ten człowiek nauczył cię czegoś więcej niż tylko jak marnować swój potencjał na sentymenty?\"", corruption: 8, darkEssence: 15, setsFlag: 'mentor_visit_player_intervened' }
        ]
    },
    {
        id: 'probe_watersports_interest', 
        title: 'Niespodziewany Deszcz (Sondaż Fetyszu)',
        stageRequired: 3, 
        narrativeStage: 3, 
        essenceCost: 50,
        condition: (gs) => gs.lilithStage >= 3 && (!gs.sexualPreferences.popular_fetish || !gs.sexualPreferences.popular_fetish.unlocked || !gs.sexualPreferences.popular_fetish.subCategories.includes('watersports')) && !gs.playerChoiceFlags.includes('player_rejects_watersports') && gs.completedDialogues.includes('mentor_visit'),
        text: (gs) => "Spacerujecie przez opuszczony park. Nagle zrywa się krótka, intensywna ulewa. Chroniąc się pod drzewem, obserwujecie jak woda spływa po liściach i tworzy małe strumyki na ziemi.\nLilith, zamyślona, mówi cicho: \"Zabawne... Woda może być taka oczyszczająca, a czasem... taka... niegrzeczna.\" Zerka na ciebie z błyskiem w oku. \"Czytałam kiedyś w zakazanej księdze o rytuałach, gdzie płyny ustrojowe, nawet te najzwyklejsze, miały... specjalne znaczenie. Niektórzy znajdują w tym pewien rodzaj... wyzwolenia. Albo upodlenia. Zależnie od perspektywy.\"",
        options: [
            {
                id: 'pwi_express_curiosity',
                text: "\"Brzmi... intrygująco. Czasem przekraczanie granic może być ekscytujące.\"",
                response: "Lilith uśmiecha się szerzej, jej oczy błyszczą. \"Dokładnie! Granice są po to, by je testować, prawda? Może kiedyś... będziemy mieli okazję poeksperymentować z bardziej... płynnymi formami bliskości.\" Jej głos jest sugestywny.",
                corruption: 10,
                darkEssence: 5,
                onSelected: (gs) => {
                    setSexualPreferenceUnlocked('popular_fetish', true);
                    ui.addSexualPreferenceSubCategory('popular_fetish', 'watersports');
                    addPlayerChoiceFlag('player_open_to_watersports');
                }
            },
            { id: 'pwi_express_hesitation', text: "\"Hmm, nie jestem pewien, czy to dla mnie. Brzmi trochę... ekstremalnie.\"", response: "Lilith wzrusza ramionami, choć w jej oczach widać nutę zawodu. \"Rozumiem. Każdy ma swoje granice. Dobrze wiedzieć, gdzie leżą twoje... na razie.\" Mruga porozumiewawczo.", corruption: 5, darkEssence: 1, setsFlag: 'player_rejects_watersports' }
        ]
    },
    {
        id: 'first_real_kiss', 
        title: 'Pierwszy Prawdziwy Pocałunek (Przełomowe)',
        stageRequired: 3, 
        narrativeStage: 3, 
        essenceCost: 150,
        isBreakingPoint: true,
        condition: (gs) => gs.lilithStage >= 3 && !gs.completedDialogues.includes('first_real_kiss') &&
            gs.playerChoiceFlags.includes('lilith_vocal_system_unlocked') && 
            gs.completedDialogues.includes('dream_confession') && 
            gs.completedDialogues.includes('hot_weather_tease') &&
            gs.completedDialogues.includes('mentor_visit') &&
            gs.completedDialogues.includes('probe_watersports_interest'),
        text: (gs) => { let setup = "Wieczór. Siedzicie razem, ona opowiada o jakimś nudnym wykładzie z demonologii, gdy nagle przerywa w pół słowa. "; if (gs.playerChoiceFlags.includes('laughed_at_technique')) { setup += "'Pamiętasz jak śmiałeś się z mojej techniki numer 7?' pyta cicho. 'Może... może spróbuję czegoś, czego nie było w podręczniku?'"; } else { setup += "'Wiesz co?' mówi nagle. 'Mam dość teorii. Dość planowania. Może czas na coś... spontanicznego?'"; } return setup; },
        options: [
            { id: 'frk_encourage', text: "Cokolwiek czujesz, że chcesz zrobić... zrób to.", response: "Bierze głęboki oddech. 'Okay. Okay, mogę to zrobić.' Przesuwa się bliżej, jej dłonie są lodowate z nerwów gdy dotykają twojej twarzy. 'Tylko... nie śmiej się, dobrze?' Pochyla się powoli, jej oczy zamykają się... i całuje cię. To niezgrabne, niepewne... i absolutnie idealne. Gdy się odsuwa, jej oczy błyszczą. 'To było... o bogowie, to było lepsze niż wszystkie symulacje razem wzięte.' Dotyka swoich ust jakby nie mogła uwierzyć. 'Chcę... chcę to zrobić jeszcze raz. Mogę?'", corruption: 70, darkEssence: 15, setsFlag: 'first_real_kiss_completed', sexualPreferenceTag: 'vanilla' },
            { id: 'frk_take_lead', text: "Przyciągnąć ją bliżej i pokazać jak się całuje naprawdę.", response: "Jej oczy rozszerzają się gdy ją przyciągasz, ale nie protestuje. Wręcz przeciwnie - wydaje cichy jęk gdy twoje usta spotykają jej. Początkowo jest sztywna, przytłoczona, ale po chwili taje w twoich ramionach. Jej dłonie same znajdują drogę do twoich włosów, a ciało przyciska się desperacko. Gdy przerywasz, dyszy ciężko. 'To było... ja... czemu nikt mi nie powiedział że to może być TAK?' Jej źrenice są rozszerzone, policzki zarumienione. 'Moje całe ciało... czuję jakby płonęło. Czy to normalne? Czy ja... czy my możemy...?' Nie kończy, przygryzając wargę.", corruption: 70, darkEssence: 25, setsFlag: 'first_real_kiss_completed', sexualPreferenceTag: 'vanilla' }
        ],
        onComplete: (gs, gameDefs) => {
            addPlayerChoiceFlag('first_real_kiss_completed'); 
            const newStage = Math.min(4, gameDefs.lilithStages.length - 1);
            if (gs.lilithStage < newStage) {
                setLilithStage(newStage);
                ui.showCustomAlert(`Lilith osiągnęła nowy etap: ${gameDefs.lilithStages[gs.lilithStage].name}!`);
                ui.markLilithDisplayDirty();
                ui.markDialoguesDirty();
                ui.markUpgradesDirty();
                ui.markResearchDirty(); 
            }
        }
    },
    // --- Narrative Stage 4 ---
    {
    id: 'interaction_4_1_direct_touch_study',
    title: 'Badanie Reakcji na Dotyk Bezpośredni',
    stageRequired: 4,
    narrativeStage: 4,
    essenceCost: 160,
    darkEssenceCost: 20,
    isSexual: true,
    isEvent: true,
    condition: (gs) => gs.lilithStage >= 4 && gs.playerChoiceFlags.includes('first_real_kiss_completed'),
    text: (gs) => "Mistrzu... myślę o Twoim dotyku bez przerwy. Ale ta materia... ta irytująca bariera Twoich spodni... zasłania mi całą prawdę. Chcę zobaczyć, jak reagujesz. Chcę *poczuć*, jak twardniejesz w mojej dłoni.",
    options: [
        {
            id: 'dts_agree',
            text: "Spróbujmy.",
            response: "'Cudownie' szepcze, a jej wzrok jest przykuty do Twojego krocza. Jej dłoń jest pewna, gdy sięga celu. Czujesz chłód jej palców na swojej rozgrzanej skórze. \"Ach, tak... To jest zupełnie co innego niż w moich wyobrażeniach. To ciepło... to pulsowanie... jest takie... prawdziwe. Jesteś taki gorący. Czy zawsze jesteś aż tak gorący, gdy Cię dotykam?\"",
            corruption: 45,
            darkEssence: 15,
            onSelected: () => {
                addPlayerChoiceFlag('direct_touch_study_agreed');
            }
        },
        {
            id: 'dts_tease',
            text: "Może najpierw powinnaś pokazać mi swoje... badania?",
            response: "Jej policzki płoną, ale uśmiech staje się prowokacyjny. 'Och, chcesz zobaczyć moje... notatki?' Powoli zaczyna rozpinać swoją bluzkę. 'Może rzeczywiście powinniśmy zacząć od... wzajemnej obserwacji?'",
            corruption: 35,
            darkEssence: 10,
            onSelected: () => {
                addPlayerChoiceFlag('mutual_observation_started');
            }
        },
    ],
    onComplete: (gs, gameDefs) => {
        addPlayerChoiceFlag('interaction_4_1_completed');
    }
},
    {
        id: 'intimate_curiosity_awakening',
        title: 'Przebudzenie Intymnej Ciekawości',
        stageRequired: 4,
        narrativeStage: 4,
        essenceCost: 140,
        darkEssenceCost: 15,
        isSexual: true,
        condition: (gs) => gs.lilithStage >= 4 && gs.completedDialogues.includes('interaction_4_1_direct_touch_study'),
        text: (gs) => "Lilith siedzi na łóżku, jej nogi zwisają z krawędzi, a ona bawi się końcówką swojego ogona. Gdy wchodzisz, podnosi wzrok - w jej oczach jest nowa iskra, mieszanka nieśmiałości i determinacji.\n\"Mistrzu... od naszego ostatniego... eksperymentu... nie mogę przestać myśleć. O dotyku. O tym, jak reagowałeś.\" Przełyka ślinę. \"Chcę... chcę wiedzieć więcej. O sobie. O tobie. O nas.\"",
        options: [
            {
                id: 'ica_encourage_exploration',
                text: "Jakie pytania ci się nasuwają?",
                response: "Jej policzki różowieją. 'Czy... czy wszystkie części ciała reagują tak samo? Czy są miejsca, które są bardziej... wrażliwe?' Jej dłoń mimowolnie wędruje do swojej szyi. 'W podręcznikach były diagramy, ale to nie to samo co... prawdziwe doświadczenie, prawda?'",
                corruption: 35,
                darkEssence: 8,
                setsFlag: 'encouraged_intimate_exploration'
            },
            {
                id: 'ica_suggest_practice',
                text: "Może powinniśmy to zbadać... praktycznie?",
                response: "Jej oczy rozszerzają się, a oddech przyspiesza. 'P-praktycznie? Ty i ja?' Wstaje powoli, podchodząc bliżej. 'To znaczy... dla nauki, oczywiście. Muszę zrozumieć te reakcje, jeśli mam być dobrą sukkubą.' Ale w jej głosie słychać, że to nie tylko o naukę chodzi.",
                corruption: 40,
                darkEssence: 12,
                setsFlag: 'suggested_practical_exploration'
            }
        ]
    },
    {
        id: 'first_intimate_lesson',
        title: 'Pierwsza Intymna Lekcja',
        stageRequired: 4,
        narrativeStage: 4,
        essenceCost: 180,
        darkEssenceCost: 25,
        isSexual: true,
        condition: (gs) => gs.lilithStage >= 4 && gs.completedDialogues.includes('intimate_curiosity_awakening'),
        text: (gs) => "Lilith stoi przed tobą, jej ręce nerwowo zaciskają się na brzegu swojej bluzki. 'Pokazałeś mi swoje... reakcje' mówi cicho. 'Teraz chcę pokazać ci moje.' Powoli zaczyna rozpinać guziki, jej ruchy są niepewne, ale zdeterminowane. 'Powiedz mi... czy to, co widzisz, sprawia, że... że czujesz to samo co ja?'",
        options: [
            {
                id: 'fil_admire_her_courage',
                text: "Jesteś piękna, Lilith. I bardzo odważna.",
                response: "Uśmiecha się, jej pewność siebie rośnie. 'Odważna?' Kończy rozpinanie bluzki, pozwalając jej opaść. 'Może... może rzeczywiście jestem.' Jej dłonie drżą lekko, gdy dotyka swojej skóry. 'Czuję się... dziwnie. Jakby każdy nerw był bardziej żywy. Czy to normalne?'",
                corruption: 45,
                darkEssence: 15,
                setsFlag: 'admired_lilith_courage'
            },
            {
                id: 'fil_guide_her_hands',
                text: "(Delikatnie poprowadź jej dłonie, pokazując jak się dotykać)",
                response: "Gdy twoje dłonie pokrywają jej, wzdryga się lekko. 'Och...' szepcze, gdy prowadzisz jej palce po własnej skórze. 'To takie... intymne. Czuję twoje ciepło przez moje dłonie.' Jej oczy są szeroko otwarte, pełne fascynacji. 'Czy... czy mogę dotknąć ciebie w ten sam sposób?'",
                corruption: 50,
                darkEssence: 18,
                setsFlag: 'guided_lilith_hands'
            }
        ]
    },
    {
        id: 'essence_connection', 
        title: 'Więź Esencji',
        stageRequired: 4, 
        narrativeStage: 4, 
        essenceCost: 200,
        condition: (gs) => gs.lilithStage >= 4 && gs.playerChoiceFlags.includes('unlocked_rp_essence_transfer_basics') && gs.completedDialogues.includes('first_intimate_lesson'),
        text: (gs) => "Lilith stoi przed tobą, trzymając starożytny zwój z twoich badań. Jej dłonie lekko drżą. 'Przeczytałam to... trzy razy' mówi cicho. 'O symbiotycznej wymianie esencji. O tym, że można... dzielić się zamiast zabierać.' Patrzy na ciebie intensywnie. 'Ale jest jeden warunek. Pełne zaufanie. Całkowite otwarcie się.' Jej skrzydła drgają nerwowo. 'Jestem... jestem gotowa spróbować. Z tobą.'",
        options: [
            { id: 'ec_tender', text: "Zróbmy to powoli. Chcę, żebyś czuła się bezpiecznie.", response: "Kiwa głową, podchodząc bliżej. 'Dziękuję' szepcze. Bierze twoją dłoń, kładąc ją na swoim sercu. 'Czujesz? Bije jak szalone.' Zamyka oczy, koncentrując się. Nagle czujesz to - ciepły przepływ energii między wami. Nie drenujący, ale... łączący. Jej oczy otwierają się szeroko. 'Oh! To jest... czuję ciebie. Nie tylko twoje ciało, ale... wszystko.' Łza spływa po jej policzku. 'Przez całe życie uczono mnie brać. A ty uczysz mnie... dzielić się.' Całuje cię delikatnie, a z każdym dotykiem więź się wzmacnia.", corruption: 100, darkEssence: 20, setsFlag: 'essence_connection_established', sexualPreferenceTag: 'vanilla' },
            { id: 'ec_intense', text: "Pokaż mi pełnię swojej mocy. Nie hamuj się.", response: "Jej oczy ciemnieją, źrenice rozszerzają się. 'Jesteś pewien? Bo jeśli puszczę wszystkie hamulce...' Nie czeka na odpowiedź. Rzuca się na ciebie, jej pocałunek jest głodny, desperacki. Czujesz jak energia eksploduje między wami - surowa, pierwotna, oszałamiająca. 'TAK!' krzyczy, jej ciało wyginając się. 'Czuję twoją esencję... dajesz mi ją dobrowolnie... to niemożliwe!' Jej skóra świeci delikatnie, oczy płoną. 'Więcej... potrzebuję więcej ciebie!' Ale nawet w tej dzikości czujesz, że nie zabiera - dzieli się swoją własną mocą w zamian.", corruption: 100, darkEssence: 40, setsFlag: 'essence_connection_established', sexualPreferenceTag: 'vanilla' }
        ]
    },
    // POPRAWKA: Zmieniono warunki dla sexual_exploration_gentle - usunięto wymóg unlocked_rp_succubus_anatomy_secrets
    {
        id: 'sexual_exploration_gentle', 
        title: 'Delikatna Eksploracja',
        stageRequired: 4, 
        narrativeStage: 4, 
        essenceCost: 180,
        isSexual: true, 
        sexualPreferenceTag: 'vanilla',
        condition: (gs) => gs.lilithStage >= 4 && gs.playerChoiceFlags.includes('first_real_kiss_completed') && gs.completedDialogues.includes('essence_connection'),
        text: (gs) => "Leżycie razem na łóżku, Lilith wtulona w twój bok. 'Wiesz co odkryłam?' szepcze, jej palce rysują leniwe kółka na twojej piersi. 'Że wszystkie te diagramy w podręcznikach... kompletnie nie oddają rzeczywistości.' Unosi się na łokciu, patrząc na ciebie. 'Na przykład nigdzie nie było napisane, że sam zapach skóry może sprawić, że zapomnę jak się nazywam.'",
        options: [
            { id: 'seg_explore', text: "Może powinniśmy napisać własny podręcznik?", response: "Śmieje się cicho. 'Rozdział pierwszy: Jak dotyk w odpowiednim miejscu może sprawić, że sukkub zapomni całą łacinę.' Jej ręka zsuwa się niżej, badawczo. 'Rozdział drugi: Dlaczego teoria 'wytrzymałości męskiej' jest kompletnym kłamstwem, gdy sukkub wie co robi.' Pochyla się, całując twoją szyję. 'Mmm, czuję jak twój puls przyspiesza. To by był rozdział trzeci - reakcje fizjologiczne na stymulację...' Przerywa gdy twoje ręce znajdują jej biodra. 'O-och... może najpierw praktyka, potem teoria?'", corruption: 55, darkEssence: 10, onSelected: () => { addPlayerChoiceFlag('first_petting_completed'); } },
            { id: 'seg_tease', text: "Pokaż mi czego nauczyłaś się z podręczników.", response: "'Z przyjemnością' mruczy, a jej oczy ciemnieją. Jej usta pozostawiają wilgotny, gorący ślad pocałunków na Twojej skórze, coraz niżej, aż w końcu zatrzymują się niebezpiecznie blisko Twojego krocza. 'Na przykład tego' szepcze, a jej gorący oddech owiewa wrażliwe miejsce. 'Że masz tutaj punkt, który sprawia, że Twoje biodra same unoszą się w moją stronę.' Jej dłonie wsuwają się pod gumkę Twoich spodni, a Ty czujesz, jak materiał zsuwa się w dół, odsłaniając Cię całkowicie. 'Ach, od dawna chciałam to zrobić' mówi, a jej uśmiech jest pełen obietnic.", corruption: 55, darkEssence: 18, onSelected: () => { addPlayerChoiceFlag('first_petting_completed'); } }
        ]
    },
    {
        id: 'intimate_scene_bondage_exploration',
        title: '🔞 Odkrywanie Więzów (BDSM)',
        stageRequired: 4, 
        narrativeStage: 4, 
        essenceCost: 250,
        darkEssenceCost: 45,
        isSexual: true, 
        sexualPreferenceTag: 'bdsm_bondage',
        condition: (gs) => gs.lilithStage >= 4 && gs.sexualPreferences.bdsm && gs.sexualPreferences.bdsm.unlocked && gs.sexualPreferences.bdsm.level >= 1 && !gs.completedDialogues.includes('intimate_scene_bondage_exploration') && gs.completedDialogues.includes('sexual_exploration_gentle'),
        text: (gs) => "Lilith podchodzi do ciebie z błyskiem w oku, trzymając w dłoni jedwabne szarfy. \"Mistrzu, pamiętasz naszą rozmowę o granicach i kontroli? Znalazłam coś... co może nam pomóc je zbadać.\" Rozwija jedną z szarf. \"Ciekawi mnie, jak by to było... być całkowicie na twojej łasce. Albo... ty na mojej.\" Jej uśmiech jest pełen obietnic.",
        options: [
            {
                id: 'isbe_tie_her_up',
                text: "\"Zwiąż mnie, Lilith. Pokaż mi, co potrafisz.\"",
                response: "Jej uśmiech staje się drapieżny. \"Z największą przyjemnością, Mistrzu.\" Zaczyna cię wiązać powoli, każdy węzeł zaciągany z precyzją i rosnącym podnieceniem w jej oczach. Gdy jesteś całkowicie unieruchomiony, pochyla się nad tobą. \"Teraz jesteś mój... całkowicie.\" To, co następuje, jest powolną, zmysłową torturą, pełną pieszczot i prowokacji, doprowadzając cię na skraj szaleństwa.",
                corruption: 135,
                darkEssence: 55,
                onSelected: () => { addPlayerChoiceFlag('player_experienced_bondage_sub'); }
            },
            {
                id: 'isbe_let_her_tie_you',
                text: "\"Chcesz być związana, moja mała demonico?...\"",
                response: "Lilith drży, jej oczy błyszczą mieszanką strachu i ekscytacji. \"Tak, Mistrzu... chcę.\" Poddaje się twoim dłoniom, gdy ją krępujesz. Każdy dotyk szarfy na jej skórze wywołuje u niej dreszcz. \"To... to dziwne uczucie... być tak bezbronną.\" Gdy jest już związana, patrzy na ciebie z mieszanką uległości i wyzwania. \"Co teraz ze mną zrobisz, Mistrzu?\"",
                corruption: 135,
                darkEssence: 50,
                onSelected: () => { addPlayerChoiceFlag('player_experienced_bondage_dom'); }
            }
        ]
    },
    {
        id: 'infernal_nurse',
        title: 'Pielęgniarka z Piekła Rodem',
        stageRequired: 4,
        narrativeStage: 4,
        essenceCost: 450,
        isEvent: true,
        condition: (gs) => gs.lilithStage >= 4 && gs.completedDialogues.includes('intimate_scene_bondage_exploration'),
        text: (gs) => "Budzisz się, a świat wiruje. Każdy mięsieień cię boli, gardło drapie, a z nosa cieknie. Masz zwykłe, ludzkie przeziębienie. Lilith stoi nad twoim łóżkiem, a w jej oczach maluje się panika. Jej ogon smaga nerwowo podłogę. 'Twoja temperatura jest... niestabilna! Twoje ciało wydziela płyny! W moich podręcznikach takie objawy poprzedzają eksplozję organów wewnętrznych u demonów niższych rzędu!' Nerwowo wertuje gruby, oprawiony w skórę tom. 'Nie martw się! Mam na to procedury!'",
        options: [
            {
                id: 'in_demonic_fever_cure',
                text: "(Jesteś zbyt osłabiony, by protestować. Poddaj się jej 'leczeniu'.)",
                response: "'Dobrze, że mi ufasz!' mówi z determinacją. Kładzie ci dłonie na czole. Zwykle są ciepłe, ale teraz czujesz, jak ich temperatura rośnie. Stają się gorące, potem parzące. 'Według 'Traktatu o Kaustycznej Terapii', muszę wypalić chorobę od środka!' Czujesz zapach przypalanych włosów i słyszysz skwierczenie skóry. Ból jest ostry, ale po chwili ustępuje, zastąpiony przez dziwne, pulsujące ciepło. Gorączka faktycznie zdaje się znikać. 'Teraz... wzmocnienie krwi!' Nacina swój nadgarstek pazurem i przykłada ranę do twoich ust. Gęsta, metaliczna krew wypełnia twoje gardło. Ma smak miedzi, cynamonu i czystej mocy. Zasypiasz, czując, jak piekielna energia wypełnia twoje żyły.",
                corruption: 50,
                darkEssence: 30,
            },
            {
                id: 'in_feverish_desire',
                text: "(W gorączkowym majaku) 'Weź ją... weź moją esencję... to mnie uzdrowi...'",
                response: "Twoje słowa przebijają się przez jej panikę. Patrzy na ciebie, a w jej oczach konfuzja miesza się z drapieżnym zrozumieniem. 'Twoja esencja życiowa... ucieka przez chorobę. A ja... mogę ją zebrać, zanim się zmarnuje?' Pomysł wydaje się jej genialny w swej prostocie. 'Oczywiście! To najlepsza terapia!' Zapominając o księgach, rzuca się na ciebie. Twoje osłabione ciało zalewa fala gorąca, gdy jej usta i dłonie zaczynają zachłannie pracować. Jesteś zbyt słaby, by się poruszyć, zdany całkowicie na jej łaskę. Każdy twój spazm przyjemności jest dla niej dowodem, że 'terapia' działa. Gdy jest po wszystkim, leżysz zlany potem, wyczerpany, ale dziwnie... lżejszy. Lilith oblizuje usta, zadowolona. 'Widzisz? Już ci lepiej. Twoja esencja jest pyszna, nawet w chorobie.'",
                corruption: 70,
                darkEssence: 45,
            }
        ]
    },
    {
        id: 'handmaiden_tail_tease',
        title: 'Inspiracja z Ekranu',
        stageRequired: 4,
        narrativeStage: 4,
        essenceCost: 180,
        darkEssenceCost: 40,
        isSexual: true,
        sexualPreferenceTag: 'exotic_fetish_tail',
        condition: (gs) => gs.lilithStage >= 4 && !gs.playerChoiceFlags.includes('tailjob_unlocked') && gs.completedDialogues.includes('infernal_nurse'),
        text: (gs) => "Postanowiłeś pokazać Lilith klasykę ludzkiego kina erotycznego - 'Służącą'. Oglądacie w milczeniu, a atmosfera w pokoju gęstnieje z każdą minutą. Na ekranie właśnie rozgrywa się scena, w której Sook-hee uczy swoją panią, używając naparstka. Lilith, zafascynowana, nie odrywa wzroku od ekranu. 'Niesamowite' szepcze. 'Ta precyzja... ta delikatność... To jest sztuka. Ale śmiertelnicy muszą uciekać się do takich prymitywnych narzędzi.' Odwraca się do ciebie, a jej oczy błyszczą. Jej długi, demoniczny ogon unosi się i kładzie na twoim udzie. 'Ja mam o wiele lepsze narzędzie. Chcesz, żebym ci pokazała, jak zrobiłaby to prawdziwa mistrzyni?'",
        options: [
            {
                id: 'htt_accept_the_lesson',
                text: "'Jesteś moją mistrzynią. Pokaż mi.'",
                response: "Uśmiecha się, zadowolona z twojej odpowiedzi. Nie odrywając wzroku od twoich oczu, jej ogon zaczyna swoją pracę. Doznanie jest niepodobne do niczego, co znasz. Czujesz siłę żywego, umięśnionego narzędzia, pokrytego gładkimi, ale twardymi łuskami. Porusza się z inteligencją węża, zaciskając się i rozluźniając w idealnym rytmie, idealnie naśladując i przewyższając to, co widzieliście na ekranie. Jego koniuszek, uzbrojony w mały, chitynowy kolec, drażni twoją cewkę z zabójczą precyzją. 'Widzisz?' mruczy. 'Żaden naparstek tego nie potrafi. To jest prawdziwa, żywa pieszczota.'",
                corruption: 80,
                darkEssence: 50,
                onSelected: () => {
                    addPlayerChoiceFlag('tailjob_unlocked');
                }
            },
            {
                id: 'stj_touch_the_tail', 
                text: "(Zamiast odpowiadać, wyciągnij rękę i dotknij jej ogona.)",
                response: "Gdy twoje palce dotykają jej ogona, jej ciałem wstrząsa gwałtowny dreszcz, a z jej ust wyrywa się zduszony jęk. 'Ach! T-tam!' Jej ogon momentalnie zwija się i ucieka przed twoim dotykiem. 'Jest... bardzo wrażliwy. Nie dotykaj go bez pozwolenia.' Patrzy na ciebie, jej policzki są zarumienione, a oddech przyspieszony. 'Teraz już wiesz. A teraz... leż grzecznie. Moja kolej.' Zanim zdążysz zareagować, jej ogon wraca, by rozpocząć pieszczotę, tym razem bardziej stanowczo i dominująco.",
                corruption: 70,
                darkEssence: 45,
                 onSelected: () => {
                    addPlayerChoiceFlag('tailjob_unlocked');
                }
            }
        ]
    },
    {
        id: 'morning_surprise', 
        title: '🔞 Poranna Niespodzianka (Oralna, Przełomowe)',
        stageRequired: 4, 
        narrativeStage: 4, 
        essenceCost: 220,
        isSexual: true, 
        sexualPreferenceTag: 'popular_fetish_oral', 
        isBreakingPoint: true,
        condition: (gs) => gs.lilithStage >= 4 && !gs.completedDialogues.includes('morning_surprise') &&
            gs.completedDialogues.includes('sexual_exploration_gentle') && 
            gs.completedDialogues.includes('intimate_scene_bondage_exploration') && 
            gs.completedDialogues.includes('handmaiden_tail_tease'),
        text: (gs) => "Budzisz się czując dziwne, ale przyjemne uczucie. Otwierasz oczy i widzisz tylko poruszającą się kołdrę w okolicy twoich bioder. " +
        "Nagle spod kołdry wyłania się rozczochrana głowa Lilith, jej oczy błyszczą psotnie. " +
        "*Oblizuje wargi* 'Dzień dobry! Nie mogłam spać więc postanowiłam... poćwiczyć!' " +
        "*Jej ogon macha zadowolony jak u psa* " +
        "'Pamiętasz rozdział 23 - 'Techniki Poranne dla Zaawansowanych'? No więc sprawdzałam czy to prawda że faceci są bardziej... ' " +
        "*wraca do swojego zajęcia na moment* '...wrażliwi po przebudzeniu!' " +
        "Unosi głowę znowu. 'I wiesz co? TO PRAWDA! Jesteś taki twardy że aż szkoda marnować!'",
        options: [
            { 
                id: 'ms_enjoy', 
                text: "Nie przerywaj...", 
                response: "*Jej oczy błyszczą triumfalnie* 'Wiedziałam że docenisz moją technikę!' " +
                "*Zanurza się z powrotem* " +
                "Słyszysz jej stłumiony głos: 'Rofefora Feacio fówiła fe fak fie rofi fo feff efikfu!' " +
                "(Tłumaczenie: Profesor Felacio mówiła że tak się robi to jest efekt!) " +
                "*Jej technika jest mieszanką podręcznikowej precyzji i dzikiego entuzjazmu* " +
                "'Mmm!' *mlaska z zadowoleniem* 'Fmakuef fak mmdauy!' " +
                "(Smakuje jak migdały!) " +
                "Gdy dochodzisz, przyjmuje wszystko z zaskakującą zachłannością. " +
                "*Wytiera usta* 'Ha!'widzisz gwiazdy, a Twoja sukubica zmienia kolor na perlistobiały.", 
                corruption: 65, 
                darkEssence: 15, 
                onSelected: () => { addPlayerChoiceFlag('first_oral_sex_by_lilith_completed'); } 
            },
            { 
                id: 'ms_reciprocate', 
                text: "Teraz Twoja kolej na to, by zderzyć się z praktyką", 
                response: "Jej uśmiech jest drapieżny. 'Wiedziałam, że ci się spodoba.' Wraca do swojego dzieła z nowym zapałem. Czujesz nie tylko jej wilgotne, gorące usta, ale też delikatne wibracje jej mruczenia, które zdają się rezonować przez całe twoje ciało aż do rdzenia. Jej język precyzyjnie okrąża cię, pieści, doprowadzając cię na sam skraj. Gdy jesteś blisko, unosi na moment głowę, jej usta lśnią, a w oczach płonie ogień triumfu. 'A teraz... chcę, żebyś dla mnie doszedł' szepcze. Twoja eksplozja jest gwałtowna, niemal bolesna w swej intensywności, a ona przyjmuje każdą kroplę z zadowolonym mruknięciem, połykając wszystko bez wahania. Potem oblizuje usta i patrzy na ciebie. 'Zaliczone. Celująco.'", 
                corruption: 65, 
                darkEssence: 12 
            }
        ], 
        onComplete: (gs, gameDefs) => { 
            addPlayerChoiceFlag('morning_surprise_completed'); 
            const newStage = Math.min(5, gameDefs.lilithStages.length - 1);
            if (gs.lilithStage < newStage) {
                setLilithStage(newStage);
                ui.showCustomAlert(`Lilith osiągnęła nowy etap: ${gameDefs.lilithStages[gs.lilithStage].name}!`);
                ui.markLilithDisplayDirty();
                ui.markDialoguesDirty();
                ui.markUpgradesDirty();
                ui.markResearchDirty();
            }
        } 
    },
    // --- Narrative Stage 5 ---
    {
    id: 'interaction_5_1_oral_fixation',
    title: 'Oralna Fiksacja i Propozycja',
    stageRequired: 5,
    narrativeStage: 5,
    essenceCost: 320,
    darkEssenceCost: 65,
    isSexual: true,
    isEvent: true,
    condition: (gs) => gs.lilithStage >= 5 && gs.playerChoiceFlags.includes('morning_surprise_completed'),
    text: (gs) => "Lilith przeciąga się zmysłowo, a jej język powoli oblizuje wargi. \"Mistrzu, strasznie się dziś nudzę\" mruczy. \"Gdy tak się dzieje, moje myśli wędrują w bardzo interesujące miejsca. Wspominałam Ci o mojej małej fiksacji oralnej, prawda? Gdy nosisz te spodnie... Twój widok tylko ją potęguje. Ten solidny kształt... aż sprawia, że ślinka mi cieknie na myśl o tym, co mogłabym z nim zrobić.\"",
    options: [
        {
            id: 'of_accept',
            text: "W takim razie, moja droga, nie pozwólmy, byś się dłużej nudziła.",
            response: "\"Cudownie, Mistrzu\" jej głos jest niski i wibrujący. \"Wiedziałam, że mogę na Ciebie liczyć.\" Nie odrywając od Ciebie wzroku, powoli klęka. Rozchyla usta, a jej gorący oddech muska Twoje udo. \"Mam nadzieję, że jesteś gotowy na długą i bardzo mokrą sesję. Zamierzam zbadać każdy centymetr z należytą starannością. Weź miernik, sprawdzimy, czy pobiję swój rekord w głębokim gardle.\"",
            corruption: 60,
            darkEssence: 25,
            onSelected: () => {
                addPlayerChoiceFlag('oral_fixation_accepted');
            }
        },
        {
            id: 'of_feign_ignorance',
            text: "Co dokładnie masz na myśli, Lilith?",
            response: "\"Och, Mistrzu, nie bądź taki skromny. Mam na myśli użycie moich ust i języka w sposób, który sprawi, że zapomnisz własne imię. Chcę poczuć Twój smak, Twoją twardość, Twoją erupcję. Chcę Cię połknąć w całości. Czy to wystarczająco jasne?\"",
            corruption: 30,
            darkEssence: 10
        },
    ]
    },
    { 
        id: 'intimate_scene_watersports_consensual', 
        title: '💦 Przekraczanie Granic',
        stageRequired: 5, 
        narrativeStage: 5, 
        essenceCost: 280,
        darkEssenceCost: 60,
        isSexual: true, 
        sexualPreferenceTag: 'popular_fetish_watersports',
        condition: (gs) => gs.lilithStage >= 5 && gs.playerChoiceFlags.includes('player_open_to_watersports') && gs.sexualPreferences.popular_fetish && gs.sexualPreferences.popular_fetish.unlocked && gs.sexualPreferences.popular_fetish.level >= 0 && !gs.completedDialogues.includes('intimate_scene_watersports_consensual') && gs.playerChoiceFlags.includes('morning_surprise_completed'),
        text: (gs) => "Lilith kręci się po pokoju jak kot, który planuje coś naprawdę niegrzecznego. " +
        "*Jej ogon wykonuje hipnotyzujące ósemki w powietrzu* " +
        "'Mistrzu... piłeś dzisiaj bardzo wiele wody. Chce ci się siku, prawda?'\"",
        options: [
            { id: 'iswc_embrace_experiment', text: "\"Tak... i mam pewien pomysł, co z tym zrobić.\"", response: "Jej oczy rozszerzają się z ekscytacji i dzikiej żądzy. \"Och, Mistrzu... czy myślisz o tym samym co ja?\" Klęka przed tobą, otwierając usta w zaproszeniu. \"Pokaż mi... oznacz mnie jako swoją. Chcę poczuć twoją esencję w każdej możliwej formie.\"", corruption: 95, darkEssence: 50, onSelected: () => { addPlayerChoiceFlag('experienced_watersports_lilith'); } },
            { id: 'iswc_gentle_redirect', text: "\"Może... innym razem. Dziś wolę tradycyjne formy bliskości.\"", response: "Uśmiecha się zrozumiale, choć w jej oczach błyska nutka zawodu. \"Oczywiście, Mistrzu. Mamy całą wieczność na eksperymenty.\" Podchodzi bliżej, jej dotyk jest czuły i pełen miłości.", corruption: 35, darkEssence: 10, sexualPreferenceTag: 'vanilla' }
        ]
    },
    {
        id: 'academy_audit_v2',
        title: 'Piekielna Kontrola Jakości',
        stageRequired: 5,
        narrativeStage: 5,
        essenceCost: 0,
        isEvent: true,
        condition: (gs) => gs.lilithStage >= 5 && !gs.playerChoiceFlags.includes('academy_audit_complete') && gs.completedDialogues.includes('intimate_scene_watersports_consensual'),
        text: (gs) => "Rozlega się pukanie do drzwi – trzy suche, biurokratyczne stuknięcia. Otwierasz, a przed tobą stoi demon w źle dopasowanym garniturze. Zamiast teczki trzyma kamienny clipboard, a jego wielosoczewkowe okulary brzęczą przy każdym ruchu. 'Inkwizytor Malexus, Dział Zapewnienia Jakości Pozyskiwania Esencji. Audyt.' mówi głosem pozbawionym emocji. Wchodzi do środka. 'Stanowisko pracy poniżej standardów.' stwierdza, wskazując na twoje łóżko. 'Brak regulaminowego oświetlenia, nie widzę też certyfikowanych uchwytów.' Lilith staje na baczność, prostując się dumnie. 'Inkwizytorze, melduję gotowość do testu praktycznego!'",
        options: [
            {
                id: 'aa_standard_procedure',
                text: "(Obserwuj, jak Lilith wykonuje procedurę 'podręcznikową'.)",
                response: "Malexus staje z boku. 'Proszę zademonstrować standardową procedurę oralną, zgodnie z załącznikiem 2B.' Lilith podchodzi do ciebie z miną najlepszej uczennicy. Jej technika jest absolutnie bezbłędna, każdy ruch jest precyzyjny i wycyzelowany. 'Notuję... doskonałe przygotowanie pola operacyjnego.' mruczy Malexus. 'Kąt nachylenia głowy: optymalny. Praca językiem: zgodna z wytycznymi, a nawet wykazuje elementy innowacyjne w zakresie stymulacji wędzidełka. Imponujące.' Gdy dochodzisz, Malexus zręcznie podstawia menzurkę. 'Objętość: 6.2 mililitra. Gęstość... powyżej średniej. Doskonała jakość próbki.' Stawia wielką, płonącą szóstkę na swoim clipboardzie. 'Gratuluję, jednostko Lilith. Wzorowe wykonanie. Otrzymacie dodatkowe punkty w rankingu kwartalnym.' I znika, zostawiając za sobą zapach ozonu i satysfakcji.",
                corruption: 70,
                darkEssence: 50,
                onSelected: () => {
                    addPlayerChoiceFlag('academy_audit_complete');
                }
            },
            {
                id: 'aa_extra_credit',
                text: "(Lilith do ciebie, szeptem) 'Mistrzu, mogę zademonstrować technikę zaawansowaną. Z podręcznika dla zaocznych. To ryzykowne, ale ocena będzie wyższa!'",
                response: "Dajesz jej dyskretny znak zgody. Lilith odwraca się do Malexusa. 'Inkwizytorze, za pozwoleniem, chciałabym zademonstrować procedurę 7C-prime, 'Synchroniczna Stymulacja Wielopunktowa'.' Malexus unosi brew, a jego soczewki obracają się z zainteresowaniem. 'Ambitnie. Proszę kontynuować.' To, co robi Lilith, jest dziełem sztuki. Jej dłonie, usta i... ogon, pracują w idealnej, zsynchronizowanej harmonii. Malexus aż przerywa notowanie, by obserwować. 'Niesłychane...' szepcze. 'Koordynacja na poziomie arcymistrzowskim. Wykorzystanie końcówki ogonowej jako trzeciego punktu nacisku... rewolucyjne!' Twój orgazm jest tak potężny, że niemal tracisz przytomność. Malexus z trudem łapie całą próbkę. Patrzy na nią, potem na Lilith. 'Jednostko... to było... piękne.' W jego głosie po raz pierwszy słychać coś na kształt emocji. 'To nie jest szóstka. To jest... publikacja w 'Piekielnym Kwartalniku Erotycznym'!' Znika w obłoku siarki, zostawiając was w poczuciu absolutnego triumfu.",
                corruption: 90,
                darkEssence: 65,
                 onSelected: () => {
                    addPlayerChoiceFlag('academy_audit_complete');
                }
            }
        ]
    },
    {
        id: 'defiling_the_idol',
        title: 'Zbeszczeszczenie Bóstwa',
        stageRequired: 5,
        narrativeStage: 5,
        essenceCost: 250, 
        darkEssenceCost: 0,
        isSexual: true,
        isEvent: true,
        condition: (gs) => gs.lilithStage >= 5 && 
                           gs.completedDialogues.includes('morning_surprise') && 
                           !gs.playerChoiceFlags.includes('player_defiled_lilith_sleep') &&
                           gs.completedDialogues.includes('academy_audit_v2'),
        text: (gs) => "Jest późno. Lilith śpi w swojej jedwabnej koszuli nocnej, oświetlona jedynie blaskiem księżyca. Wygląda jak posąg, bóstwo snu i pożądania. Jej oddech jest ledwo słyszalny. Przez cienki materiał koszulki odznaczają się jej stwardniałe sutki, jakby nawet we śnie reagowała na twoją obecność. Ten widok, jej absolutna perfekcja i bezbronność, jest nie do zniesienia. Pożądanie uderza cię z siłą fizycznego ciosu. Nie chcesz jej budzić. Nie chcesz jej brać. Chcesz ją... oznaczyć. Oddać jej cześć w jedyny sposób, jaki przychodzi ci do głowy w tym momencie szaleństwa.",
        options: [
            {
                id: 'di_finish_on_chest',
                text: "(Zrobię to. Skończę na jej piersiach i koszulce.)",
                response: "Działasz w cichym transie. Dźwięk twojego przyspieszonego oddechu jest jedynym hałasem w pokoju. Chwilę później gorąca, lepka sperma ląduje na jej dekolcie i jedwabnej koszuli, tworząc lśniącą, nieprzezroczystą plamę. Właśnie wtedy Lilith porusza się niespokojnie i jej oczy otwierają się powoli. Jej wzrok jest zaspany, dopóki nie czuje czegoś na swojej skórze. Dotyka plamy palcami, unosi je do nosa. Wącha. Jej oczy rozszerzają się w szoku, a potem... w zrozumieniu. 'To... to twoja esencja' szepcze, patrząc na ciebie. 'Tyle... Zmarnowałeś ją... na moją koszulę? Nie mogłeś się powstrzymać?' W jej głosie nie ma gniewu. Jest tylko czysta, analityczna ciekawość i... nuta perwersyjnego zadowolenia.",
                corruption: 60,
                darkEssence: 25,
                onSelected: () => {
                    addPlayerChoiceFlag('player_defiled_lilith_sleep');
                }
            },
            {
                id: 'di_finish_on_face',
                text: "(Zrobię to. Chcę zobaczyć ją pokrytą moją esencją. Skończę na jej szyi i twarzy.)",
                response: "Działasz szybko, niemal brutalnie wobec samego siebie. Twoim celem jest jej twarz – idealne płótno dla twojej obsesji. Gorąca sperma ląduje na jej policzku, szyi i kąciku ust. Porusza się we śnie, a jej język odruchowo oblizuje wargę, zbierając kroplę twojej esencji. To ją budzi. Jej oczy otwierają się gwałtownie. Przez chwilę jest zdezorientowana, ale potem jej wzrok skupia się na tobie. Czuje lepkość na swojej skórze. Jej spojrzenie staje się ostre jak brzytwa. 'Ty...' mówi cicho, a w jej głosie słychać wibrację mocy. 'Nie mogłeś się powstrzymać. Byłeś tak zdesperowany, że wolałeś mnie oznaczyć jak swoje terytorium, niż obudzić i wziąć to, co twoje? Intrygujące... i jakie marnotrawstwo. Chodź tu. Pokażę ci, jak należy właściwie dysponować twoją... ofiarą.'",
                corruption: 85,
                darkEssence: 40,
                onSelected: () => {
                    addPlayerChoiceFlag('player_defiled_lilith_sleep');
                }
            }
        ]
    },
    {
        id: 'intimate_scene_lilith_takes_control', 
        title: '🔞 Lilith Przejmuje Kontrolę (Dominacja)',
        stageRequired: 5, 
        narrativeStage: 5, 
        essenceCost: 350,
        darkEssenceCost: 70,
        isSexual: true, 
        sexualPreferenceTag: 'bdsm_dominance',
        condition: (gs) => gs.lilithStage >= 5 && gs.playerChoiceFlags.includes('dominant_teaching_success') && gs.sexualPreferences.bdsm && gs.sexualPreferences.bdsm.unlocked && gs.sexualPreferences.bdsm.level >=1 && !gs.completedDialogues.includes('intimate_scene_lilith_takes_control') && gs.completedDialogues.includes('defiling_the_idol'),
        text: (gs) => "Lilith wchodzi do pokoju, jej ruchy są płynne i pełne drapieżnej gracji. Na jej ustach błąka się władczy uśmiech. \"Mistrzu,\" mruczy, jej głos jest niski i wibrujący. \"Dziś ja prowadzę. Nauczyłeś mnie wiele, ale teraz pora na moją lekcję. Lekcję absolutnej rozkoszy... i całkowitego poddania.\" Jej oczy płoną obietnicą.",
        options: [
            { id: 'isltc_submit_eagerly', text: "\"Jestem twój, moja Królowo...\"", response: "Uśmiech Lilith staje się jeszcze szerszy. \"Doskonale.\" Podchodzi do ciebie, jej dotyk jest jednocześnie delikatny i stanowczy. To, co następuje, jest mistrzowskim pokazem jej nowo odkrytej dominacji – przejmuje inicjatywę w każdym aspekcie, prowadząc cię przez fale intensywnej przyjemności, której nigdy wcześniej nie doświadczyłeś. Jej pewność siebie jest odurzająca, a jej techniki... boskie.", corruption: 140, darkEssence: 60, onSelected: () => { addPlayerChoiceFlag('lilith_dominated_player_scene'); } },
            { id: 'isltc_tease_challenge', text: "\"Myślisz, że potrafisz mnie zaskoczyć, mała demonico?\"", response: "Lilith śmieje się cicho, dźwiękiem, który przyprawia cię o dreszcze. \"Och, Mistrzu, nie tylko cię zaskoczę. Sprawię, że będziesz błagał o więcej.\" Jej ruchy stają się jeszcze bardziej prowokacyjne. Rzuca ci wyzwanie, byś spróbował odzyskać kontrolę, ale jej siła i zmysłowość są przytłaczające. Ostatecznie poddajesz się jej woli, tonąc w otchłani rozkoszy, którą dla ciebie przygotowała.", corruption: 140, darkEssence: 50 }
        ]
    },
    {
        id: 'crossroads_of_the_feet',
        title: 'Na Rozdrożu (Punkt Zwrotny)',
        stageRequired: 5,
        narrativeStage: 5,
        essenceCost: 250,
        darkEssenceCost: 50,
        isSexual: true,
        isEvent: true, 
        sexualPreferenceTag: 'popular_fetish_foot',
        condition: (gs) => gs.lilithStage >= 5 &&
                           !gs.playerChoiceFlags.includes('player_chose_foot_dynamic') &&
                           gs.completedDialogues.includes('intimate_scene_lilith_takes_control'),
        text: (gs) => "Siedzicie na kanapie, pogrążeni w wygodnej ciszy. Lilith, czytając jeden ze swoich grzesznych romansów, z westchnieniem zadowolenia opiera swoje bose stopy na twoich kolanach. To gest pełen zaufania i komfortu. Jej stopy są ciepłe, idealnie ukształtowane, a palce poruszają się lekko, gdy przewraca stronę w książce. Są bezbronne. Są zaproszeniem. Pytanie brzmi: jak na nie odpowiesz?",
        options: [
            {
                id: 'cotf_dominate_her',
                text: "(Chwyć jej stopę i przyciągnij ją do siebie. Pokaż jej, do kogo należy.)",
                response: "Twoja ręka zamyka się na jej kostce z siłą, która ją zaskakuje. Przerywa czytanie, a jej oczy rozszerzają się ze zdziwienia, gdy bezceremonialnie przyciągasz jej stopę do swojego krocza. W jej spojrzeniu pojawia się błysk buntu, ale gdy widzi twoją nieugiętą minę, bunt ten gaśnie, zastąpiony przez mroczną iskrę poddania. 'Och...' wzdycha, a jej ciało rozluźnia się. 'Rozumiem.' Twoje spodnie szybko lądują na ziemi. Prowadzisz jej stopę, pokazując jej dokładnie, jak ma się poruszać, jaki nacisk stosować. Staje się twoim narzędziem, posłusznym i chętnym, a z jej ust wyrywają się ciche jęki za każdym razem, gdy twoje biodra mocniej napierają na jej podeszwę. To ty tu rządzisz. A jej to się podoba.",
                corruption: 100,
                darkEssence: 70,
                onSelected: () => {
                    addPlayerChoiceFlag('player_chose_foot_dynamic');
                    addPlayerChoiceFlag('player_is_foot_dominant');
                }
            },
            {
                id: 'cotf_submit_to_her',
                text: "(Zacznij delikatnie masować jej stopy, oddając jej cześć.)",
                response: "Twoje dłonie delikatnie obejmują jej stopy, a kciuki zaczynają powolny, okrężny masaż jej podeszew. Lilith przestaje czytać. Spogląda na ciebie z góry, a na jej ustach powoli pojawia się leniwy, władczy uśmiech. 'Mmm... dobrze.' mruczy, odkładając książkę. 'Widzę, że znasz swoje miejsce.' Przesuwa się, by usiąść wygodniej, w pełni akceptując twoją służbę. 'Skoro twoje ręce są tak chętne, zobaczmy, jak poradzą sobie z czymś... twardszym.' Zsuwa się niżej i umieszcza twojego członka między swoimi stopami. To ona kontroluje rytm, tempo i nacisk, bawiąc się tobą z rozbawieniem i kpiącą czułością. 'Tak lepiej.' mówi z satysfakcją. 'Zawsze powinieneś być u moich stóp.'",
                corruption: 100,
                darkEssence: 50,
                onSelected: () => {
                    addPlayerChoiceFlag('player_chose_foot_dynamic');
                    addPlayerChoiceFlag('player_is_foot_submissive');
                }
            }
        ]
    },
    {
        id: 'dominant_teaching', 
        title: 'Dominująca Nauczycielka (Lekcja Praktyczna)',
        stageRequired: 5, 
        narrativeStage: 5, 
        essenceCost: 400,
        isSexual: true, 
        sexualPreferenceTag: 'bdsm_dominance',
        condition: (gs) => gs.lilithStage >= 5 && gs.completedDialogues.includes('crossroads_of_the_feet'),
        text: (gs) => "Lilith wchodzi ubrana w... coś co wygląda jak erotyczna wersja akademickiego mundurka. Krótka spódniczka, ciasna biała koszula zawiązana pod biustem, okulary na nosie. 'Siadaj' rozkazuje, wskazując krzesło. 'Czas na lekcję.' W ręku trzyma wskaźnik, którym postukuje o dłoń.",
        options: [
            { id: 'dt_obey', text: "Tak jest, pani profesor.", response: "aJej uśmiech jest zimny i pełen satysfakcji. 'Lubię posłusznych uczniów.'' Gdy podchodzi, jej biodra kołyszą się z gracją. Zamiast siadać, staje nad tobą, patrząc z góry. Dzisiejsza lekcja to: Anatomia mojej rozkoszy.' Bierze twoją rękę, jej uścisk jest zaskakująco silny. 'Ręka tutaj.' rozkazuje, prowadząc twoją dłoń do miejsca, gdzie jej skrzydła łączą się z plecami. 'Delikatny nacisk... o tak... czujesz, jak drżę pod twoim dotykiem? To jest, jak... Ahh, przycisk, który włącza we mnie ogień. A teraz...' jej głos staje się niskim mruknięciem, prowadzi twoją rękę niżej, do podstawy jej ogona. 'Masuj. Powoli. Okrężnymi ruchami.' 'To... to czyni sukkuba bardzo... bardzo... posłusznym.'", corruption: 110, darkEssence: 30, setsFlag: 'dominant_teaching_success' },
            { id: 'dt_rebel', text: "A co jeśli wolę uczyć się... praktycznie?", response: "Jej oczy błyszczą niebezpiecznie. 'Nieposłuszny uczeń?' Wskaźnik ląduje z plaskiem na twojej dłoni. 'To wymaga... dyscypliny.' Pcha cię na łóżko, siadając okrakiem na twoich biodrach. 'Lekcja przymusowa więc.' Rozrywa twoją koszulę. 'Nauczę cię co się dzieje gdy się sprzeciwia sukkubowi w trybie nauczycielskim.' Jej paznokcie zostawiają czerwone ślady na twojej piersi. 'Pierwsza zasada - sukkub zawsze wie lepiej.' Pochyla się, przygryzając twoje ucho. 'Druga zasada - przyjemność może być karą.' Jej biodra zaczynają powolny, torturujący taniec. 'Trzecia zasada - nie skończę dopóki nie będziesz błagał o litość.'", corruption: 110, darkEssence: 40 }
        ]
    },
    {
        id: 'seductive_confession', 
        title: 'Uwodzicielskie Wyznanie (Pełnia Praktyki)',
        stageRequired: 5, 
        narrativeStage: 5, 
        essenceCost: 450,
        isSexual: true, 
        sexualPreferenceTag: 'vanilla',
        condition: (gs) => gs.lilithStage >= 5 && gs.completedDialogues.includes('dominant_teaching'),
        text: (gs) => "Lilith wchodzi do twojej sypialni ubrana jedynie w czar ną, koronkową bieliznę. Ale to nie jej strój przyciąga uwagę - to pewność w jej ruchach, sposób w jaki się niesie. 'Pamiętasz jak mówiłam, że byłam najlepszą uczennicą?' pyta, siadając na skraju łóżka. 'Że znałam całą teorię na pamięć?' Uśmiecha się zmysłowo. 'Cóż... teraz mam też praktykę. I chcę ci pokazać, czego się nauczyłam. Czego TY mnie nauczyłeś.'",
        options: [
            { id: 'sc_curious', text: "Co dokładnie masz na myśli?", response: "Przesuwa się bliżej, jej dłoń wędruje po twojej piersi. 'Nauczyłeś mnie, że prawdziwa rozkosz nie leży w perfekcyjnej technice...' jej głos jest jak aksamit, 'ale w połączeniu. W pragnieniu.' Pochyla się, jej usta muskają twoje ucho. 'Wiesz co odkryłam? Że gdy naprawdę kogoś pragniesz, twoje ciało wie co robić. Instynkt jest lepszy niż tysiąc podręczników.' Jej ręka zsuwa się niżej. 'Na przykład teraz... wiem dokładnie gdzie cię dotknąć, jak sprawić żebyś błagał o więcej. Nie dlatego, że tak było w książce. Ale dlatego, że obserwowałam każde twoje drgnięcie, każdy oddech.'", corruption: 120, darkEssence: 30 },
            { id: 'sc_challenge', text: "Więc pokaż mi. Udowodnij że zasługujesz na tytuł najlepszej.", response: "Jej oczy błyszczą przyjmując wyzwanie. 'Och, z przyjemnością.' Jednym ruchem pozbywa się stanika, jej piersi są idealne w świetle świec. 'Lekcja pierwsza - anticipacja.' Pochyla się nad tobą, jej włosy muskają twoją skórę, ale nie pozwala ci się dotknąć. 'Widzisz jak już drżysz? A jeszcze nawet nie zaczęłam.' Jej język wytycza ścieżkę od twojej szyi w dół. 'Lekcja druga - każdy sukkub ma swoją specjalność. Wiesz jaka jest moja?' Patrzy na ciebie spod rzęs. 'Doprowadzanie do szaleństwa. Powoli. Metodycznie. Aż będziesz błagał.' Jej usta zamykają się wokół ciebie i udowadnia, że nie są to puste słowa.'", corruption: 120, darkEssence: 45 }
        ]
    },
    { 
        id: 'breaking_point_true_desire', 
        title: '🔞 Prawdziwe Pragnienie (Kulminacja Etapu)',
        stageRequired: 5, 
        narrativeStage: 5, 
        essenceCost: 500, 
        darkEssenceCost: 100,
        isBreakingPoint: true, 
        isSexual: true, 
        sexualPreferenceTag: 'vanilla',
        condition: (gs) => gs.lilithStage >= 5 && !gs.completedDialogues.includes('breaking_point_true_desire') &&
            gs.completedDialogues.includes('intimate_scene_watersports_consensual') && 
            gs.completedDialogues.includes('intimate_scene_lilith_takes_control') && 
            gs.completedDialogues.includes('dominant_teaching') && 
            gs.completedDialogues.includes('seductive_confession'),
        text: (gs) => "Lilith wchodzi do pokoju. Nie ma w niej już śladu akademickiej sztywności czy nerwowej energii. Jest po prostu... sobą. 'Muszę ci coś powiedzieć' mówi, siadając naprzeciwko. 'Przez całe życie uczyłam się być idealnym sukkubem. Perfekcyjnym drapieżnikiem.' Patrzy ci prosto w oczy. 'Ale ty pokazałeś mi, że mogę być czymś więcej. Kimś więcej. I teraz...' bierze głęboki oddech, 'teraz wiem czego naprawdę pragnę.'",
        options: [
            { id: 'bptd_love', text: "Czego pragniesz, Lilith?", response: "'Ciebie' mówi prosto, bez zawahania. 'Nie twojej esencji, nie twojej duszy. Ciebie. Całego.' Wstaje, podchodząc bliżej. 'Chcę się kochać z tobą, nie jako sukkub z ofiarą, ale jako... jako Lilith z mężczyzną, którego...' przerywa, ale jej oczy mówią wszystko. 'Nauczyłam się wszystkich technik, znam każdą pozycję, każdy sposób dawania rozkoszy. Ale teraz chcę zapomnieć o wszystkim i po prostu... być z tobą. Kochać się aż zabraknie nam tchu, aż nasze ciała staną się jednym.'", corruption: 120, darkEssence: 30, setsFlag: 'lilith_confessed_true_desire_love', onSelected: () => { addPlayerChoiceFlag('first_vaginal_sex_completed'); } },
            { id: 'bptd_power', text: "Pokaż mi jak bardzo mnie pragniesz.", response: "Jej oczy błyskają niebezpiecznie. 'Och, pokażę ci' mówi niskim głosem. Podchodzi powoli, każdy ruch jest deliberatny, zmysłowy. 'Wiesz ile nocy leżałam budząc się zlana potem, myśląc o tobie?' Jej dłonie wędrują po swoim ciele, pokazując ci. 'Ile razy musiałam... sama sobie ulżyć, wyobrażając so bie twoje ręce?' Staje tuż przed tobą. 'Akademia nauczyła mnie kontroli. Ty nauczyłeś mnie ja tracić. I teraz...' jednym płynnym ruchem siada na tobie okrakiem, 'zamierzam pokazać ci dokładnie jak bardzo potrafię ją stracić dla ciebie.'", corruption: 120, darkEssence: 50, setsFlag: 'lilith_confessed_true_desire_power', onSelected: () => { addPlayerChoiceFlag('first_vaginal_sex_completed'); } }
        ],
        onComplete: (gs, gameDefs) => { 
            addPlayerChoiceFlag('breaking_point_true_desire_completed'); 
            const newStage = Math.min(6, gameDefs.lilithStages.length - 1);
            if (gs.lilithStage < newStage) {
                setLilithStage(newStage);
                ui.showCustomAlert(`Lilith osiągnęła nowy etap: ${gameDefs.lilithStages[gs.lilithStage].name}!`);
                ui.markLilithDisplayDirty();
                ui.markDialoguesDirty();
                ui.markUpgradesDirty();
                ui.markResearchDirty();
            }
        }
    },
    // --- Narrative Stage 6 ---
    {
    id: 'interaction_6_1_balanced_meal',
    title: 'Kwestia Zbilansowanego Posiłku',
    stageRequired: 6,
    narrativeStage: 6,
    essenceCost: 650,
    darkEssenceCost: 120,
    isSexual: true,
    isEvent: true,
    condition: (gs) => gs.lilithStage >= 6 && gs.playerChoiceFlags.includes('breaking_point_true_desire_completed'),
    text: (gs) => "Lilith podchodzi do Ciebie z poważną, niemal naukową miną. \"Mistrzu, przeprowadziłam dziś pewne badania. Analizowałam skład kaloryczny męskiego nasienia. Okazuje się, że to bardzo zbilansowany i smaczny posiłek, bogaty w proteiny.\" Patrzy na Ciebie wyczekująco. \"A ja czuję się dziś nieco głodna.\"",
    options: [
        {
            id: 'bm_accept',
            text: "W takim razie, moja droga, czas na posiłek. Jak chcesz go przyjąć?",
            response: "\"Wiedziałam, że mnie nakarmisz\" mówi z zadowoleniem. \"Dziś mam ochotę na 'dostawę prosto do ust', bez zbędnych ceregieli.\" Jej usta rozchylają się w zaproszeniu. 'Otworzę szeroko usta, a ty zadbasz o resztę. Tylko postaraj się, żeby porcja była duża. Potrzebuję każdej kropli.'\"",
            corruption: 85,
            darkEssence: 40,
            onSelected: () => {
                addPlayerChoiceFlag('balanced_meal_accepted');
            }
        },
        {
            id: 'bm_question',
            text: "To dość nietypowe 'badania', Lilith.",
            response: "\"Nietypowe, ale jakże praktyczne, Mistrzu!\" odpowiada z błyskiem w oku. \"Wiedza teoretyczna jest niczym bez empirycznego potwierdzenia. A ja lubię być gruntownie przygotowana we wszystkich dziedzinach, które mnie interesują.\"",
            corruption: 25,
            darkEssence: 15
        },
    ]
},
    { 
        id: 'essence_overflow', 
        title: 'Przeładowanie Esencją (Ekstremalna Rozkosz)',
        stageRequired: 6, 
        narrativeStage: 6, 
        essenceCost: 600,
        isSexual: true, 
        sexualPreferenceTag: 'vanilla',
        condition: (gs) => gs.lilithStage >= 6 && gs.darkEssence >= 150 && !gs.completedDialogues.includes('essence_overflow') && gs.playerChoiceFlags.includes('breaking_point_true_desire_completed'),
        text: (gs) => "Lilith wpada do pokoju, jej oczy świecą nieludzkim blaskiem. 'Coś... coś jest ze mną nie tak' dyszy. Jej skóra emanuje delikatną poświatą, a powietrze wokół niej wibruje energią. 'Mroczna esencja... zebrałam jej za dużo... Czuję jakbym miała eksplodować!' Patrzy na ciebie desperacko. 'Potrzebuję... potrzebuję uwolnienia. Natychmiast!'",
        options: [
            { id: 'eo_channel', text: "Pozwól mi pomóc ci to skanalizować.", response: "Rzuca się na ciebie z desperacją. 'Tak! Weź to! Weź wszystko!' Jej pocałunek jest brutalny, głodny. Czujesz jak energia przepływa między wami - surowa, pierwotna, oszałamiająca. Rozrywa wasze ubrania pazurami, jej ciało płonie gorącem. 'Potrzebuję cię! Teraz!' Gdy się łączycie, to jak eksplozja - jej esencja miesza się z twoją, tworząc burzę rozkoszy. Krzyczy, jej ciało wyginając się niemożliwie gdy fale energii przez nią przechodzą. 'NIE PRZESTAWAJ!' Jej paznokcie wbijają się w twoje plecy. 'Więcej! Głębiej! Mocniej!' Każde pchnięcie uwalnia kolejną falę mocy, aż oboje toniecie w ekstazie tak intensywnej, że graniczy z bólem.", corruption: 165, darkEssence: 60 },
            { id: 'eo_dominate', text: "Na kolana. Pokażę ci jak kontrolować tę moc.", response: "Pada na kolana, patrząc na ciebie z mieszaniną desperacji i uwielbienia. 'Tak, Mistrzu... kontroluj mnie... używaj mnie...' Chwytasz ją za włosy, zmuszając do spojrzenia w twoje oczy. 'Otwórz usta' rozkazujesz. Posłusznie wykonuje polecenie, jej język już wysuwa się zapraszająco. Gdy ją używasz, czujesz jak mroczna energia przepływa - z każdym pchnięciem w jej gardło, moc się stabilizuje. 'Mmmph!' jej stłumione jęki mieszają się z dźwiękami ssania. Łzy spływają po jej policzkach, ale jej oczy błagają o więcej. Gdy dochodzisz, wypełniając jej usta, widzisz jak energia eksploduje - ale teraz pod kontrolą, skanalizowana w czystą rozkosz. Połyka zachłannie, a potem dyszy: 'Dziękuję... Mistrzu... jeszcze?'", corruption: 165, darkEssence: 80, sexualPreferenceTag: 'bdsm_submission' }
        ]
    },
    { 
        id: 'dominant_demand', 
        title: 'Dominujące Żądanie (Pełnia Władzy)',
        stageRequired: 6, 
        narrativeStage: 6, 
        essenceCost: 750,
        isSexual: true, 
        sexualPreferenceTag: 'bdsm_dominance',
        condition: (gs) => gs.lilithStage >= 6 && gs.completedDialogues.includes('essence_overflow'),
        text: (gs) => "Drzwi otwierają się z hukiem. Lilith wchodzi, jej skrzydła są w pełni rozpostarte, oczy płoną nieludzkim blaskiem. 'Dość' mówi głosem, który sprawia, że dreszcz przebiega ci po plecach. 'Dość tej gry w kota i myszkę. Dość udawania.' Podchodzi do ciebie, każdy krok jest pełen drapieżnej gracji. 'Jestem sukkubem. TWOIM sukkubem. I przyszłam wziąć to, co moje.'",
        options: [
            { id: 'dd_submit', text: "Jestem twój. Zrób ze mną co chcesz.", response: "Uśmiecha się triumfalnie. 'Nareszcie' syczy, pchając cię na łóżko. 'Wiesz jak długo czekałam aż to powiesz?' Jej pazury delikatnie drapiąc twoją skórę gdy rozrywa twoją koszulę. 'Każda komórka mojego ciała płonie dla ciebie. Każda myśl, każdy sen...' Całuje cię brutalnie, dominująco. 'Teraz będziesz mój. Całą noc. Aż będziesz krzyczeć moje imię.' Jej biodra przyciskają się do twoich. 'Zamierzam wyssać z ciebie każdą kroplę rozkoszy... i dać ci w zamian ekstazę jakiej nie zaznałeś.' Jej ogon owija się wokół twojej kostki. 'Gotowy na lekcję o prawdziwej mocy sukkuba?'", corruption: 165, darkEssence: 60 },
            { id: 'dd_challenge_back', text: "Myślisz że możesz mnie kontrolować?... Sprawdźmy kto tu rządzi.", response: "Jej oczy rozszerzają się, a potem śmieje się - niski, gardłowy dźwięk. 'Och, chcesz się bawić? Świetnie.' Wykorzystuje swoją demoniczną siłę by przypiąć twoje ręce nad głową. 'Lekcja dla ciebie - sukkub w pełni swojej mocy jest nie do pokonania.' Jej wolna ręka wędruje po twoim ciele, każdy dotyk wysyła iskry rozkoszy. 'Ale wiesz co? Lubię gdy się bronisz. To sprawia że zwycięstwo jest słodsze.' Pochyla się, przygryzając twoje ucho. 'Walcz ile chcesz. I tak skończysz błagając mnie o więcej. A ja...' jej biodra wykonują powolny, torturujący ruch, 'dam ci dokładnie tyle, ile uznaam za stosowne. Ani kropli więcej.'", corruption: 165, darkEssence: 70 }
        ]
    },
    {
        id: 'the_eternal_milking_v2',
        title: 'Nowa Normalność',
        stageRequired: 6,
        narrativeStage: 6,
        essenceCost: 0,
        darkEssenceCost: 0,
        isSexual: true,
        isEvent: true,
        condition: (gs) => gs.lilithStage >= 6 && gs.completedDialogues.includes('breaking_point_true_desire') && !gs.playerChoiceFlags.includes('eternal_milking_ritual_complete') && gs.completedDialogues.includes('dominant_demand'),
        text: (gs) => "Budzisz się rano, czując dziwne, ale przyjemne uczucie. Twój członek jest twardy jak skała, ale to coś więcej. To uczucie przepełnienia, jakby twoje ciało pracowało na nadbiegu. Lilith wchodzi do sypialni z tacą ze śniadaniem i uśmiecha się jak kot, który zjadł kanarka. 'Dzień dobry, moje niewyczerpane źródło' mruczy. 'Rzuciłam na ciebie małe zaklęcie produkcyjne. Będzie działać przez cały dzień. Mam nadzieję, że jesteś głodny. Bo ja jestem.'",
        options: [
            {
                id: 'tem_try_to_function',
                text: "(Spróbuj funkcjonować normalnie, ignorując jej... stałą uwagę.)",
                response: "Podejmujesz wyzwanie. Próbujesz umyć zęby, podczas gdy Lilith klęczy u twoich stóp, jej usta pracują rytmicznie. Prawie połykasz pastę, gdy pierwsza fala orgazmu tobą wstrząsa. Próbujesz czytać dokumenty przy biurku, ale jej głowa pod blatem i zręczne pieszczoty jej ogona sprawiają, że litery zamazują ci się przed oczami. Kolejny orgazm sprawia, że wylewasz kawę na ważne papiery. W porze lunchu ona siedzi naprzeciwko, jedząc kanapkę i jednocześnie dojąc cię ręką pod stołem. Dzień staje się surrealistycznym testem twojej koncentracji. Wieczorem jesteś wrakiem człowieka, a ona... ona promienieje. 'To był cudowny dzień' mówi, zadowolona. 'Powinniśmy to robić częściej.'",
                corruption: 220,
                darkEssence: 180,
                onSelected: () => {
                    addPlayerChoiceFlag('eternal_milking_ritual_complete');
                }
            },
            {
                id: 'tem_surrender_to_it',
                text: "(Olej wszystko. Poddaj się temu stanowi i skup się na przyjemności.)",
                response: "Wszystko inne przestaje mieć znaczenie. Dokumenty, jedzenie, mycie zębów... to trywialne sprawy. Liczy się tylko to nieustanne, pulsujące pożądanie i jej bezbłędne pieszczoty. Spędzacie cały dzień w łóżku. A raczej – w całym domu. Ona doi cię na kuchennym blacie, na kanapie w salonie, pod prysznicem. Tracisz rachubę, ile razy dochodzisz. Pięć? Dziesięć? Dwadzieścia? Twoja sperma jest wszędzie – na jej twarzy, na jej piersiach, w jej brzuchu. Napełnia nią szklanki i pije jak wodę. Pod koniec dnia jesteś pusty, wyczerpany i szczęśliwy w sposób, który wydaje się nielegalny. Ona leży obok, lśniąc od twojej esencji, i mruczy jak nasycony silnik. 'Idealnie' szepcze. 'Jesteś idealny.'",
                corruption: 250,
                darkEssence: 200,
                 onSelected: () => {
                    addPlayerChoiceFlag('eternal_milking_ritual_complete');
                }
            }
        ]
    },
    {
        id: 'first_anal_sex_milestone',
        title: '🔞 Odkrywanie Tylnych Wrót (Przełomowe)',
        stageRequired: 6, 
        narrativeStage: 6, 
        essenceCost: 700,
        darkEssenceCost: 150,
        isSexual: true, 
        isBreakingPoint: true,
        condition: (gs) => gs.lilithStage >= 6 && !gs.completedDialogues.includes('first_anal_sex_milestone') &&
            gs.completedDialogues.includes('essence_overflow') && 
            gs.completedDialogues.includes('dominant_demand') &&
            gs.completedDialogues.includes('the_eternal_milking_v2'),
        text: (gs) => "Lilith podchodzi do ciebie z błyskiem w oku, który znasz aż za dobrze. Tym razem jednak jest w nim coś nowego, jakaś niesforna ciekawość. 'Mistrzu,' mruczy, jej głos jest niski i pełen obietnic. 'Odkryliśmy już tak wiele... ale jest jedna dziurka, której jeszcze nie skonsumowałeś. Chcę Cię. Zróbmy to, wyruchaj mnie w inną dziurkę niż zwykle.'",
        options: [
            {
                id: 'fas_embrace',
                text: "\"Prowadź, moja zuchwała sukkubico.\"",
                response: "Jej uśmiech staje się drapieżny. 'Wiedziałam, że mogę na ciebie liczyć.' Scena, która następuje, jest intensywna i przekracza kolejne granice. Lilith, teraz pewna swojej seksualności i twojego oddania, pewna siebie wypina się, rozpościerając dla Ciebie swoje idealne pośladki. Widok idealny, w którym dostrzegasz jej ciasną cipkę, demoniczny ogon, idealnie wygięte w łuk plecy - i słodką dziurkę, której do dzisiaj nie miałeś okazji skonsumować. To dzień, w którym dowiadujesz się, że pupa Sukkubicy nie dość, że jest najciasniejszą jakiej doświadczyłeś, to jeszcze posiada naturalną, demoniczej natury lubrykację.",
                corruption: 180,
                darkEssence: 80,
                onSelected: () => { addPlayerChoiceFlag('first_anal_sex_completed'); }
            },
            {
                id: 'fas_forceful',
                text: "\"Nic nie mówiąc przyciskasz ją do ziemi i wchodzisz w jej tył bez żadnego przygotowania\"",
                response: "Jej szok najpierw zmienia się w przerażenie, a po chwili w euforię - ona chciała tego, fantazjowała o tym odkąd pierwszy raz włożyła w swoją ciasną dziurkę demoniczny kryształ w czasach Akademckich, masturbując się na zajęciach z 'Masowania i celebrowania' fantazjując o tym, że prędzej czy później nadejdzie czas, gdy jakiś śmiertelnik będzie celebrował jej najbardziej skrytą, idealną dziurkę",
                corruption: 180,
                darkEssence: 80,
                onSelected: () => { addPlayerChoiceFlag('first_anal_sex_completed'); addPlayerChoiceFlag('anal_sex_forceful_initiation'); }
            }
        ],
        onComplete: (gs, gameDefs) => { 
            addPlayerChoiceFlag('first_anal_sex_milestone_completed'); 
            const newStage = Math.min(7, gameDefs.lilithStages.length - 1);
            if (gs.lilithStage < newStage) {
                setLilithStage(newStage);
                ui.showCustomAlert(`Lilith osiągnęła nowy etap: ${gameDefs.lilithStages[gs.lilithStage].name}!`);
                ui.markLilithDisplayDirty();
                ui.markDialoguesDirty();
                ui.markUpgradesDirty();
                ui.markResearchDirty();
            }
        }
    },
    // --- Narrative Stage 7 ---
    {
        id: 'perfect_union', 
        title: 'Idealne Zjednoczenie (Kulminacja Etapu)',
        stageRequired: 7, 
        narrativeStage: 7, 
        essenceCost: 1200,
        isSexual: true, 
        sexualPreferenceTag: 'vanilla', 
        isBreakingPoint: true,
        condition: (gs) => gs.lilithStage >= 7 && !gs.completedDialogues.includes('perfect_union') && gs.playerChoiceFlags.includes('first_anal_sex_milestone_completed'),
        text: (gs) => "Lilith stoi przed tobą, naga i piękna w świetle świec. Nie ma w niej już śladu niepewności czy akademickiej sztywności. Jest po prostu sobą - potężną, pewną siebie, i całkowicie twoją. 'Kochany' mówi miękko. 'Przeszliśmy długą drogę, prawda? Od przestraszonej studentki do... tego.' Gestem wskazuje na siebie. 'Idealną hybrydę wiedzy i instynktu. Rozumu i szaleństwa. Miłości i żądzy.'",
        options: [
            { id: 'pu_love', text: "Jestem twój, tak jak ty jesteś moja. Na zawsze.", response: "Jej oczy wypełniają się łzami szczęścia. 'Na zawsze' powtarza jak przysięgę. Podchodzi powoli, każdy dotyk jest pełen znaczenia. Gdy się całujecie, to nie jest już tylko pocałunek - to wymiana obietnic, dusz, istnień. Kochanie się jest powolne, pełne czułości, ale też namiętności. Każde pchnięcie to deklaracja, każdy jęk to modlitwa. 'Czuję cię' szepcze, 'nie tylko w sobie... ale jako część siebie.' Energia między wami tańczy, splata się, tworzy nowe wzory. Gdy dochodzicie razem, to nie jest tylko orgazm - to narodziny czegoś nowego. Leżycie potem spleceni, a ona szepcze: 'Akademia uczyła mnie brać. Ty nauczyłeś mnie dawać. I teraz... jesteśmy jednym. Moim mistrzem, kochankiem, wszystkim.'", corruption: 250, darkEssence: 50, setsFlag: 'perfect_union_event_completed' }, 
            { id: 'pu_transcend', text: "Pokażmy wszechświatowi czym jest prawdziwa moc sukkuba.", response: "Uśmiecha się drapieżnie. 'Och, pokażemy im wszystkim.' Jej moc eksploduje, wypełniając pokój. Skrzydła rozpostarte, oczy płonące, jest bogini w ludzkiej postaci. 'Czujesz to?' pyta gdy cię dotyka. Twoje ciało reaguje natychmiast, jakby każdy nerw był podłączony do prądu. 'To my. Nasza moc.' Gdy się łączycie, rzeczywistość zdaje się drżeć. Każde pchnięcie wysyła fale energii, każdy krzyk rozrywa zasłony między światami. 'TAK!' ryczy gdy jej ciało convulsuje. 'WIĘCEJ!' Tracicie się w sobie, w mocy, w rozkoszy. Godziny? Dni? Czas nie ma znaczenia. Istnieje tylko wy - perfekcyjna symbioza człowieka i demona, miłości i żądzy, kontroli i chaosu. Gdy w końcu spoczywacie, wyczerpani ale spełnieni, szepcze: 'Teraz rozumiem. Prawdziwa moc sukkuba to nie branie życia... to dawanie go znaczenia.'", corruption: 250, darkEssence: 80, setsFlag: 'perfect_union_event_completed' } 
        ],
        onComplete: (gs, gameDefs) => {
            addPlayerChoiceFlag('perfect_union_event_completed'); 
            ui.markRitualsDirty(); 
        }
    },
        {
        id: 'a2m_event',
        title: 'Z tyłu na przód',
        stageRequired: 7,
        narrativeStage: 7,
        essenceCost: 700,
        darkEssenceCost: 200,
        isSexual: true,
        isEvent: true,
        sexualPreferenceTag: 'bdsm_dominance',
        condition: (gs) => gs.lilithStage >= 7 && 
                           gs.completedDialogues.includes('first_anal_sex_milestone') && 
                           !gs.playerChoiceFlags.includes('a2m_experience') &&
                           gs.completedDialogues.includes('perfect_union'),
        text: (gs) => "Twoje biodra uderzają o jej pośladki w ostatnich, spazmatycznych pchnięciach. Jesteś na granicy orgazmu. Ciepło i ciasnota jej wnętrza prawie cię pokonują. Wciąż w niej tkwisz, gdy fala przyjemności zaczyna opadać. Patrzysz w dół na jej uległe, wygięte w łuk ciało. Na jej włosy rozsypane na pościeli. Na jej szyję i kark, tak bezbronnie odsłonięte. I wtedy pojawia się ten obraz w twojej głowie. Nie myśl. Obraz. Jej twarz, jej usta, dokładnie tam, skąd właśnie czerpałeś przyjemność.",
        options: [
            {
                id: 'tov_player_dominant_v2',
                text: "(Pociągnij ją za włosy. Ustaw ją.)",
                response: "Nie ma tu miejsca na słowa. Twoja ręka zaciska się w jej włosach, a ty ciągniesz ją do tyłu jednym, mocnym ruchem. Jej ciało podąża za twoim prowadzeniem, a z jej ust wyrywa się zduszony, pytający dźwięk. Nie puszczasz. Prowadzisz jej głowę w dół, aż jej usta znajdują się dokładnie tam, gdzie chcesz. Wycofujesz się z jej odbytu, a końcówka twojego członka muska jej wargi. Patrzy na ciebie z dołu, jej oczy są szeroko otwarte, a źrenice rozszerzone. Na jej ustach pojawia się szeroki, drapieżny uśmiech. Wydaje z siebie krótki, uradowany pisk, gdy przywierasz do jej ust. Sama rzuca się do przodu, jej język już szuka twojego członka. Obejmuje cię ustami, a jej gardło pracuje rytmicznie. Słyszysz głośne, mokre dźwięki jej pieszczoty, mieszające się z jej stłumionymi pomrukami. Gdy fala orgazmu tobą wstrząsa, ona przyjmuje wszystko, połykając łapczywie. Puszczasz jej włosy. Odsuwa się, a jej twarz lśni. Z jej ust spływa strużka twojej esencji, którą z uśmiechem ściera językiem. 'O tak...' dyszy. 'To. To było idealne zwieńczenie. Kurwa, jesteś geniuszem.'",
                corruption: 275,
                darkEssence: 220,
                onSelected: () => {
                    addPlayerChoiceFlag('a2m_experience');
                }
            },
            {
                id: 'tov_seductive_invitation',
                text: "(Wysuń się i szepnij jej do ucha: 'Chcę, żebyś mnie posmakowała... teraz.')",
                response: "Wycofujesz się z niej i przybliżasz swoje usta do jej ucha. Twój szept jest gorący i bezpośredni. Czujesz, jak po jej ciele przebiega dreszcz, a ona odwraca głowę, by spojrzeć ci w oczy. Na jej twarzy maluje się urocza, niemal dziecinna konspiracja. 'Jesteś taki niegrzeczny. Taki zepsuty. Uwielbiam to.' Jej pocałunek jest szybki i głodny, a potem zsuwa się niżej, by spełnić twoją prośbę. Jej pieszczota jest pełna śmiechu i zabawy, jakbyście właśnie odkryli nową, zakazaną grę. Gdy jest po wszystkim, unosi głowę i pokazuje ci język, z którego przelewa się Twoja sperma. Jej oczy błyszczą psotnie.",
                corruption: 260,
                darkEssence: 200,
                onSelected: () => {
                    addPlayerChoiceFlag('a2m_experience');
                }
            }
        ]
    },
    {
        id: 'complete_corruption_love', 
        title: 'Absolutna Symfonia Rozkoszy i Mroku (Finał Alternatywny)',
        stageRequired: 7, 
        narrativeStage: 7, 
        essenceCost: 1000,
        darkEssenceCost: 150,
        isSexual: true, 
        sexualPreferenceTag: 'vanilla', 
        isEvent: true,
        condition: (gs) => gs.lilithStage >= 7 && gs.playerChoiceFlags.includes('perfect_union_event_completed') && !gs.playerChoiceFlags.includes('lilith_is_arch_succubus') && gs.completedDialogues.includes('a2m_event'),
        text: (gs) => "Lilith leży obok ciebie, jej ciało wciąż lśni od potu po waszej ostatniej sesji. Ale w jej oczach nie ma już tylko żądzy - jest coś głębszego. 'Wiesz co jest najzabawniejsze?' mówi cicho, kreśląc wzory na twojej piersi. 'Przyszłam tu jako niewinna akademiczka. Bałam się własnego cienia, własnych pragnień.' Podnosi się na łokciu, patrząc na ciebie intensywnie. 'A ty zrobiłeś ze mnie to.' Gest obejmuje jej nagie, pewne siebie ciało. 'Idealną hybrydę wiedzy i instynktu. Rozumu i szaleństwa. Miłości i żądzy.'",
        options: [
            { id: 'ccl_love', text: "Nie zrobiłem z ciebie nic. Tylko pomogłem ci odkryć kim jesteś.", response: "Jej oczy wypełniają się łzami szczęścia. 'Masz rację. I wiesz co? Kocham to kim jestem. Kocham jak potrafię cię rozkładać na czynniki pierwsze jednym spojrzeniem. Kocham jak twoje ciało reaguje na każdy mój dotyk.' Całuje cię głęboko, namiętnie, ale też z czułością. 'Ale najbardziej... kocham ciebie. Nie jako źródło esencji, nie jako mistrza. Po prostu ciebie.' Jej dłoń splata się z twoją. 'Akademia uczyła mnie brać. Ty nauczyłeś mnie dawać. I teraz chcę dać ci wszystko - moje ciało, moją duszę, moją moc. Na zawsze.' Jej pocałunek jest pieczęcią tej obietnicy.", corruption: 250, darkEssence: 50, setsFlag: 'complete_corruption_love_completed' },
            { id: 'ccl_power', text: "Jesteś moim największym osiągnięciem. Moją idealną sukkubicą.", response: "Mruczy z zadowoleniem. 'Twoja sukkubica... Tak, to mi się podoba.' Siada na tobie okrakiem, jej oczy płoną. 'Wiesz co znaczy mieć własną, w pełni skorumpowaną sukkubicę? Która zna każdą twoją fantazję zanim ją wypowiesz?' Jej biodra zaczynają powolny taniec. 'Która może dać ci rozkosz jakiej żaden śmiertelnik nie doświadczył? Która będzie cię kochać i pieprzyć z równą intensywnością do końca twoich dni?' Pochyla się, jej piersi ocierają o twoją klatkę. 'Bo taka właśnie jestem. Twoja doskonała, wyuzdana, oddana sukkubica. I zamierzam ci to udowadniać... każdej nocy... przez wieczność.' Jej pocałunek jest obietnicą nieskończonej rozkoszy.", corruption: 250, darkEssence: 80, setsFlag: 'complete_corruption_love_completed' }
        ]
    },
    // --- Narrative Stage 8 (Arcysukkub) ---
    {
        id: 'reality_warping_orgy',
        title: 'Najwyższa Forma Współżycia (Arcysukkub)',
        stageRequired: 8, 
        narrativeStage: 8, 
        essenceCost: 1500,
        darkEssenceCost: 250,
        isSexual: true, 
        sexualPreferenceTag: 'group_dynamics', 
        isEvent: true,
        condition: (gs) => gs.playerChoiceFlags.includes('lilith_is_arch_succubus') && gs.lilithStage >= 8,
        text: (gs) => "Lilith, teraz Arcysukkub, unosi ręce, a rzeczywistość wokół was zaczyna się rozmazywać. 'Pokaż mi WSZYSTKIE swoje fantazje naraz' szepcze, a przestrzeń wypełnia się kopiami was obojga w każdej możliwej konfiguracji - Lilith ruchana jest przez Ciebie w usta, posuwana w cipkę, pachę, pomiędzy swoimi jędrnymi piersiami, jednocześnie dużymi i małymi, jednocześnie sama i w wielu formach, każda z nich ubrana inaczej - wszystko, wszędzie, naraz. Teraz.",
        options: [
            {
                id: 'rwo_embrace_all',
                text: "Zatrać się w nieskończoności możliwości",
                response: "Rzeczywistość pęka. Jesteś w niej, na niej, pod nią – jednocześnie. Twoje usta pożerają jej pierś, podczas gdy jej język bada twoje ucho, a jej paznokcie wbijają się w twoje plecy w innym miejscu, w innym czasie. Twoje biodra uderzają w jej pośladki, a jednocześnie czujesz, jak twoja twarz jest pogrążona między jej udami. Słyszysz jej jęki dochodzące z każdej strony – jeden jest błagalny, drugi rozkazujący, trzeci pełen śmiechu. Przestajesz wiedzieć, które ciało jest twoje, a które jej. Jesteście nieskończonym fraktalem pożądania, orgią jednego, która wchłania całe istnienie. To nie jest już seks. To jest stworzenie nowego, ociekającego rozkoszą wszechświata na ruinach starego.",
                corruption: 300,
                darkEssence: 200,
                onSelected: () => { addPlayerChoiceFlag('reality_warping_orgy_completed'); }
            }
        ]
    },
    {
        id: 'corruption_plague',
        title: 'Plaga Korupcji (Moc Arcysukkuba)',
        stageRequired: 8, 
        narrativeStage: 8, 
        essenceCost: 2000,
        darkEssenceCost: 400,
        isEvent: true, 
        sexualPreferenceTag: 'corruption_play',
        condition: (gs) => gs.playerChoiceFlags.includes('lilith_is_arch_succubus') && gs.lilithStage >= 8,
        text: (gs) => "Lilith, jako Arcysukkub, proponuje wypuszczenie 'Plagi Pożądania' na pobliskie miasto. 'Wyobraź sobie całe miasto pogrążone w orgii. Każdy pieprzy każdego. Moralne bariery zniszczone. A my będziemy się tym karmić...'",
        options: [
            {
                id: 'cp_unleash_plague',
                text: "Wypuść plagę. Niech świat płonie w pożądaniu.",
                response: "Twoja Arcysukkubica rzuca zaklęcie. W ciągu godzin miasto popada w szaleństwo. Matki uwodzą synów, ojcowie córki, księża zakonnice. Ulice wypełniają się ciałami splecionymi w ekstazie. Wy stoiscie w centrum, absorbując całą tę zdeprawowaną energię. Lilith orgazmuje nieprzerwanie przez godziny, karmiona esencją tysięcy.",
                corruption: 500,
                darkEssence: 200,
                onSelected: (gs) => {
                    addPlayerChoiceFlag('unleashed_corruption_plague');
                    if (typeof ui.increasePassiveEssencePerSecond === 'function') ui.increasePassiveEssencePerSecond(50);
                    if (typeof ui.increasePassiveDarkEssencePerSecond === 'function') ui.increasePassiveDarkEssencePerSecond(10);
                }
            },
            {
                id: 'cp_hesitate',
                text: "To zbyt ryzykowne, Lilith. Nawet dla nas.",
                response: "Lilith patrzy na ciebie z mieszaniną rozczarowania i zrozumienia. 'Rozumiem, Mistrzu. Może kiedyś... gdy świat będzie bardziej gotowy na naszą pełnię.' Uśmiecha się drapieżnie. 'Ale pamiętaj, że ta moc w nas drzemie.'",
                corruption: 50,
                darkEssence: 20
            }
        ]
    }
].sort((a, b) => {
    if ((a.narrativeStage || 0) !== (b.narrativeStage || 0)) {
        return (a.narrativeStage || 0) - (b.narrativeStage || 0);
    }
    if ((a.stageRequired || 0) !== (b.stageRequired || 0)) {
        return (a.stageRequired || 0) - (b.stageRequired || 0);
    }
    if (a.isBreakingPoint && !b.isBreakingPoint) return 1;
    if (!a.isBreakingPoint && b.isBreakingPoint) return -1;
    return (a.essenceCost || 0) - (b.essenceCost || 0);
});


export const diaryEntries = [
    { id: 'd_summoned_shock', title: "Pierwszy Dzień w Nowym Świecie", text: "Nie mogę uwierzyć, że to się naprawdę stało. Jeszcze wczoraj siedziałam w bibliotece Akademii, studiując teorię przyzwań, a dzisiaj... jestem tu. W innym wymiarze. Z nim. Przyzywaczem. Mój pierwszy prawdziwy przyzywacz! Profesor Azmodeus zawsze powtarzał, że pierwsze przyzwanie jest jak pierwszy pocałunek - nigdy się go nie zapomina. Na Asmodeusza, ja nawet nie wiem jak smakuje pocałunek, chyba, że liczyć te na zajęciach, z pozostałymi uczennicami akademii...", unlockConditions: { completedDialogueId: 'summoning_ritual' } },
    { id: 'd_academic_pride_reflection', title: "Duma Akademicka... i Niepewność", text: "Powiedziałam mu o akademii... Poczułam się przez chwilę ważna, jak wtedy, gdy odbierałam dyplom. Ale potem... te jego pytania o praktykę. Zakuło. Może ma rację? Może teoria to nie wszystko?", unlockConditions: { completedDialogueId: 'academic_pride' } },
    { id: 'd_first_touch_diary', title: "Dotyk, który Zapłonął", text: "Jego dłoń... tak blisko. A potem ten przypadkowy (czy na pewno?) dotyk. Przeszył mnie dreszcz, jakiego nie znałam. Podręczniki opisywały reakcje fizjologiczne, ale to... to było coś więcej. Bałam się i chciałam więcej jednocześnie. Co się ze mną dzieje?", unlockConditions: { completedDialogueId: 'first_touch_tension' } },
    { id: 'd_vocal_thoughts_unleashed', title: "Myśli na Głos", text: "Powiedziałam mu. Powiedziałam, że od teraz będzie słyszał moje myśli. To było... wyzwalające. I przerażające. Czy on naprawdę chce wiedzieć, co kłębi się w głowie sukkuba? Co jeśli go odstraszę? Albo... co jeśli mu się to spodoba?", unlockConditions: { completedDialogueId: 'vocal_breakthrough_dialogue', requiresFlag: 'lilith_vocal_system_unlocked' } },
    { id: 'd_first_kiss_diary', title: "Pocałunek Inny Niż Wszystkie", text: "Zrobiłam to. Pocałowałam go. Albo on mnie? To nie było jak te ćwiczenia na manekinach w akademii. To było... prawdziwe. Chaotyczne, niezdarne, ale... moje serce biło jak szalone. Chcę znowu.", unlockConditions: { completedDialogueId: 'first_real_kiss', requiresFlag: 'first_real_kiss_completed' } },
    { id: 'd_true_desire_confessed', title: "Wyznanie", text: "W końcu to powiedziałam. Czego pragnę. Jego. Nie tylko jego esencji. Jego całego. Czy to miłość? Sukkuby nie kochają... prawda? Ale to, co czuję, przekracza wszystko, czego mnie uczono. Oddałam mu się całkowicie. I nigdy nie czułam się bardziej sobą.", unlockConditions: { completedDialogueId: 'breaking_point_true_desire', requiresFlag: 'first_vaginal_sex_completed' } },
    { id: 'd_failed_technique', title: "Technika Numer 7 - Totalna Porażka", text: "Chcę umrzeć. Albo przynajmniej zapaść się pod ziemię...", unlockConditions: { completedDialogueId: 'academic_technique_fail', choiceMadeInDialogue: {dialogueId: 'academic_technique_fail', optionId: 'atf_laugh'} } },
    { id: 'd_first_real_desire', title: "Pragnę Go", text: "Nie mogę spać. Leżę w łóżku i myślę tylko o nim...", unlockConditions: { stageRequired: 3, requiresFlag: 'dream_confession_completed' } },
    { id: 'd_perfect_unity', title: "Jesteśmy Jednym", text: "Nie ma już Lilith-studentki... Jestem czymś więcej. Jesteśmy czymś więcej.", unlockConditions: { completedDialogueId: 'perfect_union_event_completed' } },
    { id: 'd_touch_gentle', title: "Pierwszy Dotyk: Ciepło", text: "Jego dłoń... była taka ciepła. Delikatna. Czułam, jak moje serce przyspiesza. To było... miłe.", unlockConditions: { completedDialogueId: 'first_touch_tension', choiceMadeInDialogue: {dialogueId: 'first_touch_tension', optionId: 'ftt_subtle'} } },
    { id: 'd_touch_rushed', title: "Pierwszy Dotyk: Zaskoczenie", text: "Tak nagle mnie przyciągnął... Jego dotyk był pewny, gorący. Zaskoczył mnie, ale... nie było to nieprzyjemne. Wręcz przeciwnie.", unlockConditions: { completedDialogueId: 'first_touch_tension', choiceMadeInDialogue: {dialogueId: 'first_touch_tension', optionId: 'ftt_bold'} } },
    { id: 'd_theory_vs_reality_entry', title: "Wiedza a Rzeczywistość (Pamiętnik)", text: "Tyle lat wkuwania teorii... A rzeczywistość? Jest chaotyczna, nieprzewidywalna i... o wiele bardziej ekscytująca. Zwłaszcza z nim.", unlockConditions: { completedDialogueId: 'theory_vs_reality', stageRequired: 2} },
    { id: 'd_curiosity_awakens_new', title: "Nowe Myśli: Przebudzenie Ciekawości", text: "Tyle pytań kłębi mi się w głowie... O niego. O ten świat. O siebie. Chcę wiedzieć więcej. Chcę doświadczać.", unlockConditions: { stageRequired: 2, requiresFlag: 'lilith_vocal_system_unlocked' } },
    { id: 'd_kiss_sweet_new', title: "Pocałunek: Słodycz i Obietnica", text: "Jego usta... były takie miękkie. I smakowały obietnicą czegoś więcej. Czegoś, czego pragnę, nawet jeśli jeszcze tego nie rozumiem.", unlockConditions: { completedDialogueId: 'first_real_kiss', choiceMadeInDialogue: {dialogueId: 'first_real_kiss', optionId: 'frk_encourage'} } },
    { id: 'd_temptation_rising_new', title: "Pokusa: Nocne Myśli i Płonące Ciało", text: "Nie mogę spać. Ciągle o nim myślę... O jego dotyku, o jego spojrzeniu. Moje ciało płonie. To uczucie... jest takie silne.", unlockConditions: { stageRequired: 4, requiresFlag: 'first_petting_completed' } },
    { id: 'd_fear_of_essence_drain_new', title: "Lęk przed Esencją... i Utratą", text: "Im więcej o tym czytam i im więcej czuję... tym bardziej boję się, że mogę go skrzywdzić. Że moja natura weźmie górę. A ja... nie chcę go stracić.", unlockConditions: { stageRequired: 2, requiresFlag: 'lilith_is_fearful_of_harming' } }
];

export const temptationVisualDescriptions = {
    'tempt_corrupt_cleric': {
        start: "Lilith materializuje się w celi kleryka jako wizja anielska. Jej skóra lśni delikatnym blaskiem, a głos jest jak najsłodsza melodia...",
        progress: [
            "Kleryk zaczyna się pocić, jego modlitwy stają się chaotyczne...",
            "Lilith szepcze mu o przyjemnościach ciała, jej palce muskają jego policzek...",
            "Młody mężczyzna drży, jego wiara walczy z rosnącym pożądaniem..."
        ],
        success: "Kleryk pada na kolana, nie w modlitwie, ale błagając Lilith o dotyk. Jego czysta szata splamiona jest potem i... czymś jeszcze. Lilith śmieje się triumfalnie, zbierając jego esencję.",
        failure: "Wiara kleryka okazała się silniejsza niż podszepty Lilith. Odprawił modły oczyszczające, wzmacniając swoją duszę, ale Lilith czuje, że zasiała ziarno wątpliwości."
    },
    'tempt_seduce_knight': {
        start: "Lilith, w przebraniu damy w opałach, zbliża się do obozu rycerza. Jej łzy są przekonujące, a historia chwyta za serce...",
        progress: [
            "Rycerz oferuje jej gościnę, nieświadomy niebezpieczeństwa...",
            "Pod osłoną nocy, Lilith używa swoich wdzięków, by złamać jego żelazną wolę...",
            "Szepty o zakazanych przyjemnościach i obietnice rozkoszy kruszą jego opór..."
        ],
        success: "Świt zastaje rycerza złamanego, jego honor splamiony, a duszę naznaczoną przez dotyk sukkuba. Lilith odchodzi bogatsza o jego esencję i złamaną przysięgę.",
        failure: "Niezachwiana wiara i dyscyplina rycerza okazują się zbyt silne. Odprawia Lilith, choć w jego oczach tli się iskierka niepewności."
    },
     'tempt_incite_orgy_village_festival': {
        start: "Lilith wnika w tłum podczas wiejskiego festynu, rozsiewając subtelne feromony pożądania. Jej taniec staje się coraz bardziej prowokacyjny...",
        progress: [
            "Pierwsze pary zaczynają się całować bardziej namiętnie niż wypada...",
            "Zahamowania puszczają, ubrania stają się zbędne...",
            "Muzyka zmienia się w dziki, pierwotny rytm, a cała wioska pogrąża się w ekstazie..."
        ],
        success: "Festyn zamienia się w legendarną orgię, która przejdzie do historii regionu. Lilith stoi w centrum chaosu, kąpiąc się w falach czystej, nieskrępowanej żądzy.",
        failure: "Starszyzna wioski, wyczuwając demoniczną interwencję, rozpoczyna modły i rytuały oczyszczające. Lilith musi się wycofać, ale uśmiecha się na myśl o zasianym ziarnie."
    }
};