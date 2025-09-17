import subprocess
import webbrowser
import os
import signal
import threading
import sys
import socket
import psutil  # 🔥 instalar con: pip install psutil
from pystray import Icon, Menu, MenuItem
from PIL import Image

# ----------------------------
# Configuración de rutas
# ----------------------------
BASE_DIR = r"C:\Users\Franchesco\Documents\Fisioterapia"
BACKEND_DIR = os.path.join(BASE_DIR, "Backend")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
VENV_PYTHON = os.path.join(BACKEND_DIR, "venv", "Scripts", "python.exe")
ICON_PATH = os.path.join(BASE_DIR, "frontend", "src", "img", "Logo1.png")

# ----------------------------
# Procesos activos
# ----------------------------
processes = []
CREATE_NO_WINDOW = 0x08000000  # Ocultar CMD en Windows


# =========================
# CONTROL DE INSTANCIAS
# =========================
def check_already_running(port=56789):
    """Usa un socket local para evitar múltiples instancias"""
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.bind(("127.0.0.1", port))
        return s
    except socket.error:
        return None


# =========================
# SERVIDORES
# =========================
def start_servers():
    """Levanta todos los backends y frontend"""
    global processes

    uvicorn_cmds = [
        ["uvicorn", "pacientes.main:app", "--reload", "--host", "0.0.0.0", "--port", "8001"],
        ["uvicorn", "atenciones.main:app", "--reload", "--host", "0.0.0.0", "--port", "8002"],
        ["uvicorn", "inventario.main:app", "--reload", "--host", "0.0.0.0", "--port", "8003"],
        ["uvicorn", "ventas.main:app", "--reload", "--host", "0.0.0.0", "--port", "8004"],
        ["uvicorn", "auth.main:app", "--reload", "--host", "0.0.0.0", "--port", "8005"],
    ]

    for cmd in uvicorn_cmds:
        p = subprocess.Popen(
            [VENV_PYTHON, "-m"] + cmd,
            cwd=BACKEND_DIR,
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            creationflags=CREATE_NO_WINDOW
        )
        processes.append(p)

    # Frontend (npm start)
    p = subprocess.Popen(
        ["npm", "start"],
        cwd=FRONTEND_DIR,
        shell=True,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        creationflags=CREATE_NO_WINDOW
    )
    processes.append(p)


def stop_servers(icon=None, item=None):
    """Mata todos los procesos y limpia"""
    global processes
    for p in processes:
        try:
            parent = psutil.Process(p.pid)
            for child in parent.children(recursive=True):
                child.kill()
            parent.kill()
        except Exception:
            pass
    processes.clear()
    if icon:
        icon.stop()


def open_browser(icon=None, item=None):
    """Abrir navegador en http://localhost:3000"""
    webbrowser.open("http://localhost:3000")


# =========================
# SYSTRAY
# =========================
def run_systray():
    # Iniciar servidores en hilo aparte
    threading.Thread(target=start_servers, daemon=True).start()

    # Usar logo personalizado
    if os.path.exists(ICON_PATH):
        image = Image.open(ICON_PATH)
    else:
        image = Image.new("RGB", (64, 64), (32, 191, 169))

    # Menú del systray
    menu = Menu(
        MenuItem("Abrir App", open_browser),
        MenuItem("Cerrar Servidores", stop_servers)
    )

    icon = Icon("fisioterapia", image, menu=menu)
    icon.run()


if __name__ == "__main__":
    # 🔒 Verificar que no haya otra instancia
    lock = check_already_running()
    if not lock:
        print("⚠️ Ya hay una instancia en ejecución.")
        sys.exit(0)

    run_systray()
