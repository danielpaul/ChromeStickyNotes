/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
import { JSX, useCallback, useEffect, useState } from 'react';

export default function Popup(): JSX.Element {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [noteCount, setNoteCount] = useState<number>(0);

  const loadNoteCount = useCallback(async (url: string) => {
    try {
      const normalizedUrl = new URL(url);
      const key = `sticky_notes_${normalizedUrl.origin}${normalizedUrl.pathname}`;
      const result = await chrome.storage.local.get([key]);
      const notes = result[key] || [];
      setNoteCount(notes.length);
    } catch (error) {
      console.error('Error loading note count:', error);
    }
  }, []);

  useEffect(() => {
    // Get current tab info
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
        // Load note count for current page
        loadNoteCount(tabs[0].url);
      }
    });
  }, [loadNoteCount]);

  const createNote = () => {
    // Send message to content script to create a new note
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'createNote' });
        window.close(); // Close popup after creating note
      }
    });
  };

  const clearAllNotes = async () => {
    if (
      confirm(
        'Are you sure you want to delete all sticky notes from this page?'
      )
    ) {
      try {
        const normalizedUrl = new URL(currentUrl);
        const key = `sticky_notes_${normalizedUrl.origin}${normalizedUrl.pathname}`;
        await chrome.storage.local.remove([key]);
        setNoteCount(0);

        // Refresh the page to remove notes
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.reload(tabs[0].id);
          }
        });
      } catch (error) {
        console.error('Error clearing notes:', error);
      }
    }
  };

  return (
    <div id='my-ext' className='w-80 p-4' data-theme='light'>
      <div className='mb-4 text-center'>
        <h1 className='text-lg font-bold text-yellow-600'>📝 Sticky Notes</h1>
        <p className='text-sm text-gray-600'>
          {noteCount > 0
            ? `${noteCount} note${noteCount === 1 ? '' : 's'} on this page`
            : 'No notes on this page'}
        </p>
      </div>

      <div className='space-y-2'>
        <button
          type='button'
          className='btn btn-primary w-full'
          onClick={createNote}
        >
          ➕ Create New Note
        </button>

        {noteCount > 0 && (
          <button
            type='button'
            className='btn btn-error btn-outline w-full'
            onClick={clearAllNotes}
          >
            🗑️ Clear All Notes
          </button>
        )}
      </div>

      <div className='mt-4 text-center text-xs text-gray-500'>
        <p>💡 Tips:</p>
        <p>• Use Ctrl+Shift+N to create notes</p>
        <p>• Double-click notes to edit</p>
        <p>• Drag notes to reposition</p>
      </div>
    </div>
  );
}
