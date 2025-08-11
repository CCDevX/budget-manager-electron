// Au tout début du fichier main.js
require("dotenv").config();

// Import necessary Electron modules
const { app, BrowserWindow } = require("electron");
const path = require("path");

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
    frame: true, // Show window frame with title bar and controls

    // Application icon displayed in taskbar and window
    icon: path.join(__dirname, "./assets/img/budget.ico"),

    // Web security and integration preferences
    webPreferences: {
      // Disable Node.js integration in renderer for security
      nodeIntegration: false,

      // Enable context isolation
      contextIsolation: true,

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
