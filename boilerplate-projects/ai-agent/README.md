# ResearchAgent - AI-Powered Research Assistant

**Status: In Development**

An AI agent that can search the web, summarize academic papers, and answer complex research questions. Built with a modular tool-use architecture, ResearchAgent breaks down research tasks into steps, gathers information from multiple sources, and synthesizes coherent answers.

---

## Project Overview

ResearchAgent implements a ReAct-style (Reasoning + Acting) agent loop. Given a research question, the agent decides which tools to use, executes them, observes the results, and iterates until it has gathered enough information to provide a comprehensive answer. The agent maintains conversation memory for multi-turn research sessions.

## Agent Architecture

```
User Question
      |
      v
+------------------+
|   Agent Loop     |  <-- Powered by Claude / GPT-4
|                  |
|  1. Think        |  Reason about what information is needed
|  2. Select Tool  |  Choose from available tools
|  3. Execute      |  Run the selected tool
|  4. Observe      |  Process tool output
|  5. Repeat or    |  Decide if more info is needed
|     Respond      |  Synthesize final answer
+------------------+
      |
      v
  Tools Available:
  - web_search        Search the web for relevant information
  - summarize         Summarize a long text or document
  - extract_findings  Pull key findings from research papers
```

## Tech Stack

- **LLM Client:** Anthropic Claude API
- **Web Requests:** requests + BeautifulSoup4
- **Terminal UI:** Rich (formatted console output)
- **Architecture:** Custom agent loop with tool dispatch

## Planned Features

- [ ] ReAct-style agent loop with configurable max iterations
- [ ] Web search tool with result parsing and ranking
- [ ] Document summarization with adjustable detail level
- [ ] Key findings extraction from research papers
- [ ] Conversation memory for multi-turn research sessions
- [ ] Source tracking and citation generation
- [ ] Configurable LLM backend (Anthropic, OpenAI)
- [ ] Rate limiting and cost tracking for API calls
- [ ] Export research sessions to Markdown
- [ ] Parallel tool execution for faster research
- [ ] Custom tool registration (plug in your own tools)
- [ ] Evaluation framework for answer quality

## Setup Instructions

```bash
# Navigate to the project
cd ai-agent

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
export ANTHROPIC_API_KEY="your_key_here"

# Run the agent
python -m agent.main

# Try an example query
python examples/example_query.py
```

## Project Structure

```
ai-agent/
  agent/
    main.py           # Entry point and agent loop
    tools.py           # Tool definitions and implementations
    llm.py             # LLM client abstraction
    memory.py          # Conversation memory management
  examples/
    example_query.py   # Example usage script
  requirements.txt
  .gitignore
  README.md
```

## Usage

```python
from agent.main import ResearchAgent

agent = ResearchAgent()
answer = agent.run("What are the latest advances in protein folding prediction?")
print(answer)
```

## License

MIT
