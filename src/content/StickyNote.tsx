/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import {
  deleteNote,
  saveNote,
  StickyNote as StickyNoteType,
} from '@utils/storage';

interface StickyNoteProps {
  note: StickyNoteType;
  onUpdate: (note: StickyNoteType) => void;
  onDelete: (noteId: string) => void;
}

export default function StickyNote({
  note,
  onUpdate,
  onDelete,
}: StickyNoteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const noteRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle mouse down for dragging
  const handleMouseDown = (e: MouseEvent) => {
    if (isEditing) return; // Don't drag while editing

    setIsDragging(true);
    const rect = noteRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    e.preventDefault();
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep note within viewport bounds
      const maxX = window.innerWidth - note.width;
      const maxY = window.innerHeight - note.height;
      const clampedX = Math.max(0, Math.min(maxX, newX));
      const clampedY = Math.max(0, Math.min(maxY, newY));

      const updatedNote = { ...note, x: clampedX, y: clampedY };
      onUpdate(updatedNote);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Save the note position
        saveNote(window.location.href, note);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, note, onUpdate]);

  // Handle content editing
  const handleEditStart = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleEditSave = async () => {
    const updatedNote = { ...note, content };
    onUpdate(updatedNote);
    await saveNote(window.location.href, updatedNote);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setContent(note.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteNote(window.location.href, note.id);
    onDelete(note.id);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div
      ref={noteRef}
      className='absolute z-[10000] cursor-move select-none shadow-lg'
      style={{
        left: `${note.x}px`,
        top: `${note.y}px`,
        width: `${note.width}px`,
        minHeight: `${note.height}px`,
        backgroundColor: note.color,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className='flex items-center justify-between bg-black bg-opacity-10 px-2 py-1'>
        <div className='flex-1 cursor-move' />
        <div className='flex gap-1'>
          {!isEditing && (
            <button
              type='button'
              className='h-5 w-5 rounded bg-blue-500 text-xs text-white hover:bg-blue-600'
              onClick={handleEditStart}
              title='Edit note'
            >
              ✎
            </button>
          )}
          {isEditing && (
            <>
              <button
                type='button'
                className='h-5 w-5 rounded bg-green-500 text-xs text-white hover:bg-green-600'
                onClick={handleEditSave}
                title='Save (Ctrl+Enter)'
              >
                ✓
              </button>
              <button
                type='button'
                className='h-5 w-5 rounded bg-gray-500 text-xs text-white hover:bg-gray-600'
                onClick={handleEditCancel}
                title='Cancel (Esc)'
              >
                ✕
              </button>
            </>
          )}
          <button
            type='button'
            className='h-5 w-5 rounded bg-red-500 text-xs text-white hover:bg-red-600'
            onClick={handleDelete}
            title='Delete note'
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className='p-2'>
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className='w-full resize-none border-none bg-transparent outline-none'
            style={{ minHeight: `${note.height - 40}px` }}
            placeholder='Type your note here...'
          />
        ) : (
          <div
            className='whitespace-pre-wrap break-words text-sm'
            style={{ minHeight: `${note.height - 40}px` }}
            onDoubleClick={handleEditStart}
          >
            {note.content || (
              <span className='italic text-gray-500'>Double-click to edit</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
