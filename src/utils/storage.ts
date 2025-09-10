// Storage utility functions for sticky notes
export interface StickyNote {
  id: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export const STORAGE_KEY_PREFIX = 'sticky_notes_';

// Get the storage key for the current URL
export function getStorageKey(url: string): string {
  // Normalize URL by removing hash and query parameters for consistency
  const normalizedUrl = new URL(url);
  return `${STORAGE_KEY_PREFIX}${normalizedUrl.origin}${normalizedUrl.pathname}`;
}

// Save notes for a specific URL
export async function saveNotesForUrl(
  url: string,
  notes: StickyNote[]
): Promise<void> {
  const key = getStorageKey(url);
  await chrome.storage.local.set({ [key]: notes });
}

// Load notes for a specific URL
export async function loadNotesForUrl(url: string): Promise<StickyNote[]> {
  const key = getStorageKey(url);
  const result = await chrome.storage.local.get([key]);
  return result[key] || [];
}

// Generate a unique ID for a note
export function generateNoteId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create a new sticky note with default properties
export function createNewNote(x: number = 100, y: number = 100): StickyNote {
  return {
    id: generateNoteId(),
    content: '',
    x,
    y,
    width: 200,
    height: 150,
    color: '#fef08a', // yellow-200
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// Save a single note by updating the notes array for the current URL
export async function saveNote(
  url: string,
  updatedNote: StickyNote
): Promise<void> {
  const notes = await loadNotesForUrl(url);
  const noteIndex = notes.findIndex((note) => note.id === updatedNote.id);

  if (noteIndex >= 0) {
    notes[noteIndex] = { ...updatedNote, updatedAt: Date.now() };
  } else {
    notes.push({ ...updatedNote, updatedAt: Date.now() });
  }

  await saveNotesForUrl(url, notes);
}

// Delete a note by ID
export async function deleteNote(url: string, noteId: string): Promise<void> {
  const notes = await loadNotesForUrl(url);
  const filteredNotes = notes.filter((note) => note.id !== noteId);
  await saveNotesForUrl(url, filteredNotes);
}
