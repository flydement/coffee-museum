const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('coffeeMuseumDesktop', {
  isDesktop: true,
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
  },
})
