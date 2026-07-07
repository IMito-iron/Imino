import argparse
import os
import platform
import socket
import sys
import time

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Imino Local Toolbox Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "null",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/system/info")
def system_info():
    return {
        "status": "ok",
        "hostname": socket.gethostname(),
        "platform": platform.platform(),
        "system": platform.system(),
        "release": platform.release(),
        "machine": platform.machine(),
        "python_version": sys.version.split()[0],
        "timestamp": int(time.time()),
    }


def parse_args():
    parser = argparse.ArgumentParser(description="Imino Local Toolbox FastAPI backend")
    parser.add_argument("--host", default=os.getenv("IMINO_BACKEND_HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=int(os.getenv("IMINO_BACKEND_PORT", "38765")))
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    uvicorn.run(app, host=args.host, port=args.port)
