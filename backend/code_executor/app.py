# app.py
import os
import json
from typing import Dict, Any, List, Optional
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import settings
from core.executor import FlowExecutor
from services.streaming import WebSocketStreamManager
from utils.logger import logger

# Import element classes
# Flow Control
from elements.flow_control.start import Start
from elements.flow_control.end import End
from elements.flow_control.case import Case
from elements.flow_control.flow_select import FlowSelect

# Inputs
from elements.inputs.chat_input import ChatInput
from elements.inputs.context_history import ContextHistory
from elements.inputs.datablocks import Datablocks
from elements.inputs.rest_api import RestAPI
from elements.inputs.metadata import Metadata
from elements.inputs.constants import Constants

# Onchain
from elements.onchain.read_blockchain_data import ReadBlockchainData
from elements.onchain.build_transaction_json import BuildTransactionJSON

# Util
from elements.util.selector import Selector
from elements.util.merger import Merger
from elements.util.random_generator import RandomGenerator
from elements.util.time_block import TimeBlock

# AI
from elements.ai.llm_text import LLMText
from elements.ai.llm_structured import LLMStructured

# Custom
from elements.custom.custom import Custom

app = FastAPI(title="Flow Executor Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class ElementDefinition(BaseModel):
    type: str
    element_id: str
    name: str
    description: str
    input_schema: Dict[str, Any]
    output_schema: Dict[str, Any]
    
    # Optional fields for specific element types
    class Config:
        extra = "allow"

class Connection(BaseModel):
    from_id: str
    to_id: str
    from_output: Optional[str] = None
    to_input: Optional[str] = None

class FlowDefinition(BaseModel):
    flow_id: str
    elements: Dict[str, ElementDefinition]
    connections: List[Connection]
    start_element_id: str
    metadata: Optional[Dict[str, Any]] = None

class ExecuteFlowRequest(BaseModel):
    flow_id: str
    flow_definition: FlowDefinition
    initial_inputs: Optional[Dict[str, Any]] = None
    backend2_ws_url: str
    config: Optional[Dict[str, Any]] = None

# Registry of element types to their classes
element_registry = {
    "start": Start,
    "end": End,
    "case": Case,
    "flow_select": FlowSelect,
    "chat_input": ChatInput,
    "context_history": ContextHistory,
    "datablock": Datablocks,
    "rest_api": RestAPI,
    "metadata": Metadata,
    "constants": Constants,
    "read_blockchain_data": ReadBlockchainData,
    "build_transaction_json": BuildTransactionJSON,
    "selector": Selector,
    "merger": Merger,
    "random_generator": RandomGenerator,
    "time": TimeBlock,
    "llm_text": LLMText,
    "llm_structured": LLMStructured,
    "custom": Custom
}

@app.post("/execute")
async def execute_flow(request: ExecuteFlowRequest):
    """Execute a flow and stream results to Backend 2."""
    try:
        # Create a stream manager connected to Backend 2
        stream_manager = WebSocketStreamManager(request.backend2_ws_url)
        connected = await stream_manager.connect()
        
        if not connected:
            raise HTTPException(status_code=500, detail="Failed to connect to Backend 2 WebSocket")
        
        # Parse the flow definition
        flow_def = request.flow_definition
        
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
            config.update({k: v for k, v in settings.dict().items()})
        if request.config:
            config.update(request.config)
        
        # Create the flow executor
        executor = FlowExecutor(
            elements=elements,
            start_element_id=flow_def.start_element_id,
            stream_manager=stream_manager,
            config=config
        )
        
        # Execute the flow (in a background task to not block the response)
        task = asyncio.create_task(executor.execute_flow(request.initial_inputs))
        
        # Return immediately with a status
        return {
            "status": "started", 
            "flow_id": request.flow_id,
            "message": "Flow execution started and streaming to Backend 2"
        }
    
    except Exception as e:
        logger.error(f"Error executing flow: {str(e)}")
        # Try to notify Backend 2 about the error
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
                logger.error(f"Failed to send error to Backend 2: {str(ws_error)}")
                
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware to log all requests."""
    start_time = asyncio.get_event_loop().time()
    response = await call_next(request)
    process_time = asyncio.get_event_loop().time() - start_time
    
    logger.info(f"Request {request.method} {request.url.path} completed in {process_time:.3f}s with status {response.status_code}")
    
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
