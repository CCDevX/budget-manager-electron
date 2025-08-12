// Au tout début du fichier main.js
require("dotenv").config();

// Import necessary Electron modules
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const ipc = ipcMain;
const DataStore = require("nedb");
const fs = require("fs");
const { shell } = require("electron");

// Function that creates the main application window
function createWindow() {
  const isDev = process.env.NODE_ENV === "development";

  // Create a new browser window with a specific configuration
  const win = new BrowserWindow({
    // Window dimensions in pixels
    width: 1280, // Initial window width
    height: 720, // Initial window height

    // Minimum window size constraints
    minWidth: 1024, // Minimum allowed width
    minHeight: 640, // Minimum allowed height

    // Window behavior settings
    closable: true, // Allow window to be closed by user
    darkTheme: true, // Use dark theme for window decorations
    frame: false, // Hide window frame with title bar and controls

    // Application icon displayed in taskbar and window
    icon: path.join(__dirname, "./assets/img/budget.ico"),

    // Web security and integration preferences
    webPreferences: {
      // Enable Node.js integration in renderer for security
      nodeIntegration: true,

      // Disable context isolation
      contextIsolation: false,

      // Enable developer tools for debugging
      devTools: isDev,

      // Specify the preload script for secure communication between main and renderer processes
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load the main HTML file into the window
  win.loadFile("./index.html");

  // Automatically open developer tools (remove in production)
  if (isDev) {
    win.webContents.openDevTools();
  }

  //IPC function

  //Top Menu

  ipc.on("reduceApp", (event) => {
    win.minimize();
  });

  ipc.on("sizeApp", (event) => {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  });

  ipc.on("closeApp", (event) => {
    win.close();
  });

  ipc.on("reload", (event) => {
    win.reload();
  });

  ipc.on("exportPdf", () => {
    console.log("*** EXPORT PDF");
    // Chemin d'export
    var filepath = path.join(__dirname, "./export.pdf");
    // Options du PDF
    var options = {
      marginsType: 1,
      pageSize: "A4",
      printBackground: true,
      printSelectionOnly: false,
      landscape: false,
    };
    // Réaliser l'export + Manipuler le fichier
    win.webContents
      .printToPDF(options)
      .then((data) => {
        fs.writeFile(filepath, data, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("PDF Generated Successfully");
            // win.loadURL(filepath);
            shell.showItemInFolder(filepath);
            shell.openPath(filepath);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });

  //DB function
  const db = new DataStore({ filename: "data.db", autoload: true });
  ipc.on("addLigneToDb", (event, data) => {
    db.insert(data, (err, newRec) => {
      if (err !== null) {
        console.log(err);
      }

      console.log("Adding Ligne to Db", newRec);

      win.reload();
    });
  });
}

// Event triggered when Electron has finished initializing
app.whenReady().then(() => {
  // Create the main window on startup
  createWindow();

  // macOS specific event: when a user clicks on the dock icon
  app.on("activate", () => {
    // If no windows are open, create a new one
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Event triggered when all windows are closed
  app.on("window-all-closed", () => {
    // On all platforms except macOS, quit the application
    // (on macOS, apps stay active even without open windows)
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});
