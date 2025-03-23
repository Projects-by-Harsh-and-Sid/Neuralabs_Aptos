# config.py
import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from typing import Optional

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
# class Settings():

    """Application settings loaded from environment variables."""
    
    # AWS Bedrock settings
    aws_region: str                         = os.getenv("AWS_REGION", "us-east-1")
    aws_access_key_id: Optional[str]        = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_access_key: Optional[str]    = os.getenv("AWS_SECRET_ACCESS_KEY")
    
    # Default model settings
    default_model_id: str                   = os.getenv("DEFAULT_MODEL_ID", "us.deepseek.r1-v1:0")
    
    # Aptos blockchain settings
    aptos_node_url: str                     = os.getenv("APTOS_NODE_URL", "https://testnet.aptoslabs.com")
    aptos_private_key: Optional[str]        = os.getenv("APTOS_PRIVATE_KEY")
    
    # Application settings
    log_level: str                          = os.getenv("LOG_LEVEL", "INFO")
    max_execution_time: int                 = int(os.getenv("MAX_EXECUTION_TIME", "300"))  # 5 minutes default
    
    # Custom code execution settings
    allow_custom_code: bool                 = os.getenv("ALLOW_CUSTOM_CODE", "false").lower() == "true"
    custom_code_max_memory_mb: int          = int(os.getenv("CUSTOM_CODE_MAX_MEMORY_MB", "100"))
    custom_code_max_cpu_seconds: int        = int(os.getenv("CUSTOM_CODE_MAX_CPU_SECONDS", "10"))
    
    # Feature flags
    enable_blockchain: bool                 = os.getenv("ENABLE_BLOCKCHAIN", "true").lower() == "true"
    enable_llm_caching: bool                = os.getenv("ENABLE_LLM_CACHING", "false").lower() == "true"
    
    # Streaming settings
    streaming_chunk_size: int               = int(os.getenv("STREAMING_CHUNK_SIZE", "20"))
    max_reconnect_attempts: int             = int(os.getenv("MAX_RECONNECT_ATTEMPTS", "5"))
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Create settings instance
settings = Settings()

# convert settings to dictionary for easy access
# settings_dict = settings.__dict__

# Additional configurations that might be needed at runtime
runtime_config = {
    "allowed_element_types": [
        "start", "end", "case", "flow_select",
        "chat_input", "context_history", "datablock", 
        "rest_api", "metadata", "constants",
        "read_blockchain_data", "build_transaction_json",
        "selector", "merger", "random_generator", "time",
        "llm_text", "llm_structured"
    ]
}

# Only add custom to allowed elements if enabled in settings
if settings.allow_custom_code:
    runtime_config["allowed_element_types"].append("custom")
