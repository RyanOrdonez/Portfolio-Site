"""
ResearchAgent - Tool Definitions

Defines the tools available to the agent for research tasks.
"""

import logging
from typing import Dict, Any, Callable, List

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


class ToolRegistry:
    """
    Registry of tools the agent can use during research.

    Each tool is a callable with a name, description, and parameter spec.
    """

    def __init__(self):
        self._tools: Dict[str, Dict[str, Any]] = {}
        self._register_default_tools()

    def _register_default_tools(self) -> None:
        """Register the built-in research tools."""
        self.register(
            name="web_search",
            description=(
                "Search the web for information on a topic. "
                "Returns a list of relevant results with titles and snippets."
            ),
            parameters={"query": "The search query string"},
            function=web_search,
        )
        self.register(
            name="summarize",
            description=(
                "Summarize a long piece of text into a concise overview. "
                "Useful for distilling articles or papers."
            ),
            parameters={"text": "The text to summarize", "max_length": "Maximum summary length"},
            function=summarize,
        )
        self.register(
            name="extract_key_findings",
            description=(
                "Extract key findings, conclusions, and important data points "
                "from a research paper or technical document."
            ),
            parameters={"text": "The document text to analyze"},
            function=extract_key_findings,
        )

    def register(
        self,
        name: str,
        description: str,
        parameters: Dict[str, str],
        function: Callable,
    ) -> None:
        """Register a new tool."""
        self._tools[name] = {
            "name": name,
            "description": description,
            "parameters": parameters,
            "function": function,
        }

    def execute(self, tool_name: str, **kwargs) -> str:
        """Execute a tool by name with the given arguments."""
        if tool_name not in self._tools:
            return f"Error: Unknown tool '{tool_name}'"

        try:
            return self._tools[tool_name]["function"](**kwargs)
        except Exception as e:
            logger.error("Tool '%s' failed: %s", tool_name, e)
            return f"Error executing {tool_name}: {e}"

    def list_tools(self) -> List[str]:
        """Return a list of registered tool names."""
        return list(self._tools.keys())

    def get_tool_descriptions(self) -> List[Dict[str, Any]]:
        """Return tool descriptions formatted for LLM consumption."""
        return [
            {
                "name": tool["name"],
                "description": tool["description"],
                "parameters": tool["parameters"],
            }
            for tool in self._tools.values()
        ]


# --- Tool Implementations ---


def web_search(query: str) -> str:
    """
    Search the web for information.

    Args:
        query: Search query string.

    Returns:
        Formatted search results.

    TODO: Implement actual web search:
        - Option A: Use a search API (SerpAPI, Brave Search, Tavily)
        - Option B: Scrape search engine results (less reliable)
        - Add result caching to avoid redundant searches
        - Add result ranking and deduplication
    """
    # Placeholder implementation
    logger.info("Web search called with query: %s", query)
    return (
        f"[Placeholder] Web search results for: '{query}'\n"
        "No actual search performed. Implement a search API integration."
    )


def summarize(text: str, max_length: int = 200) -> str:
    """
    Summarize a piece of text.

    Args:
        text: The text to summarize.
        max_length: Target maximum length for the summary.

    Returns:
        Summarized text.

    TODO: Implement summarization:
        - Use the LLM to generate a summary
        - Add extractive summarization as a fallback
        - Support different summary styles (bullet points, paragraph, abstract)
    """
    # Placeholder: truncate as a naive summary
    logger.info("Summarize called on text of length %d", len(text))
    if len(text) <= max_length:
        return text
    return text[:max_length] + "... [truncated - summarization not yet implemented]"


def extract_key_findings(text: str) -> str:
    """
    Extract key findings from a research document.

    Args:
        text: The document text to analyze.

    Returns:
        Formatted key findings.

    TODO: Implement findings extraction:
        - Use the LLM with a structured extraction prompt
        - Parse for numerical results, conclusions, and methodology notes
        - Return structured findings with confidence indicators
    """
    logger.info("Extract key findings called on text of length %d", len(text))
    return (
        "[Placeholder] Key findings extraction not yet implemented.\n"
        f"Input text length: {len(text)} characters."
    )


def fetch_webpage(url: str) -> str:
    """
    Fetch and extract text content from a webpage.

    Args:
        url: The URL to fetch.

    Returns:
        Extracted text content.

    TODO: Add this as a registered tool for the agent.
    """
    try:
        response = requests.get(url, timeout=10, headers={"User-Agent": "ResearchAgent/0.1"})
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # Remove script and style elements
        for element in soup(["script", "style", "nav", "footer"]):
            element.decompose()

        text = soup.get_text(separator="\n", strip=True)
        return text[:5000]  # Limit output length

    except requests.RequestException as e:
        logger.error("Failed to fetch %s: %s", url, e)
        return f"Error fetching URL: {e}"
