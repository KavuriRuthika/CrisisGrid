import sys
import os
import webbrowser
import threading
import time
import socket

# Add backend directory to python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

import uvicorn

def is_port_available(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(('127.0.0.1', port))
            return True
        except OSError:
            return False

def auto_open_browser(url: str):
    time.sleep(1.5)
    webbrowser.open(url)

# Force DB table creation and Pan-India seeding
from app.database import engine, SessionLocal, Base
from app.seed import seed_database

Base.metadata.create_all(bind=engine)
db_session = SessionLocal()
try:
    seed_database(db_session)
except Exception as err:
    print(f"Database seeding note: {err}")
finally:
    db_session.close()

if __name__ == "__main__":
    candidate_ports = [8000, 8001, 8002, 8005, 5000, 8888]
    selected_port = 8000
    for p in candidate_ports:
        if is_port_available(p):
            selected_port = p
            break

    url = f"http://127.0.0.1:{selected_port}"

    print("==========================================================================")
    print("Digital Crisis Command Center -- Pure HTML/CSS/JS + FastAPI Platform")
    print(f"Serving full-stack application at: {url}")
    print("Default Center: INDIA (World Political Map + Satellite + Drone Views)")
    print("Opening web browser automatically...")
    print("==========================================================================")

    # Launch browser automatically
    threading.Thread(target=auto_open_browser, args=(url,), daemon=True).start()

    uvicorn.run("app.main:app", host="127.0.0.1", port=selected_port, reload=False)
