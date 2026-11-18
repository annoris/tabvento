"""Expose bounded JUnit failures in Actions annotations without requiring log downloads."""

from __future__ import annotations

import os
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


def escape(value: str) -> str:
	return value.replace('%', '%25').replace('\r', '%0D').replace('\n', '%0A')


def main() -> None:
	path = Path(sys.argv[1])
	if not path.is_file():
		print(f'No JUnit report produced: {path}')
		return
	root = ET.parse(path).getroot()
	failures = []
	for case in root.iter('testcase'):
		for failure in (*case.findall('failure'), *case.findall('error')):
			name = f'{case.get("classname", "")}.{case.get("name", "")}'
			text = (failure.text or failure.get('message', '')).strip()[:5000]
			failures.append(f'{name}\n{text}')
			print(f'::error title=Pytest failure::{escape(name + chr(10) + text)}')
	summary_path = os.getenv('GITHUB_STEP_SUMMARY')
	if summary_path:
		with Path(summary_path).open('a', encoding='utf-8') as summary:
			summary.write(f'## Pytest report: {len(failures)} failures\n\n')
			for failure in failures:
				summary.write('<pre>' + failure.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;') + '</pre>\n\n')


if __name__ == '__main__':
	main()
