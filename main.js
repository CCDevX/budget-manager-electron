// Import necessary Electron modules
const {app, BrowserWindow} = require('electron');
const path = require('path');

// Function that creates the main application window
function createWindow () {
    // Create a new browser window
    const win = new BrowserWindow({
        width: 1280,        // Window width in pixels
        height: 720,        // Window height in pixels
        webPreferences: {
            // Specify the preload file for secure operations
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    // Load the main HTML file into the window
    win.loadFile("index.html");
}

// Event triggered when Electron has finished initializing
app.whenReady().then(() => {
    // Create the main window on startup
    createWindow();

    // macOS specific event: when a user clicks on the dock icon
    app.on('activate', () => {
        // If no windows are open, create a new one
        if(BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // Event triggered when all windows are closed
    app.on('window-all-closed', () => {
        // On all platforms except macOS, quit the application
        // (on macOS, apps stay active even without open windows)
        if(process.platform !== 'darwin') {
            app.quit();
        }
    })
});