"""
ResearchAgent - Main Agent Loop

Entry point for the research agent with a ReAct-style reasoning loop.
"""

import logging
from typing import Optional

from rich.console import Console
from rich.panel import Panel

from agent.tools import ToolRegistry
from agent.llm import LLMClient
from agent.memory import ConversationMemory

logger = logging.getLogger(__name__)
console = Console()

MAX_ITERATIONS = 10


class ResearchAgent:
    """
    AI agent that answers research questions using available tools.

    Implements a ReAct loop: Think -> Act -> Observe -> Repeat.

    TODO: Implement the full agent loop with LLM-driven tool selection.
    """

    def __init__(self, max_iterations: int = MAX_ITERATIONS):
        self.max_iterations = max_iterations
        self.tools = ToolRegistry()
        self.llm = LLMClient()
        self.memory = ConversationMemory()

    def run(self, question: str) -> str:
        """
        Run the agent to answer a research question.

        Args:
            question: The research question to investigate.

        Returns:
            The agent's synthesized answer.

        TODO: Implement the full ReAct loop:
            1. Send question + memory + tool descriptions to LLM
            2. Parse LLM response for tool calls or final answer
            3. If tool call: execute tool, add observation to memory, repeat
            4. If final answer: return the answer
            5. If max iterations reached: return best available answer
        """
        console.print(Panel(question, title="Research Question", border_style="blue"))
        self.memory.add_message("user", question)

        for iteration in range(1, self.max_iterations + 1):
            console.print(f"\n[dim]--- Iteration {iteration}/{self.max_iterations} ---[/dim]")

            # TODO: Replace with actual LLM reasoning
            # Step 1: Think - Ask LLM what to do next
            # llm_response = self.llm.reason(
            #     question=question,
            #     memory=self.memory.get_history(),
            #     tools=self.tools.get_tool_descriptions(),
            # )

            # Step 2: Check if LLM wants to use a tool or give final answer
            # if llm_response.has_tool_call:
            #     tool_name = llm_response.tool_name
            #     tool_args = llm_response.tool_args
            #     console.print(f"[yellow]Using tool: {tool_name}[/yellow]")
            #     result = self.tools.execute(tool_name, **tool_args)
            #     self.memory.add_observation(tool_name, result)
            # else:
            #     answer = llm_response.final_answer
            #     self.memory.add_message("assistant", answer)
            #     return answer

            # Placeholder: return a stub response after first iteration
            answer = (
                f"[Placeholder] Agent received question: '{question}'. "
                f"Agent loop not yet implemented. "
                f"Available tools: {', '.join(self.tools.list_tools())}"
            )
            self.memory.add_message("assistant", answer)
            console.print(Panel(answer, title="Answer", border_style="green"))
            return answer

        return "Max iterations reached without a final answer."

    def reset(self) -> None:
        """Clear the agent's conversation memory."""
        self.memory.clear()
        console.print("[dim]Agent memory cleared.[/dim]")


def main():
    """Interactive CLI for the research agent."""
    console.print(
        Panel(
            "ResearchAgent - AI-Powered Research Assistant\n"
            "Type your research question, or 'quit' to exit.",
            border_style="bold blue",
        )
    )

    agent = ResearchAgent()

    while True:
        try:
            question = console.input("\n[bold]Question:[/bold] ").strip()
        except (EOFError, KeyboardInterrupt):
            break

        if not question:
            continue
        if question.lower() in ("quit", "exit", "q"):
            break

        agent.run(question)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
