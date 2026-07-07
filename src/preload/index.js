import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('iminoAPI', {
  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion')
  },
  backend: {
    getBaseUrl: () => ipcRenderer.invoke('backend:getBaseUrl')
  },
  clipboard: {
    writeText: (text) => ipcRenderer.invoke('clipboard:writeText', text)
  }
})
