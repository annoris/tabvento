"""Run from this Tabvento checkout after `uv sync`.

Set OPENAI_API_KEY in the environment and install local Chromium if needed with
`uv run python -m browser_use install`. This example uses a direct model provider.
"""

from browser_use import Agent, Browser, ChatOpenAI

agent = Agent(
	'Find the top story on Hacker News',
	llm=ChatOpenAI('gpt-6-luna'),
	browser=Browser('chromium'),
)
result = agent.run_sync()
print(result.final_result())
