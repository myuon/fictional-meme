const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV !== "production";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("dist/index.html");
};

if (isDev) {
  require("electron-reload")(path.join(__dirname, ".."), {
    electron: path.join(__dirname, "../node_modules/.bin/electron"),
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
