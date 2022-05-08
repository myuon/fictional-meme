const { app, BrowserWindow, shell, ipcMain, ipcRenderer } = require("electron");
const path = require("path");
const { npmUpgradeLatest } = require("./commands/npmUpgradeLatest");
const isDev = process.env.NODE_ENV === "development";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 550,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("dist/index.html");
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (isDev) {
    mainWindow.webContents.openDevTools({
      mode: "detach",
    });
  }
};

if (isDev) {
  require("electron-reload")(path.join(__dirname, ".."), {
    electron: path.join(__dirname, "../node_modules/.bin/electron"),
  });
}

app.whenReady().then(() => {
  ipcMain.on("npmUpgradeLatest", async (event, msg) => {
    const [replyPort] = event.ports;

    npmUpgradeLatest(msg, (data) => {
      replyPort.postMessage(data);
    });

    replyPort.close();
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
