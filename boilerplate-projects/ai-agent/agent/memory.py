"""
ResearchAgent - Conversation Memory

Manages conversation history and tool observations for the agent.
"""

from typing import List, Dict, Optional
from datetime import datetime


class ConversationMemory:
    """
    Stores conversation history and tool observations for multi-turn agent sessions.

    TODO: Add persistence (save/load sessions to disk).
    TODO: Add memory summarization for long conversations to manage context window.
    TODO: Add semantic memory retrieval for relevant past interactions.
    """

    def __init__(self, max_history: int = 50):
        self.max_history = max_history
        self._messages: List[Dict[str, str]] = []
        self._observations: List[Dict[str, str]] = []

    def add_message(self, role: str, content: str) -> None:
        """
        Add a message to the conversation history.

        Args:
            role: The speaker role ("user", "assistant", "system").
            content: The message content.
        """
        self._messages.append(
            {
                "role": role,
                "content": content,
                "timestamp": datetime.utcnow().isoformat(),
            }
        )

        # Trim if over max history
        if len(self._messages) > self.max_history:
            self._messages = self._messages[-self.max_history:]

    def add_observation(self, tool_name: str, result: str) -> None:
        """
        Record a tool execution observation.

        Args:
            tool_name: Name of the tool that was executed.
            result: The tool's output.
        """
        observation = {
            "tool": tool_name,
            "result": result,
            "timestamp": datetime.utcnow().isoformat(),
        }
        self._observations.append(observation)

        # Also add to messages for context
        self.add_message(
            "system",
            f"[Tool: {tool_name}] {result}",
        )

    def get_history(self) -> List[Dict[str, str]]:
        """Return the full conversation history."""
        return list(self._messages)

    def get_observations(self) -> List[Dict[str, str]]:
        """Return all tool observations."""
        return list(self._observations)

    def get_last_n(self, n: int = 5) -> List[Dict[str, str]]:
        """Return the last N messages."""
        return self._messages[-n:]

    def format_for_prompt(self) -> str:
        """
        Format the conversation history for inclusion in an LLM prompt.

        Returns:
            Formatted string representation of the conversation.

        TODO: Add smart truncation based on token count rather than message count.
        """
        lines = []
        for msg in self._messages:
            role = msg["role"].upper()
            lines.append(f"{role}: {msg['content']}")
        return "\n\n".join(lines)

    def clear(self) -> None:
        """Clear all conversation history and observations."""
        self._messages.clear()
        self._observations.clear()

    def __len__(self) -> int:
        return len(self._messages)

    def __repr__(self) -> str:
        return (
            f"ConversationMemory(messages={len(self._messages)}, "
            f"observations={len(self._observations)})"
        )
