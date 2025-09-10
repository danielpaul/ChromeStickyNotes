# 📝 Chrome Sticky Notes Extension

A Chrome extension that allows you to create draggable sticky notes on any web page. Notes persist when you revisit pages, making it perfect for annotating websites, saving quick thoughts, or leaving reminders.

![Chrome Sticky Notes Demo](https://github.com/user-attachments/assets/e0f452e5-7852-49bc-8a33-6696aa5de5b8)

## ✨ Features

- **Create sticky notes on any webpage** - Click the floating + button or use keyboard shortcuts
- **Drag to reposition** - Move notes anywhere on the page with intuitive drag & drop
- **Double-click to edit** - Quickly edit note content with inline editing
- **Automatic persistence** - Notes are saved automatically and restored when you revisit pages
- **Keyboard shortcuts** - Use Ctrl+Shift+N to quickly create new notes
- **Clean, modern UI** - Built with Tailwind CSS and DaisyUI for a polished experience
- **Per-URL storage** - Notes are organized by page URL for perfect organization

## 🚀 How to Use

1. **Install the extension** in Chrome (load the `dist` folder as an unpacked extension)
2. **Navigate to any webpage** where you want to leave notes
3. **Create notes** by:
   - Clicking the yellow + button in the bottom-right corner
   - Using the keyboard shortcut Ctrl+Shift+N
   - Clicking "Create New Note" in the extension popup
4. **Edit notes** by double-clicking on them
5. **Move notes** by dragging them around the page
6. **Delete notes** by clicking the × button in the note header
7. **Manage all notes** through the extension popup (click the extension icon)

## 🛠️ Technical Details

Built with modern web technologies:

- **React 19** + **TypeScript** for robust component development
- **Chrome Extension Manifest V3** for security and performance
- **Vite** for fast development and optimized builds
- **Tailwind CSS** + **DaisyUI** for beautiful, responsive styling
- **Chrome Storage API** for reliable data persistence
- **Content Script injection** for seamless webpage integration
- **ESLint** + **Prettier** for code quality and consistency

## 📁 Project Structure

```
src/
├── content/
│   ├── Content.tsx              # Main entry point for content script
│   ├── StickyNotesManager.tsx   # Manages all notes on a page
│   └── StickyNote.tsx           # Individual draggable note component
├── popup/
│   └── Popup.tsx                # Extension popup interface
├── utils/
│   └── storage.ts               # Chrome storage utilities and types
├── background/
│   └── index.ts                 # Background service worker
└── manifest.ts                  # Chrome extension manifest definition
```

## 🏗️ Development

### Prerequisites

- Node.js 20+
- pnpm 8.15+

### Setup

```bash
# Clone the repository
git clone https://github.com/danielpaul/ChromeStickyNotes.git
cd ChromeStickyNotes

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint
```

### Loading in Chrome

1. Build the extension: `pnpm build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` folder
5. The extension is now ready to use!

## 🎯 Key Implementation Features

- **Drag & Drop**: Smooth dragging with viewport boundary constraints
- **Persistent Storage**: Notes saved per URL using Chrome's local storage
- **Rich Editing**: Inline text editing with keyboard shortcuts (Ctrl+Enter to save, Esc to cancel)
- **Responsive Design**: Notes adapt to different screen sizes
- **Error Handling**: Graceful handling of storage operations and edge cases
- **Performance Optimized**: Minimal bundle size and efficient rendering

## 🔧 Chrome Extension Permissions

- `activeTab`: Access to the current active tab for content script injection
- `storage`: Local storage for persisting sticky notes data

## 📝 License

This project is open source and available under the MIT License.
