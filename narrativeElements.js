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

export { dialogues } from './data/dialogues.js';
export { diaryEntries } from './data/diaryEntries.js';
export { idleEvents } from './data/idleEvents.js';
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
