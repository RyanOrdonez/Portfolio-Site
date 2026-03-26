"""
ResearchAgent - Example Usage

Demonstrates how to use the ResearchAgent to answer a research question.
"""

import logging

from agent.main import ResearchAgent


def main():
    """Run a sample research query through the agent."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )

    agent = ResearchAgent(max_iterations=5)

    # Example research questions to try
    questions = [
        "What are the latest advances in protein folding prediction?",
        "Compare transformer and LSTM architectures for time series forecasting.",
        "What is the current state of quantum error correction research?",
    ]

    # Run the first question as a demo
    question = questions[0]
    print(f"\nResearching: {question}\n")
    answer = agent.run(question)
    print(f"\nFinal Answer:\n{answer}")

    # TODO: Add multi-turn conversation example
    # agent.reset()
    # agent.run("What is CRISPR gene editing?")
    # agent.run("What are the ethical concerns around it?")  # Follow-up


if __name__ == "__main__":
    main()
