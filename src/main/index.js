import { app, BrowserWindow, clipboard, ipcMain, shell } from 'electron'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { appendFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const BACKEND_HOST = '127.0.0.1'
const BACKEND_PORT = Number(process.env.IMINO_BACKEND_PORT || 38765)
const BACKEND_BASE_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`

let mainWindow = null
let backendProcess = null

function logStartup(message, error) {
  const logPath = app.isPackaged
    ? join(process.resourcesPath, '..', 'imino-startup.log')
    : join(process.cwd(), 'imino-startup.log')
  const detail = error ? ` ${error.stack || error.message || String(error)}` : ''

  try {
    appendFileSync(logPath, `[${new Date().toISOString()}] ${message}${detail}\n`, 'utf8')
  } catch {
    // Logging must never prevent the app from starting.
  }
}

process.on('uncaughtException', (error) => {
  logStartup('uncaughtException', error)
})

process.on('unhandledRejection', (reason) => {
  logStartup('unhandledRejection', reason instanceof Error ? reason : new Error(String(reason)))
})

function createWindow() {
  logStartup('createWindow:start')
  const preloadPath =
    [join(__dirname, '../preload/index.mjs'), join(__dirname, '../preload/index.js')].find((candidate) =>
      existsSync(candidate)
    ) || join(__dirname, '../preload/index.mjs')
  logStartup(`createWindow:preload=${preloadPath}`)

  mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 920,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    logStartup('window:ready-to-show')
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    logStartup('window:closed')
    mainWindow = null
  })

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedUrl) => {
    logStartup(`window:did-fail-load code=${errorCode} desc=${errorDescription} url=${validatedUrl}`)
  })

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    logStartup(`window:render-process-gone reason=${details.reason} exitCode=${details.exitCode}`)
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    logStartup(`window:loadURL=${process.env.ELECTRON_RENDERER_URL}`)
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    const rendererPath = join(__dirname, '../renderer/index.html')
    logStartup(`window:loadFile=${rendererPath}`)
    mainWindow.loadFile(rendererPath)
  }
}

function resolveBackendLaunchConfig() {
  if (app.isPackaged) {
    const backendExePath = join(process.resourcesPath, 'backend', 'backend.exe')
    return {
      command: backendExePath,
      args: ['--host', BACKEND_HOST, '--port', String(BACKEND_PORT)],
      cwd: join(process.resourcesPath, 'backend'),
      exists: existsSync(backendExePath)
    }
  }

  const projectRoot = process.cwd()
  const backendScriptPath = join(projectRoot, 'backend', 'main.py')
  const venvPythonPath = join(projectRoot, 'backend', '.venv', 'Scripts', 'python.exe')

  return {
    command: process.env.PYTHON || (existsSync(venvPythonPath) ? venvPythonPath : 'python'),
    args: [backendScriptPath, '--host', BACKEND_HOST, '--port', String(BACKEND_PORT)],
    cwd: projectRoot,
    exists: existsSync(backendScriptPath)
  }
}

function startPythonBackend() {
  logStartup('backend:start')
  if (backendProcess) return

  const launchConfig = resolveBackendLaunchConfig()
  logStartup(`backend:command=${launchConfig.command} args=${launchConfig.args.join(' ')}`)

  if (!launchConfig.exists) {
    console.warn('[backend] Backend entry was not found, skip starting:', launchConfig.command)
    return
  }

  backendProcess = spawn(launchConfig.command, launchConfig.args, {
    cwd: launchConfig.cwd,
    env: {
      ...process.env,
      IMINO_BACKEND_HOST: BACKEND_HOST,
      IMINO_BACKEND_PORT: String(BACKEND_PORT)
    },
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe']
  })

  backendProcess.stdout?.on('data', (data) => {
    if (!app.isPackaged) {
      console.log(`[backend] ${data.toString().trim()}`)
    }
  })

  backendProcess.stderr?.on('data', (data) => {
    if (!app.isPackaged) {
      console.error(`[backend] ${data.toString().trim()}`)
    }
  })

  backendProcess.on('error', (error) => {
    logStartup('backend:error', error)
    console.error('[backend] Failed to start Python backend:', error)
    backendProcess = null
  })

  backendProcess.on('exit', (code, signal) => {
    logStartup(`backend:exit code=${code} signal=${signal}`)
    if (!app.isQuitting) {
      console.warn(`[backend] Backend exited with code=${code}, signal=${signal}`)
    }
    backendProcess = null
  })
}

function stopPythonBackend() {
  if (!backendProcess) return

  try {
    backendProcess.kill()
  } catch (error) {
    console.warn('[backend] Failed to stop Python backend:', error)
  } finally {
    backendProcess = null
  }
}

ipcMain.handle('backend:getBaseUrl', () => BACKEND_BASE_URL)
ipcMain.handle('app:getVersion', () => app.getVersion())
ipcMain.handle('clipboard:writeText', (_event, text) => {
  clipboard.writeText(String(text ?? ''))
  return true
})

app.whenReady().then(() => {
  logStartup('app:ready')
  startPythonBackend()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('before-quit', () => {
  logStartup('app:before-quit')
  app.isQuitting = true
  stopPythonBackend()
})

app.on('window-all-closed', () => {
  logStartup('app:window-all-closed')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
