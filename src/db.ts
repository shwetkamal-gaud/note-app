import type { Note } from "./types";

let db: IDBDatabase;
const NOTE = "notes";

export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((res, rej) => {
        const req = indexedDB.open("NotesDb", 1);
        req.onerror = () => rej(req.error);
        req.onsuccess = () => {
            db = req.result;
            res(db);
        };
        req.onupgradeneeded = () => {
            db = req.result;
            if (!db.objectStoreNames.contains(NOTE)) {
                db.createObjectStore(NOTE, { keyPath: "id" });
            }
        };
    });
};

const getStore = async (mode: IDBTransactionMode): Promise<IDBObjectStore> => {
    if (!db) {
        db = await openDB();
    }
    const tx = db.transaction(NOTE, mode);
    return tx.objectStore(NOTE);
};

export const addNote = async (note: Note): Promise<void> => {
    const store = await getStore("readwrite");
    return new Promise((res, rej) => {
        const req = store.add(note);
        req.onsuccess = () => res();
        req.onerror = () => rej(req.error);
    });
};

export const updateNote = async (note: Note): Promise<void> => {
    const store = await getStore("readwrite");
    return new Promise((res, rej) => {
        const req = store.put(note);
        req.onsuccess = () => res();
        req.onerror = () => rej(req.error);
    });
};

export const getNotes = async (): Promise<Note[]> => {
    const store = await getStore("readonly");
    return new Promise((res, rej) => {
        const req = store.getAll();
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
    });
};

export const deleteNote = async (id: string): Promise<void> => {
    const store = await getStore("readwrite");
    return new Promise((res, rej) => {
        const req = store.delete(id);
        req.onsuccess = () => res();
        req.onerror = () => rej(req.error);
    });
};
