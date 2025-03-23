from fastapi import FastAPI, HTTPException, Request, WebSocket, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio
import json
from typing import Optional, Dict, Any, List

from config import settings
from core.executor import FlowExecutor
from services.streaming import WebSocketStreamManager, DirectResponseStreamManager, SSEStreamManager
from utils.logger import logger
from elements import element_registry  # Import from app.py

class ElementDefinition(BaseModel):
    type: str
    element_id: str
    name: str
    description: str
    input_schema: dict
    output_schema: dict
    
    class Config:
        extra = "allow"

class Connection(BaseModel):
    from_id: str
    to_id: str
    from_output: str | None = None
    to_input: str | None = None

class FlowDefinition(BaseModel):
    flow_id: str
    elements: dict[str, ElementDefinition]
    connections: list[Connection]
    start_element_id: str
    metadata: dict | None = None

class ExecuteFlowRequest(BaseModel):
    flow_id: str
    flow_definition: FlowDefinition
    initial_inputs: dict | None = None
    backend2_ws_url: Optional[str] = None  # Make this optional
    stream_mode: str = "sse"  # Options: "sse", "ws", "backend2"
    config: dict | None = None

async def execute_flow(request: ExecuteFlowRequest, background_tasks: BackgroundTasks):
    """Execute a flow and stream results back to the caller."""
    try:
        stream_manager = None
        
        # Handle streaming mode
        if request.stream_mode == "backend2" and request.backend2_ws_url:
            # Legacy mode: stream to Backend 2
            stream_manager = WebSocketStreamManager(request.backend2_ws_url)
            connected = await stream_manager.connect()
            
            if not connected:
                raise HTTPException(status_code=500, detail="Failed to connect to Backend 2 WebSocket")
        elif request.stream_mode == "sse":
            # Server-Sent Events mode
            stream_manager = SSEStreamManager()
        # The "ws" mode will be handled separately in the WebSocket endpoint
        
        # Parse the flow definition
        flow_def = request.flow_definition
        
        # Create element instances and setup the flow executor
        elements, executor = await setup_flow_executor(flow_def, stream_manager, request.config)
        
        # Execute the flow in the background
        background_tasks.add_task(
            execute_flow_task, 
            executor, 
            request.initial_inputs, 
            request.flow_id, 
            stream_manager
        )
        
        # If SSE streaming, return a streaming response
        if request.stream_mode == "sse":
            return StreamingResponse(
                stream_manager.get_messages(),
                media_type="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "Content-Type": "text/event-stream"
                }
            )
        
        # Otherwise, return a status message
        return {
            "status": "started", 
            "flow_id": request.flow_id,
            "message": f"Flow execution started in {request.stream_mode} mode"
        }
    
    except Exception as e:
        logger.error(f"Error executing flow: {str(e)}")
        # Try to notify about the error if stream_manager exists
        if 'stream_manager' in locals() and stream_manager:
            try:
                await stream_manager.send_message(json.dumps({
                    "type": "flow_error",
                    "data": {
                        "flow_id": request.flow_id,
                        "error": str(e)
                    }
                }))
            except Exception as ws_error:
                logger.error(f"Failed to send error to stream: {str(ws_error)}")
                
        raise HTTPException(status_code=500, detail=str(e))

async def execute_flow_websocket(websocket: WebSocket, flow_id: str, flow_definition_str: str, 
                               initial_inputs_str: Optional[str] = None, config_str: Optional[str] = None):
    """WebSocket endpoint for executing flows with direct WebSocket streaming."""
    await websocket.accept()
    
    try:
        # Parse the JSON strings
        flow_definition = json.loads(flow_definition_str)
        initial_inputs = json.loads(initial_inputs_str) if initial_inputs_str else None
        config = json.loads(config_str) if config_str else None
        
        # Create flow definition model
        flow_def = FlowDefinition(**flow_definition)
        
        # Create a direct WebSocket stream manager
        stream_manager = DirectResponseStreamManager(websocket)
        
        # Setup the flow executor
        elements, executor = await setup_flow_executor(flow_def, stream_manager, config)
        
        # Execute the flow
        await execute_flow_task(executor, initial_inputs, flow_id, stream_manager)
        
    except Exception as e:
        error_msg = f"Error executing flow via WebSocket: {str(e)}"
        logger.error(error_msg)
        try:
            await websocket.send_text(json.dumps({
                "type": "flow_error",
                "data": {
                    "flow_id": flow_id,
                    "error": str(e)
                }
            }))
        except Exception:
            pass
        finally:
            await websocket.close()

async def setup_flow_executor(flow_def: FlowDefinition, stream_manager, user_config: Optional[Dict[str, Any]] = None):
    """Setup the flow executor with elements and connections."""
    # Create element instances
    elements = {}
    for elem_id, elem_data in flow_def.elements.items():
        elem_type = elem_data.type
        if elem_type not in element_registry:
            raise HTTPException(status_code=400, detail=f"Unknown element type: {elem_type}")
        
        # Create element instance based on type
        ElementClass = element_registry[elem_type]
        
        # Extract common parameters
        common_params = {
            "element_id": elem_id,
            "name": elem_data.name,
            "description": elem_data.description,
            "input_schema": elem_data.input_schema,
            "output_schema": elem_data.output_schema,
        }
        
        # Extract additional parameters specific to the element type
        additional_params = {k: v for k, v in elem_data.dict().items() 
                           if k not in ["type", "element_id", "name", "description", "input_schema", "output_schema"]}
        
        # Create the element instance
        elements[elem_id] = ElementClass(**common_params, **additional_params)
    
    # Set up connections between elements
    for conn in flow_def.connections:
        from_id = conn.from_id
        to_id = conn.to_id
        if from_id in elements and to_id in elements:
            elements[from_id].connect(elements[to_id])
            
            # If specific input/output ports are specified, set up the mapping
            if conn.from_output and conn.to_input:
                # This would require additional logic in your ElementBase class
                # For example: elements[from_id].map_output_to_input(conn.from_output, elements[to_id], conn.to_input)
                pass
    
    # Merge configuration
    config = {}
    if settings:
        config.update({k: v for k, v in vars(settings).items() if not k.startswith('_')})
    if user_config:
        config.update(user_config)
    
    # Create the flow executor
    executor = FlowExecutor(
        elements=elements,
        start_element_id=flow_def.start_element_id,
        stream_manager=stream_manager,
        config=config
    )
    
    return elements, executor

async def execute_flow_task(executor, initial_inputs, flow_id, stream_manager):
    """Execute the flow and handle cleanup."""
    try:
        # Execute the flow
        result = await executor.execute_flow(initial_inputs)
        logger.info(f"Flow {flow_id} execution completed successfully")
        
    except Exception as e:
        logger.error(f"Error during flow {flow_id} execution: {str(e)}")
        # Try to notify about the error
        try:
            await stream_manager.send_message(json.dumps({
                "type": "flow_error",
                "data": {
                    "flow_id": flow_id,
                    "error": str(e)
                }
            }))
        except Exception:
            pass
    finally:
        # Disconnect stream manager
        try:
            await stream_manager.disconnect()
        except Exception as disconnect_error:
            logger.error(f"Error disconnecting stream manager: {str(disconnect_error)}")

async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

async def log_requests(request: Request, call_next):
    """Middleware to log all requests."""
    start_time = asyncio.get_event_loop().time()
    response = await call_next(request)
    process_time = asyncio.get_event_loop().time() - start_time
    
    logger.info(f"Request {request.method} {request.url.path} completed in {process_time:.3f}s with status {response.status_code}")
    
    return response