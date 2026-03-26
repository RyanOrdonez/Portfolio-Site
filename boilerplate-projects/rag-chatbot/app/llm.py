"""
DocuChat - LLM Integration

Handles prompt construction and LLM-based answer generation.
"""

from typing import List, Dict, Any


class LLMClient:
    """
    Client for generating answers using an LLM with retrieved context.

    TODO: Integrate with OpenAI API or LangChain LLM wrappers.
    """

    def __init__(self, model: str = "gpt-4"):
        self.model = model
        # TODO: Initialize OpenAI client
        # from openai import OpenAI
        # self.client = OpenAI()

    def build_prompt(self, question: str, context_chunks: List[Dict[str, Any]]) -> str:
        """
        Construct a RAG prompt combining the user question with retrieved context.

        Args:
            question: The user's question.
            context_chunks: Retrieved document chunks with text and metadata.

        Returns:
            Formatted prompt string for the LLM.
        """
        context_text = "\n\n---\n\n".join(
            f"[Source: {chunk['metadata'].get('source', 'unknown')}]\n{chunk['text']}"
            for chunk in context_chunks
        )

        prompt = (
            "You are a helpful assistant that answers questions based on the provided "
            "document context. If the answer is not found in the context, say so clearly. "
            "Always cite which source document your answer comes from.\n\n"
            f"CONTEXT:\n{context_text}\n\n"
            f"QUESTION: {question}\n\n"
            "ANSWER:"
        )
        return prompt

    def generate(self, question: str, context_chunks: List[Dict[str, Any]]) -> str:
        """
        Generate an answer to the question using retrieved context.

        Args:
            question: The user's question.
            context_chunks: Retrieved document chunks from vector search.

        Returns:
            Generated answer string.

        TODO: Implement actual LLM call:
            prompt = self.build_prompt(question, context_chunks)
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful document assistant."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
                max_tokens=1000,
            )
            return response.choices[0].message.content
        """
        prompt = self.build_prompt(question, context_chunks)

        # Placeholder response
        return (
            f"[Placeholder] Received question: '{question}' with "
            f"{len(context_chunks)} context chunks. "
            "LLM integration not yet implemented."
        )
