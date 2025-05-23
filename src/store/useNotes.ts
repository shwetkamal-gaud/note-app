import { create } from 'zustand'; CloudSnow
import { addNote as dbAddNote, getNotes as dbGetNotes, updateNote as dbUpdateNote, deleteNote as dbDeleteNote } from '../db';
import type { Note } from '../types';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CloudSnow } from 'lucide-react';

const API_URL = 'https://682f12cc746f8ca4a47fb4a8.mockapi.io/api/v1/note'

type NoteStore = {
    notes: Note[];
    loading: boolean;
    count: number
    fetchNotes: () => Promise<void>;
    createNote: (note: { title: string, content?: string }) => Promise<void>;
    updateNote: (note: { title: string, content?: string, id: string }) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    syncNote: (note: Note) => Promise<void>
    syncAllNotes: () => Promise<void>
};

export const useNoteStore = create<NoteStore>((set, get) => ({
    notes: [],
    loading: false,
    count: Number(localStorage.getItem("note_count")) || 1,


    fetchNotes: async () => {
        set({ loading: true });
        const notes = await dbGetNotes();
        set({ notes, loading: false });
    },

    createNote: async (note) => {
        const currentCount = get().count;

        const newNote: Note = {
            id: currentCount.toString(),
            title: note.title,
            content: note?.content ?? '',
            updatedAt: new Date().toISOString(),
            synced: navigator.onLine,
        };
        if (navigator.onLine) {
            try {
                await axios.post(`${API_URL}`, newNote);
            } catch (error) {
                console.error('Failed to sync with API, falling back to offline mode');
                newNote.synced = false;
            }
        }
        const nextCount = currentCount + 1;
        localStorage.setItem("note_count", nextCount.toString())
        console.log(nextCount, currentCount, get().count)
        await dbAddNote(newNote);
        toast.success("Created Successfully")

        set({ notes: [newNote, ...get().notes], count: nextCount });
    },

    updateNote: async (note: { title: string, content?: string, id: string }) => {
        const updated = {
            ...note,
            updatedAt: new Date().toISOString(),
            synced: navigator.onLine,
        };
        if (navigator.onLine) {
            try {
                await axios.put(`${API_URL}/${note.id}`, updated);
            } catch (error) {
                console.error('Failed to sync with API, falling back to offline mode');
                updated.synced = false;
            }
        }
        await dbUpdateNote(updated);
        toast.success("Updated Successfully")
        set({
            notes: get().notes.map(n => (n.id === note.id ? updated : n)),
        });
    },

    deleteNote: async (id: string) => {
        if (navigator.onLine) {
            try {
                await axios.delete(`${API_URL}/${id}`);
            } catch (error) {
                console.error('Failed to delete on API, fallback to local only');
            }
        }
        await dbDeleteNote(id);
        toast.success("Deleted Successfully")
        set({ notes: get().notes.filter(note => note.id !== id) });
    },
    syncNote: async (note) => {
        try {
            if (!note.synced) {
                set({ loading: true });
                const res = await axios.post(API_URL, { ...note, synced: true })
                const updatedNote = { ...note, synced: true };
                await dbUpdateNote(updatedNote);
                set({
                    notes: get().notes.map(n => n.id === note.id ? updatedNote : n), loading: false
                });
            }

        }
        catch (e) {
            console.error(e)
        }
    },
    syncAllNotes: async () => {
        const unsyncedNotes = get().notes.filter(note => !note.synced);
        set({ loading: true });
        for (const note of unsyncedNotes) {
            try {
                const res = await axios.post(API_URL, { ...note, synced: true });
                const updatedNote = { ...note, synced: true };
                await dbUpdateNote(updatedNote);

            } catch (err) {
                console.error(`Failed to sync note: ${note.id}`);
            }
        }
        const refreshed = await dbGetNotes();
        set({ notes: refreshed, loading: false });
    }
}));
