# readme.md

# Backend 1: Flow Executor

This backend is responsible for executing flows composed of different types of nodes/elements and streaming the execution updates to Backend 2.

## System Architecture

The system is built around a modular architecture with the following key components:

- **Flow Executor**: Core engine that manages the execution of flows
- **Element Base**: Base class for all nodes/elements in the flow
- **Services**: External integrations (AWS Bedrock, Aptos blockchain)
- **Elements**: Various node types (flow control, inputs, AI, etc.)

## Key Features

- **Flow Control**: Start, End, Case, and Flow Select blocks
- **Input Handling**: Chat inputs, context history, data blocks
- **AI Integration**: LLM text and structured generation
- **Blockchain Integration**: Read data and build transactions for Aptos
- **Utility Elements**: Selectors, mergers, random generators, and more
- **Custom Code**: Secure execution of user-defined code
- **Real-time Streaming**: WebSocket communication with Backend 2

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file with the following variables:
   ```
   # AWS Bedrock settings
   AWS_REGION=us-west-2
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   
   # Aptos blockchain settings
   APTOS_NODE_URL=https://testnet.aptoslabs.com
   APTOS_PRIVATE_KEY=your_private_key
   
   # Application settings
   LOG_LEVEL=INFO
   ALLOW_CUSTOM_CODE=true
   CUSTOM_CODE_MAX_MEMORY_MB=100
   CUSTOM_CODE_MAX_CPU_SECONDS=10
   ```

3. Run the server:
   ```
   uvicorn app:app --reload
   ```

## API Endpoints

### Execute Flow

```
POST /execute
```

Request body:
```json
{
  "flow_id": "flow-123",
  "flow_definition": {
    "flow_id": "flow-123",
    "elements": {
      "start-1": {
        "type": "start",
        "element_id": "start-1",
        "name": "Start Block",
        "description": "Start of the flow",
        "input_schema": {},
        "output_schema": {}
      },
      "llm-1": {
        "type": "llm_text",
        "element_id": "llm-1",
        "name": "Text Generator",
        "description": "Generates text using LLM",
        "input_schema": {
          "prompt": {
            "type": "string",
            "required": true
          }
        },
        "output_schema": {
          "llm_output": {
            "type": "string",
            "required": true
          }
        },
        "temperature": 0.7,
        "max_tokens": 1000,
        "wrapper_prompt": "Generate a response to: {prompt}"
      },
      "end-1": {
        "type": "end",
        "element_id": "end-1",
        "name": "End Block",
        "description": "End of the flow",
        "input_schema": {
          "text_input": {
            "type": "string",
            "required": true
          }
        },
        "output_schema": {
          "text_output": {
            "type": "string",
            "required": true
          }
        }
      }
    },
    "connections": [
      {
        "from_id": "start-1",
        "to_id": "llm-1"
      },
      {
        "from_id": "llm-1",
        "to_id": "end-1",
        "from_output": "llm_output",
        "to_input": "text_input"
      }
    ],
    "start_element_id": "start-1"
  },
  "initial_inputs": {
    "prompt": "Hello, how are you today?"
  },
  "backend2_ws_url": "ws://backend2:8001/ws/flow-123",
  "config": {
    "max_execution_time": 300
  }
}
```

Response:
```json
{
  "status": "started",
  "flow_id": "flow-123",
  "message": "Flow execution started and streaming to Backend 2"
}
```

### Health Check

```
GET /health
```

Response:
```json
{
  "status": "healthy"
}
```

## WebSocket Events

Backend 1 streams the following events to Backend 2:

1. `flow_started`: When flow execution begins
2. `element_started`: When a node begins execution
3. `element_completed`: When a node finishes execution
4. `llm_chunk`: Streaming chunks from LLM models
5. `element_error`: When a node encounters an error
6. `flow_completed`: When the entire flow completes

See the main documentation for detailed event formats.

## Docker Deployment

Build the Docker image:
```
docker build -t flow-executor-backend1 .
```

Run the container:
```
docker run -p 8000:8000 --env-file .env flow-executor-backend1
```

## Development

The codebase follows a modular structure to make it easy to add new element types:

1. Create a new element class in the appropriate directory
2. Inherit from `ElementBase`
3. Implement the `execute` method
4. Register the element type in `app.py`
