"""
DocuChat - RAG Chatbot

Streamlit application for document-grounded question answering.
"""

import streamlit as st
from app.embeddings import DocumentProcessor
from app.retriever import Retriever
from app.llm import LLMClient

# Page configuration
st.set_page_config(
    page_title="DocuChat",
    page_icon="?",
    layout="wide",
)

st.title("DocuChat")
st.caption("Ask questions about your documents. Upload files to get started.")


def initialize_session_state():
    """Set up Streamlit session state for chat history and document store."""
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "documents_loaded" not in st.session_state:
        st.session_state.documents_loaded = False
    if "processor" not in st.session_state:
        st.session_state.processor = DocumentProcessor()
    if "retriever" not in st.session_state:
        st.session_state.retriever = Retriever()
    if "llm" not in st.session_state:
        st.session_state.llm = LLMClient()


initialize_session_state()

# --- Sidebar: Document Upload ---
with st.sidebar:
    st.header("Document Upload")

    uploaded_files = st.file_uploader(
        "Upload PDF or text files",
        type=["pdf", "txt", "md"],
        accept_multiple_files=True,
    )

    if uploaded_files and st.button("Process Documents"):
        with st.spinner("Processing documents..."):
            # TODO: Implement document processing pipeline
            # for file in uploaded_files:
            #     chunks = st.session_state.processor.process(file)
            #     st.session_state.retriever.add_documents(chunks)
            # st.session_state.documents_loaded = True
            st.info("Document processing not yet implemented.")

    st.divider()
    st.subheader("Settings")
    # TODO: Add configurable settings
    chunk_size = st.slider("Chunk size", 200, 2000, 500, step=100)
    chunk_overlap = st.slider("Chunk overlap", 0, 500, 50, step=25)
    top_k = st.slider("Retrieved passages (top-k)", 1, 10, 3)

# --- Main Chat Interface ---
# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat input
if prompt := st.chat_input("Ask a question about your documents..."):
    # Add user message to history
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Generate response
    with st.chat_message("assistant"):
        if not st.session_state.documents_loaded:
            response = "Please upload and process documents first using the sidebar."
        else:
            # TODO: Implement the full RAG pipeline:
            # 1. Retrieve relevant chunks
            # relevant_chunks = st.session_state.retriever.search(prompt, top_k=top_k)
            # 2. Generate answer with context
            # response = st.session_state.llm.generate(prompt, relevant_chunks)
            response = "RAG pipeline not yet implemented."

        st.markdown(response)
        st.session_state.messages.append({"role": "assistant", "content": response})
