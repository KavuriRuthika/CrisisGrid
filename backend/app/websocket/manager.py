"""
WebSocket Connection Manager for Real-Time Emergency Operations Center updates.
"""

from typing import List
from fastapi import WebSocket, WebSocketDisconnect
import json
import logging

logger = logging.getLogger("websocket_manager")

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Active clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket disconnected. Active clients: {len(self.active_connections)}")

    async def broadcast(self, event_type: str, data: dict):
        payload = {
            "type": event_type,
            "data": data
        }
        message_str = json.dumps(payload, default=str)
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message_str)
            except Exception as e:
                logger.error(f"Error broadcasting to WebSocket client: {e}")
                disconnected.append(connection)
        
        for conn in disconnected:
            self.disconnect(conn)

manager = ConnectionManager()
