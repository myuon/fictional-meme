const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  startNpmUpgradeLatest: (data, callback) => {
    const { port1, port2 } = new MessageChannel();
    ipcRenderer.postMessage("npmUpgradeLatest", data, [port2]);

    port1.onmessage = (event) => {
      callback(event.data);
    };
    port1.onclose = () => {
      console.log("startNpmUpgradeLatest closed");
    };
  },
});
