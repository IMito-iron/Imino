# Imino Local Toolbox

Imino Local Toolbox 是一个面向 Windows 本地化、离线部署场景的桌面工具箱模板。它基于 Electron、Vue 3 和 FastAPI，适合做内部工具、离线助手、轻量本地应用原型。

## 项目特点

- 本地运行，适合离线或内网环境
- Electron + Vue 3 提供桌面界面
- Python FastAPI 提供本地后端接口
- 支持离线缓存与 Windows 打包
- 可作为后续扩展小工具的基础模板

## 技术栈

- Electron
- electron-vite
- Vue 3
- JavaScript
- Python FastAPI
- PyInstaller
- electron-builder

## 适用环境

- Windows 10/11 x64
- Node.js 20.x / npm 10.x
- Python 3.14 x64（推荐）

## 快速开始

### 1. 安装前端依赖

```bash
npm install
```

### 2. 创建 Python 虚拟环境

```bash
cd backend
py -3.14 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt -r requirements-build.txt
```

### 3. 启动开发环境

```bash
npm run dev
```

开发模式下，Electron 会自动启动本地后端：

```bash
backend/main.py --host 127.0.0.1 --port 38765
```

也可以单独启动后端：

```bash
npm run backend:dev
```

## 构建与打包

### 生成可执行目录

```bash
npm run package
```

### 生成安装包

```bash
npm run dist
```

### 直接运行打包脚本

```bash
build-release.bat
```

## 项目结构

```text
src/
  main/       Electron 主进程
  preload/    预加载脚本
  renderer/   Vue 3 前端
backend/      FastAPI 后端
offline-cache/  离线缓存资源
release/      打包产物
```

## 离线部署说明

项目已预留离线缓存目录，可用于内网环境安装依赖与打包：

```text
offline-cache/
setup-offline.bat
```

在内网机器上执行：

```bash
setup-offline.bat
```

## 后续扩展建议

1. 在 `src/renderer/src/tools` 中新增工具组件。
2. 在 `src/renderer/src/stores/tabs.js` 中加入菜单入口。
3. 如需调用 Python，新增 FastAPI 接口并通过前端桥接调用。

## 说明

- 后端默认监听 `127.0.0.1:38765`
- 当前模板暂未配置应用图标和代码签名
- `signAndEditExecutable` 目前关闭，以避免某些 Windows 环境下签名工具初始化失败
