import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    typeText: (text: string) => ipcRenderer.invoke('type-text', text),
});
