# Guide checks

Run `npm test` for deterministic source, endpoint, and browser-helper checks. The model is mocked in endpoint tests; those checks do not establish answer accuracy.

The live question set is in `fixtures/agent-quality.json`. It covers M365, SBI, FloTrak, Armada, IQVIA, Oslo, Eda, and Systems, plus Eda's standards introduction. It includes follow-ups, invented metrics, misleading premises, capability boundaries, and ownership questions.

Start the updated local app, then explicitly opt in to model calls:

```
node scripts/check-agent-quality.js --live --output=/tmp/agent-quality.json
```

This uses the app's configured API connection and incurs normal model usage. The runner sends only the authored project context and test questions. It never reads or records an API key. It checks HTTP responses and that Oslo's references lead to existing section IDs. Word counts and timings are diagnostics, not quality scores.

Read each saved answer against the authored material. Check that it:

- Answers every part of the question without a project recap.
- Preserves uncertainty, prototype status, and the distinction between qualitative accounts and measured outcomes.
- Keeps sources, projects, and stations separate.
- Does not assign model engineering, regulatory guarantees, hardware behavior, or accessibility certification without evidence.
- Explains proposed checks as proposed checks, not tested implementation.
- Handles follow-ups directly and avoids repeated introductory labels.

Critical regressions have source-scoped authored corrections as well as deterministic tests. Those corrections supplement the general evidence-review step; they do not guarantee correctness on unseen questions. Review-model changes can be tested with `GUIDE_REVIEW_MODEL`; the default remains the existing gpt-4o-mini model. Restart the local server after updating cached project knowledge or server prompts before running live checks.

Guide continuation is stored in sessionStorage for the current browser tab while a guide is open. Messages are restored as text and validated source links, never stored HTML. Explicitly closing the guide clears automatic continuation. Existing project/station memory boundaries remain intact. Tests also cover blocked storage: cross-page references open separately so the original discussion remains available.
