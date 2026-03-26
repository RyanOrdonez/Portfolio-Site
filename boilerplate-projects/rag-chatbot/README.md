# DocuChat - RAG Chatbot

**Status: In Development**

A Retrieval-Augmented Generation (RAG) chatbot that answers questions over custom documents. Upload PDFs, text files, or other documents and ask natural language questions -- DocuChat retrieves relevant passages and generates accurate, grounded answers.

## Project Overview

DocuChat implements the RAG pattern to provide accurate, citation-backed answers from your own document corpus. Rather than relying solely on an LLM's training data, it retrieves relevant context from your uploaded documents before generating a response, reducing hallucination and ensuring answers are grounded in your source material.

### RAG Architecture

```
User Question
      |
      v
 [Query Embedding] --> [Vector Search] --> [Top-K Relevant Chunks]
                                                    |
                                                    v
                                        [Prompt Construction]
                                        (question + context chunks)
                                                    |
                                                    v
                                            [LLM Generation]
                                                    |
                                                    v
                                          Answer with Citations
```

## Tech Stack

- **Frontend:** Streamlit
- **Orchestration:** LangChain
- **Vector Store:** ChromaDB
- **Embeddings:** OpenAI text-embedding-ada-002
- **LLM:** OpenAI GPT-4 (configurable)
- **Document Parsing:** PyPDF, text loaders

## Planned Features

- [ ] PDF and plain text document upload via Streamlit UI
- [ ] Automatic document chunking with configurable chunk size and overlap
- [ ] Embedding generation and vector storage in ChromaDB
- [ ] Semantic similarity search for relevant passage retrieval
- [ ] Context-aware answer generation with source citations
- [ ] Conversation memory for multi-turn interactions
- [ ] Support for multiple document collections
- [ ] Configurable LLM backend (OpenAI, Anthropic, local models)
- [ ] Document management UI (view, delete uploaded documents)
- [ ] Export chat history
- [ ] Evaluation framework for answer quality

## Setup Instructions

```bash
# Clone and navigate to the project
cd rag-chatbot

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run the application
streamlit run app/main.py
```

## Project Structure

```
rag-chatbot/
├── app/
│   ├── main.py          # Streamlit application UI
│   ├── embeddings.py    # Document chunking and embedding generation
│   ├── retriever.py     # Vector search and retrieval logic
│   └── llm.py           # LLM client and prompt construction
├── config.py            # Configuration and environment variables
├── requirements.txt
├── .gitignore
└── README.md
```

## License

MIT
