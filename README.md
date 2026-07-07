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

## 当前依赖版本

Node 侧当前 lockfile 实际锁定版本：

| 依赖 | 当前锁定版本 | 说明 |
| --- | --- | --- |
| Vue | 3.5.39 | Renderer 前端框架 |
| Electron | 31.7.7 | 桌面运行时 |
| electron-vite | 2.3.0 | Electron + Vite 构建工具 |
| electron-builder | 24.13.3 | Windows exe / NSIS 打包 |
| @vitejs/plugin-vue | 5.2.4 | Vue SFC 编译插件 |
| Vite | 5.4.21 | electron-vite 间接依赖 |
| Rollup | 4.62.2 | Vite 间接依赖 |

Python 侧当前直接依赖：

| 依赖 | 当前版本 | 来源 |
| --- | --- | --- |
| FastAPI | 0.115.6 | `backend/requirements.txt` |
| Uvicorn | 0.34.0 | `backend/requirements.txt` |
| PyInstaller | 6.11.1 | `backend/requirements-build.txt` |

当前 `offline-cache/python-wheels` 中包含 25 个 wheel。需要注意其中存在 `cp313-win_amd64` 二进制 wheel，例如：

- `httptools-0.8.0-cp313-cp313-win_amd64.whl`
- `pydantic_core-2.46.4-cp313-cp313-win_amd64.whl`
- `pyyaml-6.0.3-cp313-cp313-win_amd64.whl`
- `watchfiles-1.2.0-cp313-cp313-win_amd64.whl`
- `websockets-16.0-cp313-cp313-win_amd64.whl`

因此当前 wheelhouse 是按 **Windows x64 + CPython 3.13** 准备的。

## 最低版本要求

### 只运行已打包 exe

如果只运行以下产物：

```text
release/Imino Local Toolbox Setup 0.1.0.exe
release/win-unpacked/Imino Local Toolbox.exe
```

最低要求：

| 项目 | 最低要求 |
| --- | --- |
| 操作系统 | Windows 10 x64 或更高 |
| Node.js / npm | 不需要 |
| Python | 不需要 |
| 浏览器 | 不需要 |
| 网络 | 不需要 |

### 内网重新安装依赖并打包

如果把项目源码迁移到内网机器，并在内网重新执行 `setup-offline.bat` 或 `npm run dist`：

| 项目 | 最低可尝试版本 | 已验证版本 | 说明 |
| --- | --- | --- | --- |
| Windows | Windows 10 x64 | Windows 11 x64 | Electron 31 与当前 Python wheels 均面向 Windows x64 |
| Node.js | 18.0.0+ | 20.10.0 | Vite、electron-vite、Rollup 要求 Node 18+ |
| npm | 9+ | 10.2.3 | 当前 `package-lock.json` 为 lockfileVersion 3，离线缓存由 npm 10 生成 |
| Python | CPython 3.13 x64 | 3.13.5 | 当前 wheelhouse 内含 `cp313-win_amd64` wheel |
| PowerShell | Windows 自带即可 | Windows PowerShell 5.x | bat 中用于解压 zip |

更稳妥的内网环境建议：

```text
Windows 10/11 x64
Node.js 20.10.0 或同一 LTS 大版本
npm 10.2.3 或同一 npm 10 大版本
CPython 3.13.x x64
```

如果内网机器使用 Python 3.12、3.11 或 32 位 Python，当前 `python-wheels.zip` 不适用，需要在外网按目标 Python 版本重新生成 wheelhouse。

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
