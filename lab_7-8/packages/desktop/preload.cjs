
// preload.cjs
// Безпечний інтерфейс між Electron і сторінкою GlowBeauty.

const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Надаємо інтерфейсу тільки три дозволені функції
contextBridge.exposeInMainWorld("productsAPI", {
    list: (query) =>
        ipcRenderer.invoke("products:list", query),

    add: (text) =>
        ipcRenderer.invoke("products:add", text),

    remove: (id) =>
        ipcRenderer.invoke("products:remove", id)
});
