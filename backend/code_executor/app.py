import os
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json

# Import routes
from routes import execute_flow, execute_flow_websocket, health_check, log_requests

app = FastAPI(title="Flow Executor Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Register HTTP routes
app.post("/execute")(execute_flow)
app.get("/health")(health_check)
app.middleware("http")(log_requests)

# Register WebSocket route with two-phase communication
@app.websocket("/ws/execute/{flow_id}")
async def websocket_endpoint(websocket: WebSocket, flow_id: str):
    await websocket.accept()
    
    try:
        # First send a ready message
        await websocket.send_text(json.dumps({"status": "ready", "message": "Send flow_definition as JSON"}))
        
        # Receive the flow definition as a separate message
        flow_definition_str = await websocket.receive_text()
        
        # Acknowledge receipt and ask for initial inputs
        await websocket.send_text(json.dumps({"status": "received_flow", "message": "Send initial_inputs as JSON"}))
        
        # Receive initial inputs
        initial_inputs_str = await websocket.receive_text()
        
        # Acknowledge and ask for config (optional)
        await websocket.send_text(json.dumps({"status": "received_inputs", "message": "Send config as JSON or 'null'"}))
        
        # Receive config (might be "null")
        config_str = await websocket.receive_text()
        if config_str.lower() == "null":
            config_str = None
        
        # Acknowledge all data received, starting execution
        await websocket.send_text(json.dumps({"status": "starting", "message": "Starting flow execution"}))
        
        # Execute the flow with the received data
        await execute_flow_websocket(
            websocket=websocket,
            flow_id=flow_id,
            flow_definition_str=flow_definition_str,
            initial_inputs_str=initial_inputs_str,
            config_str=config_str
        )
    except Exception as e:
        error_msg = f"Error in WebSocket setup: {str(e)}"
        await websocket.send_text(json.dumps({
            "type": "error",
            "data": {"error": error_msg}
        }))
        await websocket.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))