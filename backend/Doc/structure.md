


- [Flow Control](#flow-control)
  - [Start block](#start-block)
  - [End block](#end-block)
  - [Case Block](#case-block)
  - [flow\_select\_block](#flow_select_block)
- [Inputs and Data](#inputs-and-data)
  - [Chat Input block](#chat-input-block)
  - [Context History block](#context-history-block)
  - [Datablocks block](#datablocks-block)
  - [SQL Database block](#sql-database-block)
  - [Rest API block](#rest-api-block)
  - [metadata block](#metadata-block)
  - [Constants block](#constants-block)
- [Onchain](#onchain)
  - [read blockchain data block](#read-blockchain-data-block)
  - [build transaction json block](#build-transaction-json-block)
- [Util](#util)
  - [Selector Block](#selector-block)
  - [Merger Block](#merger-block)
  - [Random generator block](#random-generator-block)
  - [Time block](#time-block)
- [AI blocks](#ai-blocks)
  - [LLM Free flowing](#llm-free-flowing)
  - [LLM structured block](#llm-structured-block)
- [Custom block](#custom-block)


input schemas and output schemas are the input and output of the block that are provided or produced during the flow execution.

# Flow Control

1. Start 
2. End
3. flow_switch
4. flow_select_block


## Start block

Start block is the entry point of the flow.

user will be able to set
Nome


## End block

```yaml

End:

    type: "end"
    element-description: "This is the end block of the flow. It will return the output to the chat and send the transaction to the blockchain"

    input_schema:
        test_input: 
            type: "string"
           description: "This is string text that the user will see in the chat"
            default: None
            required: true
            example: "Output from the agenet is ...."
        proposed_transaction: 
            type: "json"
            description: "This is the transaction that will be sent to the blockchain"
            default: None
            required: true
            example: {....}

    output_schema:
        text_output: 
            type: "string"
            description: "This is the output that will be sent to the chat"
            default: None
            required: true
            example: "Output from the agenet is ...."
        proposed_transaction:
            type: "json"
            description: "This is the transaction that will be sent to the blockchain"
            default: None
            required: flase
            example: {....}

```

End block is the exit point of the flow. and the output will be returned

user can change None

## Case Block

```yaml

flow_switch:

    name: "name of the flow_switch block"
    type: "flow_switch"

    element-description: "This is the case block. It will take the input and check if it matches any of the cases"

    description: "This is the case block. It will take the input and check if it matches any of the cases"

    input_schema:
        variables:
            type: "json"
            description: "This is the variable that will be checked against a case"
            default: None
            required: true
            example: {....}
        ....
    output_schema:
        result:
            type: "json"
            description: "This is the result of the case block. It will be the output of the case block"
            default: None
            required: true
            example: 
             - case1: true
             - case2: false
             ....
    cases:
        - case1:
            type: "case"
            description: "This is the first case. It will check if the variable1 is equal to 1"
            default: None
            compare: "== , !=, >, <, >=, <=, in"
            variable1: "variable1_name"
            variable2: "variable2_name"
        - case2:
            type: "case"
            description: "This is the second case. It will check if the variable1 is equal to 2"
            default: None
            compare: "== , !=, >, <, >=, <=, in"
            variable1: "variable1_name"
            variable2: "variable2_name"
```


user will be able to set
- description
- name
- cases

based on the case the flow will be directed to the next block


## flow_select_block

```yaml

flow_select_block:
    
        name: "name of the flow_select block"
        type: "flow_select"
    
        element-description: "This is the flow_select block. It will take the input and check if it matches any of the cases"
    
        description: "This is the flow_select block. It will take the input and check if it matches any of the cases"


        # order matters as first flow with execute != None will have its value passed downwards
        flows_to_switch:
            - flow1
            - flow2
            - flow3
            - flow4


        input_schema: None

        output_schema: None
                
        # flow switch block just forwards the output of the previous block to the next block

```

user will be able to set
- description
- name
- flows to switch


# Inputs and Data


1. Chat Input
2. Context History
3. Datablocks [constants(json), csv tables]
4. SQL Database Connecter
5. Rest API
6. Env Variable block [to be implemented later]
7. metadata
8. Constants


## Chat Input block

This will be a string thats provided by the user


```yaml

chat_input:


    type: "chat_input"
    element-description: "This is the chat input block. It is the input provided by the user"

    input_schema:
        chat_input: 
            type: "string"
            description: "This is the chat input block. It is the input provided by the user"
            default: None
            required: true
            example: "This is the chat input block. It will take the input from the user"
    output_schema:
        chat_input: 
            type: "string"
            description: "This is the chat input block. It is the input provided by the user"
            default: None
            required: true
            example: "This is the chat input block. It will take the input from the user"
```

user will be able to set None

## Context History block

This will be a list of strings that are the previous messages in the conversation. This will be used to provide context to the LLM.

```yaml

context_history:

    type: "context_history"

    element-description: "This is the context history block. It is the list of previous messages in the conversation"

    input_schema:
        context_history: 
            type: "list"
            description: "This is the context history block. It is the list of previous messages in the conversation"
            default: []]
            required: false
            example: ["This is the first message", "This is the second message"]
    output_schema:
        context_history:
            type: "list"
            description: "This is the context history block. It is the list of previous messages in the conversation"
            default: []
            required: false
            example: ["This is the first message", "This is the second message"]

```

user will be able to set None

## Datablocks block

the datablock basically stores the data in a json or csv object format in the backend. The data is actually stored in postgres for jsons directly or is converted to dict using pandas for csvs. 


```yaml
Datablocks:
    
    name: "block1"
    element-description: "This is the datablock block. It is contiains constant data that the user has provided during flow creation"
    
    description: "User provided description of the block"

    type: "datablock"

    data-type: json|csv

    data: ...

    input_schema: None
    
    output_schema:
        data: 
            type: "json|csv"
            description: "This is the datablock block. It is contiains constant data that the user has provided during flow creation"
            default: None
            required: true
            example: {....} 
```


The user will be able to set
- name
- description
- data type
- data
- outputschema[data][type]

## SQL Database block


.... to be implemented later, Not required for now





## Rest API block

```yaml

RestAPI:

    name: "block1"
    element-description: "This is the Rest API block. It is used to connect to a Rest API and get the data"

    description: "User provided description of the block"

    type: "rest_api"

    url: "https://api.example.com"

    method: GET|POST|PUT|DELETE

    headers: {....}

    api_key: "...."



    input_schema:
        params: 
            type: "json"
            description: "This is the input schema for the Rest API block. It is used to pass the parameters to the API"
            default: None
            required: true
            example: {....} 

    output_schema:
        data: 
            type: "json"
            description: "This is the output schema for the Rest API block. It is used to pass the data from the API"
            default: None
            required: true
            example: {....} 
```


user will be able to change
- name
- description
- url
- method
- headers
- api_key
  


## metadata block

```yaml

metadata:

    element-description: "This is the metadata block. It is used to get the metadata from the blockchain"

    data:
        type: "json"
        description: "This is the metadata block. It is used to get the metadata from the blockchain and user context"
        default: None
        required: true
        example: {....}


    output_schema:
       command:
           type: "string"
           option: ["",""] #user input
           description: "This is the command that will be used to get the metadata from the blockchain"
        user_id:
            type: "string"
            description: "This is the user id that will be used to get the metadata from the blockchain"
            default: None
            required: false
            example: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        user_name:
            type: "string"
            description: "This is the user name that will be used to get the metadata from the blockchain"
            default: None
            required: false
            example: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        user_email:
            type: "string"
            description: "This is the user email that will be used to get the metadata from the blockchain"
            default: None
            required: false
            example: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        wallet_address:
            type: "string"
            description: "This is the wallet address that will be used to get the metadata from the blockchain"
            default: None
            required: false
            example: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"


```

user will be able to change none


## Constants block

```yaml

constants:

    name: "block1"
    element-description: "This is the constants block. It is used to get the constants from the blockchain"

    description: "User provided description of the block"

    type: "constants"

    data-type: string|int|bool|float|json|list

    data: "...."

    input_schema: None

    output_schema:
        data: 
            type: "string|int|bool|float|json|list"
            description: "This is the constants block. It is used to get the constants from the blockchain"
            default: None
            required: true
            example: {....}

```

user will be able to set
- name
- description
- data type
- data



# Onchain

1. read blockchain data
2. build transaction json


## read blockchain data block

```yaml

read_blockchain_data:

    name: "block1"
    element-description: "This is the read blockchain data block. It is used to read data from the blockchain"

    description: "User provided description of the block"

    type: "read_blockchain_data"

    node-url: "https://node.example.com"
    contract-address: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    function-name: "get_data"
    
    function-args: 
        - arg1
        - arg2
        - arg3

    input_schema:
        arg1:
            type: "string|int|bool|float|json|list"
            description: "This is the input variable for calling the blockchain function"
            default: None
            required: true
        



    output_schema:
        data: 
            type: "json"
            description: "This is the output schema for the read blockchain data block. It is used to pass the data from the API"
            default: None
            required: true
            example: {....} 
```


user will be able to set
- description
- name
- input schema
- node url
- contract address
- function name
- function args

## build transaction json block

```yaml

build_transaction_json:

    name: "block1"
    element-description: "This is the build transaction json block. It is used to build the transaction json for the blockchain"

    description: "User provided description of the block"

    type: "build_transaction_json"

    node-url: "https://node.example.com"
    contract-address: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    function-name: "set_data"
    
    function-args: 
        - arg1
        - arg2
        - arg3

    input_schema:
        arg1:
            type: "string|int|bool|float|json|list"
            description: "This is the input variable for calling the blockchain function"
            default: None
            required: true
    
    output_schema:
        transaction_json: 
            type: "json"
            description: "This is the output schema for the build transaction json block. It is used to pass the transaction json to the blockchain"
            default: None
            required: true
            example: {....}

```

user will be able to set
- description
- name
- input schema
- node url
- contract address
- function name
- function args
- input_schema




# Util

1. Selector Block
2. Conditional Selector block [implement later]
3. Merger Block
4. Random generator block (string or number)
5. time block
6. similarly implement concatenate block, split block, type cast block, etc


## Selector Block

```yaml

Selector:

    name: "name of the selector block"
    type: "selector"

    element-description: "This is the selector block. It will take the input select value based on key"

    description: "This is the selector block. It will take the input and check if it matches any of the cases"

    key: "value" # or can be a list of values
    
    input_schema:
        data:
            type: "json"
            description: "This is the variable that will be checked against a case"
            default: None
            required: true
    output_schema: 
        value:
            type: "json|string|float|int|bool"
            description: "This is the value that will be returned based on the key"
            default: None
            required: true

 
```

user will be able to set
- description
- name
- key

## Merger Block

```yaml

Merger:

    name: "name of the merger block"
    type: "merger"

    element-description: "This is the merger block. It will take the input and merge it with the output"

    description: "This is the merger block. It will take the input and merge it with the output"

    input_schema:
        data1:
            type: "json|int|string|bool|float"
            description: "This is the first input variable for merging"
            default: None
            required: true
        data2:
            type: "json|int|string|bool|float"
            description: "This is the second input variable for merging"
            default: None
            required: true
    output_schema:
        merged_data:
            type: "json"
            description: "This is the merged data"
            default: None
            required: true

```


user will be able to set

- description
- name
- input schema
  

## Random generator block

```yaml

random_generator:

    name: "name of the random generator block"
    type: "random_generator"

    element-description: "This is the random generator block. It will take the input and generate a random number or string"

    description: "This is the random generator block. It will take the input and generate a random number or string"

    type: "string|int|float"
    
    floating-point: true|false
    min: 0
    max: 100
    decimal: 2
    length: 10

    input_schema: None
    output_schema:
        random_data:
            type: "string|int|float"
            description: "This is the random data generated"
            default: None
            required: true


```

user will be able to set
- description
- name
- type
- floating-point
- min max decimal length


## Time block

```yaml 

time:

    name: "name of the time block"
    type: "time"

    element-description: "This is the time block. It will take the input and generate a random number or string"

    description: "This is the time block. It will take the input and generate a random number or string"

    type: "string|int|float"
    
    format: "YYYY-MM-DD HH:MM:SS"
    timezone: "UTC+0"

    input_schema: None
    output_schema:
        time_data:
            type: "string|int|float"
            description: "This is the time data generated"
            default: None
            required: true

```

user will be able to set
- description
- name
- type
- format
- timezone

# AI blocks

1. LLM Free flowing
2. LLM structured block

## LLM Free flowing

```yaml

LLM_Text

    name: "name of the LLM block"
    type: "llm_text"

    element-description: "This is the LLM block. It will take the input and generate a random number or string"

    description: "This is the LLM block. It will take the input and generate a random number or string"
    
    model: "DeepSeek R1 AWS"
    temperature: 0.7
    max_tokens: 100
    
    wrapper-prompt: "This is the wrapper prompt for the LLM. It will take the input and generate a random number or string"

    input_schema:
        prompt:
            type: "string"
            description: "This is the prompt for the LLM"
            default: None
            required: true
            example: "This is the prompt for the LLM"
        context:
            type: "list"
            description: "This is the context for the LLM"
            default: None
            required: true
            example: "This is the context for the LLM"
        additional_data:
            type: "json"
            description: "This is the additional data for the LLM"
            default: None
            required: true
            example: {....}
        
    output_schema:
        llm_output:
            type: "string"
            description: "This is the output from the LLM"
            default: None
            required: true


```


user will be able to set
- description
- name
- temperature
- max_tokens
- wrapper prompt


##  LLM structured block

```yaml

LLM_Structured

    name: "name of the LLM block"
    type: "llm_structured"

    element-description: "This is the LLM block. It will take the input and generate a random number or string"

    description: "This is the LLM block. It will take the input and generate a random number or string"
    
    model: "DeepSeek R1 AWS"
    temperature: 0.7
    max_tokens: 100
    
    wrapper-prompt: "This is the wrapper prompt for the LLM. It will take the input and generate a random number or string"

    llm_hidden_prompt: "This is the hidden prompt for the LLM. It will take the input and generate a random number or string"

    input_schema:
        prompt:
            type: "string"
            description: "This is the prompt for the LLM"
            default: None
            required: true
            example: "This is the prompt for the LLM"
        context:
            type: "list"
            description: "This is the context for the LLM"
            default: None
            required: true
            example: "This is the context for the LLM"
        additional_data:
            type: "json"
            description: "This is the additional data for the LLM"
            default: None
            required: true
            example: {....}

    output_schema:
        variable1:
            type: "string|int|bool|float"
            description: "This is the output from the LLM"
            default: None
            required: true
        variable2:

```

user will be able to set
- description
- name
- temperature
- max_tokens
- wrapper prompt
- output schema

here the wrapper prompt, prompt and context, output schema and llm hidden prompt will be the input for the llm and the llm will output the output schema.



# Custom block


```yaml

custom:

    name: "name of the custom block"
    type: "custom"

    element-description: "This is the custom block. It will take the input and generate a random number or string"

    description: "This is the custom block. It will take the input and generate a random number or string"
    
    hyperparameters: 
        variable1: 
            type: "string|int|bool|float"
            description: "This is the hyperparameter for the custom block"
            default: None
            value: "value"

    constants:
        constant1: 
            type: "string|int|bool|float"
            description: "This is the constant for the custom block"
            default: None
            value: "value"

    code : ""


    input_schema:
        variable1:
            type: "string|int|bool|float"
            description: "This is the input variable for the custom block"
            default: None
            required: true
        variable2:
            type: "string|int|bool|float"
            description: "This is the input variable for the custom block"
            default: None
            required: true
    output_schema:
        variable1:
            type: "string|int|bool|float"
            description: "This is the output variable for the custom block"
            default: None
            required: true
        variable2:
            type: "string|int|bool|float"
            description: "This is the output variable for the custom block"
            default: None
            required: true


```

user will be able to set
- description
- name
- hyperparameters
- constants
- code
- input schema
- output schema
- 


How to code

``` python

import multiprocessing
import psutil
import time
from RestrictedPython import compile_restricted, safe_globals, limited_builtins, utility_builtins

# Dummy schema check functions (replace with your actual implementations)
def check_input_schema(inputs: dict, schema: dict) -> dict:
    return {'status': 'success'}  # Simplified for example

def check_output_schema(output: dict, schema: dict) -> dict:
    return {'status': 'success'}  # Simplified for example

def execution(input_schema: dict,
              output_schema: dict,
              code_execution: str,
              inputs: dict,
              output: dict,
              hyperparameters: dict,
              constants: dict,
              max_memory_mb: int = 100,
              max_cpu_seconds: int = 10) -> dict:
    """
    Execute code_execution string with restrictions on I/O, memory, and CPU time.
    
    Args:
        input_schema: Dict defining expected input structure
        output_schema: Dict defining expected output structure
        code_execution: String containing Python code to execute
        inputs: Input data dictionary
        output: Initial output dictionary (unused here, kept for compatibility)
        hyperparameters: Hyperparameters dictionary
        constants: Constants dictionary
        max_memory_mb: Maximum memory in MB
        max_cpu_seconds: Maximum CPU time in seconds
    
    Returns:
        Dict with status and output or error message
    """
    
    # Initial output dictionary
    output = {}
    
    # Validate input schema
    input_check = check_input_schema(inputs, input_schema)
    if input_check['status'] == 'error':
        return input_check

    # Define the restricted execution function
    def run_code(queue):
        # RestrictedPython setup
        restricted_globals = {
            '__builtins__': limited_builtins,  # Minimal builtins (no I/O)
            '_print_': utility_builtins['_print_'],  # Safe print (optional)
            '_getitem_': utility_builtins['_getitem_'],  # Safe item access
            '_getattr_': utility_builtins['_getattr_'],  # Safe attribute access
        }
        local_vars = {
            'inputs': inputs,
            'output': {},
            'hyperparameters': hyperparameters,
            'constants': constants
        }
        
        try:
            # Compile the code with RestrictedPython
            byte_code = compile_restricted(code_execution, '<inline>', 'exec')
            exec(byte_code, restricted_globals, local_vars)
            queue.put({'status': 'success', 'output': local_vars['output']})
        except Exception as e:
            queue.put({'status': 'error', 'message': f"Execution failed: {str(e)}"})

    # Use multiprocessing for resource limits
    queue = multiprocessing.Queue()
    process = multiprocessing.Process(target=run_code, args=(queue,))
    process.start()

    # Monitor memory and enforce time limit
    p = psutil.Process(process.pid)
    for _ in range(max_cpu_seconds):
        if not process.is_alive():
            break
        mem = p.memory_info().rss / 1024 / 1024  # Memory in MB
        if mem > max_memory_mb:
            process.terminate()
            return {'status': 'error', 'message': 'Memory limit exceeded', 'output': {}}
        time.sleep(1)

    # Enforce CPU time limit
    process.join(max_cpu_seconds)
    if process.is_alive():
        process.terminate()
        return {'status': 'error', 'message': 'Time limit exceeded', 'output': {}}

    # Retrieve result from queue
    result = queue.get()
    if result['status'] == 'error':
        return result

    # Validate output schema
    output = result['output']
    output_check = check_output_schema(output, output_schema)
    if output_check['status'] == 'error':
        return {'status': 'error', 'message': output_check['message'], 'output': output}

    return {'status': 'success', 'output': output}

# Example usage
if __name__ == '__main__':
    # Simple example: Adding two numbers
    code_execution = """
output['result'] = inputs['a'] + inputs['b']
"""
    inputs = {'a': 5, 'b': 3}
    input_schema = {'a': int, 'b': int}
    output_schema = {'result': int}
    hyperparameters = {}
    constants = {}

    result = execution(input_schema, output_schema, code_execution, inputs, {}, hyperparameters, constants)
    print("Simple addition result:", result)  # {'status': 'success', 'output': {'result': 8}}

    # Example with restricted I/O attempt
    code_execution_io = """
output['result'] = inputs['a'] + inputs['b']
open('test.txt', 'w').write('test')  # This will fail
"""
    result = execution(input_schema, output_schema, code_execution_io, inputs, {}, hyperparameters, constants)
    print("I/O attempt result:", result)  # {'status': 'error', 'message': "Execution failed: name 'open' is not defined"}

    # Example with infinite loop (CPU limit test)
    code_execution_loop = """
output['result'] = inputs['a'] + inputs['b']
while True:
    pass
"""
    result = execution(input_schema, output_schema, code_execution_loop, inputs, {}, hyperparameters, constants, max_cpu_seconds=2)
    print("Infinite loop result:", result)  # {'status': 'error', 'message': 'Time limit exceeded', 'output': {}}

    # Example with high memory usage
    code_execution_memory = """
output['big_list'] = [0] * 10**8  # ~800 MB
"""
    result = execution(input_schema, {'big_list': list}, code_execution_memory, inputs, {}, hyperparameters, constants, max_memory_mb=50)
    print("High memory result:", result)  # {'status': 'error', 'message': 'Memory limit exceeded', 'output': {}}

```