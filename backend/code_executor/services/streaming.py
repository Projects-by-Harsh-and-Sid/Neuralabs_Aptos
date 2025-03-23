# services/streaming.py
import json
import asyncio
from typing import Dict, Any, Optional, AsyncGenerator
import websockets
from utils.logger import logger

class WebSocketStreamManager:
    """Manages WebSocket streaming to Backend 2."""
    
    def __init__(self, ws_url: str):
        self.ws_url = ws_url
        self.websocket = None
        self.connected = False
        self.reconnect_attempts = 0
        self.max_reconnect_attempts = 5
    
    async def connect(self):
        """Connect to the WebSocket endpoint."""
        try:
            self.websocket = await websockets.connect(self.ws_url)
            self.connected = True
            self.reconnect_attempts = 0
            logger.info(f"Connected to WebSocket endpoint: {self.ws_url}")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to WebSocket: {str(e)}")
            self.connected = False
            return False
    
    async def disconnect(self):
        """Disconnect from the WebSocket endpoint."""
        if self.websocket and self.connected:
            await self.websocket.close()
            self.connected = False
            logger.info("Disconnected from WebSocket endpoint")
    
    async def send_message(self, message: str):
        """Send a message over the WebSocket."""
        if not self.connected:
            # Try to connect if not already connected
            if not await self.connect():
                if self.reconnect_attempts < self.max_reconnect_attempts:
                    self.reconnect_attempts += 1
                    logger.warning(f"Reconnection attempt {self.reconnect_attempts}/{self.max_reconnect_attempts}")
                    await asyncio.sleep(1)  # Wait before retrying
                    return await self.send_message(message)  # Retry
                else:
                    logger.error("Max reconnection attempts reached")
                    return False
        
        try:
            await self.websocket.send(message)
            return True
        except websockets.exceptions.ConnectionClosed:
            logger.warning("WebSocket connection closed, attempting to reconnect")
            self.connected = False
            if self.reconnect_attempts < self.max_reconnect_attempts:
                self.reconnect_attempts += 1
                await asyncio.sleep(1)  # Wait before retrying
                return await self.send_message(message)  # Retry
            else:
                logger.error("Max reconnection attempts reached")
                return False
        except Exception as e:
            logger.error(f"Failed to send message: {str(e)}")
            self.connected = False
            return False
    
    async def stream_chunks(self, chunk_generator: AsyncGenerator[str, None], 
                           metadata: Dict[str, Any] = None):
        """Stream chunks from an async generator with metadata."""
        try:
            async for chunk in chunk_generator:
                message = {
                    "type": "chunk",
                    "content": chunk,
                    "metadata": metadata or {}
                }
                success = await self.send_message(json.dumps(message))
                if not success:
                    logger.warning("Failed to stream chunk, continuing...")
                    
        except Exception as e:
            logger.error(f"Error in stream_chunks: {str(e)}")
            # Send error message
            error_message = {
                "type": "error",
                "content": str(e),
                "metadata": metadata or {}
            }
            await self.send_message(json.dumps(error_message))
