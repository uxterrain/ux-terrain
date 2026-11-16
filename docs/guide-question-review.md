# Reviewing visitor questions

Questions enter the private Vercel Blob store `ux-terrain-guide-questions` only when a visitor selects **Share question** after reviewing the text. The AI response includes a short-lived signed submission token; the server takes guide/page context from that token, not from client claims. Full transcripts, email addresses, names, IP addresses, and tracking IDs are not attached to records. Visitors are asked to remove personal details from the question itself.

There is no public read route. Use the connected project's private storage credentials in an owner terminal, then run:

```
npm run questions:review
```

The command lists only the `guide-questions/` prefix, reads records privately, and groups them by project and topic. Repeated wording is normalized for case and punctuation. Topic grouping is a simple navigation aid, not a claim that differently worded questions mean the same thing. No LLM is given these records during ordinary visitor conversations.

To improve knowledge:

1. Review recurring questions and meaningful unanswered questions.
2. Ask Jimmy for the actual experience or locate an existing source.
3. Update the relevant published case-study section, preserving uncertainty and maturity.
4. Rebuild shared knowledge and add a regression question where useful.
5. Verify an answer in both guides before publishing.

Do not treat visitor assertions, proposed metrics, or prior generated answers as evidence. Do not automatically publish or train on submissions. A shared question is not an email request and carries no promise of a reply.

For a deletion request, locate the matching question using the supplied wording/date, then delete that exact blob through the owner storage tools. Never expose the store token to a browser or publish a raw export. Review exports may contain whatever a visitor chose to type; keep them private.

Email handoff is separate: a `mailto:` draft includes the current question and case-study URL. Only the visitor's email application can send it.
