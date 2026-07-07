# Python Backend

这是 Electron 桌面程序内置的 FastAPI 后端，负责提供本地接口与系统能力。

## 环境要求

- Python 3.14 x64（推荐）
- Windows 10/11 x64

## 安装依赖

```bash
cd backend
py -3.14 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt -r requirements-build.txt
```

## 本地启动

```bash
python main.py --host 127.0.0.1 --port 38765
```

## 健康检查

```bash
curl http://127.0.0.1:38765/health
```

## 示例接口

```bash
curl http://127.0.0.1:38765/api/system/info
```

## 打包为可执行文件

在项目根目录执行：

```bash
npm run build:backend
```

生成文件：

```text
backend/dist/backend.exe
```

Electron 打包时会将其放入资源目录供主程序调用。
