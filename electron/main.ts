import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { keyboard, Key } from '@nut-tree-fork/nut-js';

// Configure nut.js to be faster
keyboard.config.autoDelayMs = 0;

let mainWindow: BrowserWindow | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        alwaysOnTop: true, // Keep the widget floating
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        frame: true, // Keep frame for moving, or set to false for custom drag
        transparent: false,
    });

    // In production, load the built file. In dev, load localhost.
    const isDev = process.env.NODE_ENV === 'development';
    const startUrl = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../dist/index.html')}`;

    mainWindow.loadURL(startUrl);

    // Open DevTools in dev mode
    // if (isDev) mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (mainWindow === null) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Handle typing requests from renderer
ipcMain.handle('type-text', async (event, text: string) => {
    try {
        // We need to type the text.
        // Wait a brief moment to ensure focus is correct if needed, though usually user clicks mic and then speaks.
        // Actually, if the user interacts with the app, the app has focus.
        // The user wants the app to type into ANOTHER window.
        // This implies the user must have the OTHER window focused, OR we need to switch focus.
        // But typically for voice dictation:
        // 1. User is in Word.
        // 2. User sees floating Voxa widget.
        // 3. User says "Start".
        // 4. Voxa types into Word.
        // Use case: "Launch it... they listen... transcribe in any window you are active"

        // To type in another window, Voxa must NOT steal focus permanently.
        // However, clicking the microphone button GIVES Voxa focus.
        // The user might need to click back to the target window, or we minimize/hide focus.
        // BUT, the user said "active on that particular moment".

        // Strategy:
        // When text is received, we assume the user has clicked back to the target window OR
        // we simply simulate keystrokes which go to the ACTIVE window.
        // If Voxa is focused, it types in Voxa.
        // To make this useful, Voxa should probably be non-focusable or return focus?
        // "Floating widget" usually implies it stays on top but maybe doesn't take focus?
        // Or user clicks "Mic", then clicks "Word", then talks.

        console.log(`Typing: ${text}`);
        await keyboard.type(text);
        return true;
    } catch (error) {
        console.error('Failed to type:', error);
        return false;
    }
});
