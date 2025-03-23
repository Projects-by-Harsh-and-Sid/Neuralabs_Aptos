# services/streaming.py
import json
import asyncio
from typing import Dict, Any, Optional, AsyncGenerator, List
import websockets
from abc import ABC, abstractmethod
from fastapi import WebSocket
from utils.logger import logger

class StreamManager(ABC):
    """Abstract base class for streaming data."""
    
    @abstractmethod
    async def connect(self) -> bool:
        """Connect to the streaming endpoint."""
        pass
    
    @abstractmethod
    async def disconnect(self):
        """Disconnect from the streaming endpoint."""
        pass
    
    @abstractmethod
    async def send_message(self, message: str) -> bool:
        """Send a message through the stream."""
        pass
    
    @abstractmethod
    async def stream_chunks(self, chunk_generator: AsyncGenerator[str, None], 
                           metadata: Dict[str, Any] = None):
        """Stream chunks from an async generator with metadata."""
        pass

class WebSocketStreamManager(StreamManager):
    """Manages WebSocket streaming to a remote endpoint."""
    
    def __init__(self, ws_url: str):
        self.ws_url = ws_url
        self.websocket = None
        self.connected = False
        self.reconnect_attempts = 0
        self.max_reconnect_attempts = 5
    
    async def connect(self) -> bool:
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
    
    async def send_message(self, message: str) -> bool:
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

class DirectResponseStreamManager(StreamManager):
    """Stream directly to a FastAPI WebSocket connection."""
    
    def __init__(self, websocket: WebSocket):
        self.websocket = websocket
        self.connected = True
        self.queue = asyncio.Queue()
        self.task = None
    
    async def connect(self) -> bool:
        """Already connected through FastAPI websocket."""
        return self.connected
    
    async def disconnect(self):
        """Disconnect not needed (handled by FastAPI)."""
        self.connected = False
        if self.task and not self.task.done():
            self.task.cancel()
    
    async def send_message(self, message: str) -> bool:
        """Send a message to the client."""
        if not self.connected:
            logger.warning("Connection already closed")
            return False
        
        try:
            await self.websocket.send_text(message)
            return True
        except Exception as e:
            logger.error(f"Failed to send message: {str(e)}")
            self.connected = False
            return False
    
    async def stream_chunks(self, chunk_generator: AsyncGenerator[str, None], 
                           metadata: Dict[str, Any] = None):
        """Stream chunks directly to the client."""
        try:
            async for chunk in chunk_generator:
                message = {
                    "type": "chunk",
                    "content": chunk,
                    "metadata": metadata or {}
                }
                success = await self.send_message(json.dumps(message))
                if not success:
                    break
        except Exception as e:
            logger.error(f"Error in stream_chunks: {str(e)}")
            # Send error message
            error_message = {
                "type": "error",
                "content": str(e),
                "metadata": metadata or {}
            }
            await self.send_message(json.dumps(error_message))
    
    async def get_messages(self) -> AsyncGenerator[str, None]:
        """Get messages from the queue as an async generator."""
        while True:
            message = await self.queue.get()
            if message is None:  # None as sentinel to stop
                break
            yield message
            self.queue.task_done()

class SSEStreamManager(StreamManager):
    """Manager for Server-Sent Events (SSE) streaming."""
    
    def __init__(self):
        self.connected = True
        self.messages = []
        self.queue = asyncio.Queue()
    
    async def connect(self) -> bool:
        """Nothing to connect in SSE."""
        return True
    
    async def disconnect(self):
        """Mark as disconnected."""
        self.connected = False
        # Add sentinel to queue
        await self.queue.put(None)
    
    async def send_message(self, message: str) -> bool:
        """Queue a message for SSE streaming."""
        if not self.connected:
            return False
        
        await self.queue.put(message)
        return True
    
    async def stream_chunks(self, chunk_generator: AsyncGenerator[str, None], 
                           metadata: Dict[str, Any] = None):
        """Stream chunks through SSE."""
        try:
            async for chunk in chunk_generator:
                message = {
                    "type": "chunk",
                    "content": chunk,
                    "metadata": metadata or {}
                }
                await self.send_message(json.dumps(message))
        except Exception as e:
            logger.error(f"Error in stream_chunks: {str(e)}")
            error_message = {
                "type": "error",
                "content": str(e),
                "metadata": metadata or {}
            }
            await self.send_message(json.dumps(error_message))
    
    async def get_messages(self) -> AsyncGenerator[str, None]:
        """Get messages as an async generator for SSE streaming."""
        while True:
            message = await self.queue.get()
            if message is None:  # None is a sentinel to stop
                break
            yield f"data: {message}\n\n"
            self.queue.task_done()