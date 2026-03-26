"""
DocuChat - Configuration

Central configuration loaded from environment variables.
"""

import os
from dotenv import load_dotenv

load_dotenv()


# --- OpenAI Configuration ---
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-ada-002")

# --- Document Processing ---
DEFAULT_CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "500"))
DEFAULT_CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "50"))

# --- Retrieval ---
DEFAULT_TOP_K = int(os.getenv("TOP_K", "3"))
SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", "0.7"))

# --- ChromaDB ---
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_data")
CHROMA_COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "documents")

# --- Application ---
APP_TITLE = "DocuChat"
APP_DESCRIPTION = "Ask questions about your documents"
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "50"))

# TODO: Add validation to ensure required keys are set before startup
# TODO: Add support for Anthropic API as an alternative LLM backend
# TODO: Add logging configuration
