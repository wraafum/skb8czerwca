// timeoutManager.js

/**
 * Klasa do zarządzania timeoutami w całej aplikacji.
 * Zapobiega wyciekom pamięci przez centralizację tworzenia i czyszczenia timerów.
 * Implementuje wzorzec Singleton poprzez eksportowanie pojedynczej instancji.
 */
class TimeoutManager {
    constructor() {
        // Mapa przechowująca aktywne timeouty. Klucz to unikalna nazwa, wartość to ID timeoutu.
        this.timeouts = new Map();
        console.log("TimeoutManager zainicjalizowany.");
    }

    /**
     * Ustawia nowy timeout. Jeśli timeout o podanym kluczu już istnieje, jest on najpierw czyszczony.
     * @param {string} key - Unikalny klucz identyfikujący timeout.
     * @param {function} callback - Funkcja do wykonania po upływie czasu.
     * @param {number} delay - Opóźnienie w milisekundach.
     */
    set(key, callback, delay) {
        // Wyczyść istniejący timeout o tym samym kluczu, aby zapobiec duplikatom.
        this.clear(key);

        const id = setTimeout(() => {
            try {
                callback();
            } catch (e) {
                console.error(`Błąd w callbacku timeoutu '${key}':`, e);
            } finally {
                // Usuń z mapy po wykonaniu.
                this.timeouts.delete(key);
            }
        }, delay);

        this.timeouts.set(key, id);
    }

    /**
     * Czyści timeout o podanym kluczu, jeśli istnieje.
     * @param {string} key - Klucz timeoutu do wyczyszczenia.
     */
    clear(key) {
        if (this.timeouts.has(key)) {
            clearTimeout(this.timeouts.get(key));
            this.timeouts.delete(key);
        }
    }

    /**
     * Czyści wszystkie aktywne timeouty zarządzane przez menedżera.
     * Kluczowe do wywołania przy resetowaniu lub wczytywaniu gry.
     */
    clearAll() {
        // Używamy forEach do iteracji po mapie i wyczyszczenia każdego timeoutu.
        this.timeouts.forEach(id => clearTimeout(id));
        // Czyścimy samą mapę.
        this.timeouts.clear();
        console.log("Wszystkie zarządzane timeouty zostały wyczyszczone.");
    }
}

// Eksportujemy jedną, wspólną instancję menedżera dla całej aplikacji.
export const timeoutManager = new TimeoutManager();
