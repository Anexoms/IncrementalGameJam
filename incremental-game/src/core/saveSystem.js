const STORAGE_NAME = "save_the_game"

export function save_game(state) {
    try {
        const json = JSON.stringify(state);
        localStorage.setItem(STORAGE_NAME, json);
    } catch (err) {
        console.error("error: save", err);
    }
}

export function load_save() {
    try {
        const raw = localStorage.getItem(STORAGE_NAME);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        console.error("error:", err);
        return null;
    }
}

export function clear_save() {
    localStorage.removeItem(STORAGE_NAME);
}