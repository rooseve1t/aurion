const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const axios = require("axios");

let mainWindow;
let pythonProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: "Aurion Hybrid OS",
    backgroundColor: "#000000",
    frame: false, // Frameless window for that futuristic OS feel
  });

  // In production, load the built index.html
  // In development, you might want to load the dev server URL
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

function startPythonCore() {
  console.log("Запуск Python Core...");

  // In production, this would be the path to the compiled .exe
  const scriptPath = path.join(__dirname, "../python_core/main.py");

  pythonProcess = spawn("python", [scriptPath]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`[Python Core]: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`[Ошибка Python Core]: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python Core завершил работу с кодом ${code}`);
    // Implement auto-restart logic here
    if (code !== 0) {
      console.log("Перезапуск Python Core через 5 секунд...");
      setTimeout(startPythonCore, 5000);
    }
  });
}

async function checkBackendHealth() {
  try {
    const res = await axios.get("http://127.0.0.1:8000/health");
    if (res.data.status === "online") {
      console.log("Бэкенд в сети.");
      return true;
    }
  } catch (e) {
    console.log("Ожидание бэкенда...");
    return false;
  }
}

app.whenReady().then(() => {
  startPythonCore();

  // Wait for backend to be ready before showing window
  const checkInterval = setInterval(async () => {
    const isReady = await checkBackendHealth();
    if (isReady) {
      clearInterval(checkInterval);
      createWindow();
    }
  }, 1000);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (pythonProcess) {
      pythonProcess.kill();
    }
    app.quit();
  }
});

// IPC Communication Example
ipcMain.on("execute-command", async (event, arg) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/ai/execute", {
      command: arg,
    });
    event.reply("command-response", response.data);
  } catch (error) {
    event.reply("command-response", { error: "Бэкенд недоступен" });
  }
});
