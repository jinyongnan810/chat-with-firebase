import { app, BrowserWindow, Menu, Notification, Tray } from "electron";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-devtools-installer";
import isDev from "electron-is-dev";
import path from "path";
const isMac = process.platform === "darwin" ? true : false;
let mainWindow: BrowserWindow | null;
let tray: Tray | null;
const createMainWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      nativeWindowOpen: true,
    },
  });
  mainWindow.loadURL(
    // isDev
    //   ? "http://localhost:4000"
    //   :
    // url.format({
    //   pathname: path.join(__dirname, "index.html"),
    //   protocol: "file:",
    //   slashes: true,
    // })
    "https://realtime-demo-306d8.firebaseapp.com/"
  );
  if (isDev) {
    //install devtools
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));
    installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));
  }
  // menu
  const mainMenu = Menu.buildFromTemplate(menu as any);
  Menu.setApplicationMenu(mainMenu);
  new Notification({
    title: "Welcome",
    body: "App started.",
  }).show();
  mainWindow.on("close", (e) => {
    if (!(app as any).isQuitting) {
      e.preventDefault();
      mainWindow!.hide();
    }

    return true;
  });
  mainWindow.on("closed", () => (mainWindow = null));
  // tray
  const icon = path.join(__dirname, "assets", "icons", "tray_icon.png");
  tray = new Tray(icon);
  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: "Quit",
      click: () => {
        (app as any).isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.on("click", (e) => {
    if (mainWindow!.isVisible()) {
      mainWindow!.hide();
    } else {
      mainWindow!.show();
    }
  });
  tray.setContextMenu(trayContextMenu);
};
const menu = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  {
    role: "fileMenu",
  },
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];

app.on("ready", createMainWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// Stop error
app.allowRendererProcessReuse = true;

// events
