import { useCallback, useEffect, useState } from 'react';
import {
  createNewNote,
  loadNotesForUrl,
  saveNotesForUrl,
  StickyNote as StickyNoteType,
} from '@utils/storage';

import StickyNote from './StickyNote';

export default function StickyNotesManager() {
  const [notes, setNotes] = useState<StickyNoteType[]>([]);
  const [showAddButton, setShowAddButton] = useState(true);

  // Load notes when component mounts
  useEffect(() => {
    const loadNotes = async () => {
      const loadedNotes = await loadNotesForUrl(window.location.href);
      setNotes(loadedNotes);
    };

    loadNotes();
  }, []);

  // Handle creating a new note
  const handleAddNote = useCallback(() => {
    // Position new notes slightly offset from existing ones
    const offset = notes.length * 20;
    const newNote = createNewNote(100 + offset, 100 + offset);

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveNotesForUrl(window.location.href, updatedNotes);
  }, [notes]);

  // Handle updating a note
  const handleUpdateNote = (updatedNote: StickyNoteType) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  };

  // Handle deleting a note
  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
    saveNotesForUrl(window.location.href, updatedNotes);
  };

  // Handle keyboard shortcut for adding new note (Ctrl+Shift+N)
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        handleAddNote();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleAddNote]);

  // Handle messages from popup
  useEffect(() => {
    const handleMessage = (message: { action: string }) => {
      if (message.action === 'createNote') {
        handleAddNote();
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, [handleAddNote]);

  return (
    <>
      {/* Floating Add Button */}
      {showAddButton && (
        <div
          className='fixed bottom-4 right-4 z-[10001]'
          style={{ position: 'fixed' }}
        >
          <button
            type='button'
            onClick={handleAddNote}
            className='h-12 w-12 rounded-full bg-yellow-400 text-2xl font-bold text-gray-800 shadow-lg transition-all duration-200 hover:bg-yellow-500 hover:shadow-xl'
            title='Add sticky note (Ctrl+Shift+N)'
          >
            +
          </button>
        </div>
      )}

      {/* Render all sticky notes */}
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          onUpdate={handleUpdateNote}
          onDelete={handleDeleteNote}
        />
      ))}

      {/* Toggle button visibility on right-click */}
      <div
        className='fixed inset-0 z-[-1]'
        onContextMenu={(e) => {
          e.preventDefault();
          setShowAddButton(!showAddButton);
        }}
        style={{ pointerEvents: showAddButton ? 'none' : 'auto' }}
      />
    </>
  );
}
