'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

function getWishlistFilePath() {
  return path.join(app.getPath('userData'), 'wishlist.json');
}

function loadWishlist() {
  const filePath = getWishlistFilePath();
  if (!fs.existsSync(filePath)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!Array.isArray(data)) return [];
    return data.filter(item => item && Number.isSafeInteger(item.id) && typeof item.text === 'string');
  } catch (error) {
    console.error('Не вдалося прочитати wishlist.json:', error);
    return [];
  }
}

function saveWishlist(items) {
  if (!Array.isArray(items) || items.length > 10000 ||
      !items.every(item => item && Number.isSafeInteger(item.id) &&
        typeof item.text === 'string' && item.text.length <= 10000)) {
    throw new Error('Некоректні дані Wishlist');
  }
  const filePath = getWishlistFilePath();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');
  return true;
}

function createWindow() {
  const window = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 360,
    minHeight: 450,
    title: 'GlowBeauty Desktop',
    backgroundColor: '#fdf8f9',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  window.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  ipcMain.handle('wishlist:load', () => loadWishlist());
  ipcMain.handle('wishlist:save', (_event, items) => saveWishlist(items));
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
