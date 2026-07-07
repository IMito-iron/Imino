# Python Backend

这是 Electron 桌面端本地调用的 FastAPI 后端示例。

## 安装依赖

当前后端已按 CPython 3.14.4 x64 验证。Windows 上建议显式使用 Python Launcher 创建虚拟环境：

```bash
py -3.14 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt -r requirements-build.txt
```

## 本地启动

```bash
python main.py --host 127.0.0.1 --port 38765
```

健康检查：

```bash
curl http://127.0.0.1:38765/health
```

系统信息接口：

```bash
curl http://127.0.0.1:38765/api/system/info
```

## PyInstaller 打包

推荐从项目根目录执行：

```bash
npm run build:backend
```

输出文件：

```text
backend/dist/backend.exe
```

Electron 打包时会通过 `extraResources` 把该文件复制到：

```text
resources/backend/backend.exe
```

当前 `backend.spec` 使用控制台子系统构建后端 exe，因为该模式下 FastAPI/uvicorn 启动更稳定。Electron 主进程启动后端时设置了 `windowsHide: true`，正常由桌面主程序拉起时不会显示后端控制台窗口。
