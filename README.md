# Imino Local Toolbox

一个本地离线工具箱类 Windows 桌面程序模板，基于 Electron、electron-vite、Vue 3 和 Python FastAPI。

## 技术栈

- Electron
- electron-vite
- Vue 3
- JavaScript
- Python FastAPI
- PyInstaller
- electron-builder

## 普通开发安装

```bash
npm install
```

Python 后端建议使用虚拟环境：

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt -r requirements-build.txt
```

## 开发启动

```bash
npm run dev
```

开发模式下，Electron 主进程会优先使用 `backend/.venv/Scripts/python.exe` 启动：

```bash
backend/main.py --host 127.0.0.1 --port 38765
```

也可以单独启动 Python 后端：

```bash
npm run backend:dev
```

## 在线打包

生成免安装目录版：

```bash
npm run package
```

输出入口：

```text
release/win-unpacked/Imino Local Toolbox.exe
```

生成 NSIS 安装包：

```bash
npm run dist
```

输出入口：

```text
release/Imino Local Toolbox Setup 0.1.0.exe
```

也可以直接双击运行：

```text
build-release.bat
```

## 内网离线部署

本项目已预留离线缓存目录：

```text
offline-cache/
  npm-cache.zip
  electron-cache.zip
  electron-builder-cache.zip
  python-wheels.zip
  python-wheels/
```

这些缓存不纳入 Git 管理，需要随项目目录一起拷贝到内网机器。

在内网机器上执行：

```text
setup-offline.bat
```

脚本会执行以下动作：

1. 解压 npm、Electron、electron-builder、Python wheelhouse 缓存到本地运行目录。
2. 使用 `npm ci --offline` 从 npm 离线缓存安装 Node 依赖。
3. 创建 `backend/.venv`。
4. 使用 `pip --no-index --find-links` 从 `offline-cache/python-wheels` 安装 Python 依赖。
5. 执行 `npm run dist` 生成安装包。

内网机器仍需预装：

- Windows
- Node.js / npm，建议与当前开发机版本相近
- Python，当前 wheelhouse 按 Python 3.13 / Windows x64 准备

如果依赖版本发生变化，需要在外网机器重新生成缓存包后再迁移到内网。

## 打包链路说明

1. `npm run build:backend` 使用 PyInstaller 读取 `backend/backend.spec`，生成 `backend/dist/backend.exe`。
2. `npm run build` 使用 electron-vite 构建主进程、preload 和 renderer。
3. electron-builder 通过 `extraResources` 把 `backend/dist/backend.exe` 复制到：

```text
resources/backend/backend.exe
```

4. 生产环境下 Electron 主进程从 `process.resourcesPath/backend/backend.exe` 启动后端。

## 工程结构

```text
src/
  main/       Electron 主进程，包含 Python 后端启动与退出逻辑
  preload/    安全暴露给 renderer 的桥接 API
  renderer/   Vue 3 前端
    src/
      stores/ Tab、设置、多语言状态
      views/  首页
      tools/  小工具页面
backend/
  main.py
  backend.spec
  requirements.txt
  requirements-build.txt
  README.md
tools/
  list-npm-cache-urls.mjs
```

## 后续新增小工具

1. 在 `src/renderer/src/tools` 下新增 Vue 组件。
2. 在 `src/renderer/src/stores/tabs.js` 中加入工具入口配置。
3. 在 `src/renderer/src/stores/settings.js` 的 `messages` 中补充多语言文案。
4. 如需调用 Python，在 FastAPI 中新增接口，前端通过 `window.iminoAPI.backend.getBaseUrl()` 获取本地 API 地址。

## 注意

- 后端 API 默认只监听 `127.0.0.1:38765`。
- 当前模板暂未配置应用图标和代码签名。
- `win.signAndEditExecutable` 当前关闭，用于避免未开启 Windows 开发者模式时 electron-builder 解压签名工具失败。
