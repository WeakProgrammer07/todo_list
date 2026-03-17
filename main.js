const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let tray;

// Create a sophisticated leaf icon for the tray
function createTrayIcon() {
    const size = 16;
    const canvas = Buffer.alloc(size * size * 4);

    // Elegant dark green
    const leafColor = { r: 61, g: 90, b: 74 };
    const stemColor = { r: 90, g: 122, b: 106 };

    // Clear canvas
    for (let i = 0; i < size * size; i++) {
        const offset = i * 4;
        canvas[offset] = 0;
        canvas[offset + 1] = 0;
        canvas[offset + 2] = 0;
        canvas[offset + 3] = 0;
    }

    // Leaf shape (more elegant)
    const leafPixels = [
        {x: 8, y: 1},
        {x: 7, y: 2}, {x: 8, y: 2}, {x: 9, y: 2},
        {x: 6, y: 3}, {x: 7, y: 3}, {x: 8, y: 3}, {x: 9, y: 3}, {x: 10, y: 3},
        {x: 5, y: 4}, {x: 6, y: 4}, {x: 7, y: 4}, {x: 8, y: 4}, {x: 9, y: 4}, {x: 10, y: 4}, {x: 11, y: 4},
        {x: 5, y: 5}, {x: 6, y: 5}, {x: 7, y: 5}, {x: 8, y: 5}, {x: 9, y: 5}, {x: 10, y: 5},
        {x: 6, y: 6}, {x: 7, y: 6}, {x: 8, y: 6}, {x: 9, y: 6},
        {x: 7, y: 7}, {x: 8, y: 7},
        {x: 8, y: 8}
    ];

    // Stem
    const stemPixels = [
        {x: 8, y: 9}, {x: 8, y: 10}, {x: 8, y: 11}
    ];

    // Fill leaf
    leafPixels.forEach(p => {
        if (p.x >= 0 && p.x < size && p.y >= 0 && p.y < size) {
            const offset = (p.y * size + p.x) * 4;
            canvas[offset] = leafColor.r;
            canvas[offset + 1] = leafColor.g;
            canvas[offset + 2] = leafColor.b;
            canvas[offset + 3] = 255;
        }
    });

    // Fill stem
    stemPixels.forEach(p => {
        if (p.x >= 0 && p.x < size && p.y >= 0 && p.y < size) {
            const offset = (p.y * size + p.x) * 4;
            canvas[offset] = stemColor.r;
            canvas[offset + 1] = stemColor.g;
            canvas[offset + 2] = stemColor.b;
            canvas[offset + 3] = 255;
        }
    });

    return nativeImage.createFromBuffer(canvas, { width: size, height: size });
}

function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    mainWindow = new BrowserWindow({
        width: 340,
        height: 500,
        x: width - 360,
        y: height - 520,
        alwaysOnTop: true,
        skipTaskbar: true,
        frame: false,
        transparent: true,
        resizable: true,
        minWidth: 280,
        minHeight: 380,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        show: false,
        backgroundColor: '#00000000'
    });

    mainWindow.loadFile('index.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });
}

function createTray() {
    const icon = createTrayIcon();
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show',
            click: () => {
                mainWindow.show();
            }
        },
        {
            label: 'Hide',
            click: () => {
                mainWindow.hide();
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Flora');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    });
}

app.whenReady().then(() => {
    createWindow();
    createTray();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    // Keep running in background
});

// IPC handlers
ipcMain.handle('minimize-window', () => {
    mainWindow.hide();
});

ipcMain.handle('quit-app', () => {
    app.isQuiting = true;
    app.quit();
});
