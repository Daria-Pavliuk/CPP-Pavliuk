'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('wishlistAPI', {
  loadItems: () => ipcRenderer.invoke('wishlist:load'),
  saveItems: (items) => ipcRenderer.invoke('wishlist:save', items)
});
