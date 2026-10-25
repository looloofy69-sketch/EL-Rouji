# Legal/Administrative RAG Dataset Guide

**Status:** Initial collection protocol; no legal corpus has been ingested or approved.  
**Related plan:** [Algeria-centric engine roadmap](ALGERIA_CENTRIC_ENGINE_ROADMAP.md)

## Purpose and boundary

This guide defines a controlled workflow for preparing official Algerian public-source metadata and evaluation cases for a future retrieval-augmented generation (RAG) prototype. It does not add a public API, vector store, embedding model, legal advice feature, document crawler, or model-training pipeline.

The initial repository assets are intentionally empty:
- `data/legal-rag/source-manifest.json` — metadata inventory; no source entries are approved yet.
- `data/legal-rag/evaluation-set.json` — versioned test-case container; no test cases have yet been reviewed.
- `schemas/legal-rag-source-manifest.schema.json` and `schemas/legal-rag-evaluation-set.schema.json` — version 1 data contracts.

Empty files mean **not collected**, not that the corpus is complete or there are no applicable laws.

## Source admission process

1. **Define the question domain.** Start with a small topic such as a specific administrative business procedure or tax question. Avoid promising coverage of all Algerian law.
2. **Find the authoritative primary source.** Begin with the official [Journal Officiel / Secrétariat Général du Gouvernement portal](https://www.joradp.dz/HFR/Accueil.htm). Add another ministry or public-service source only after checking its authority for that subject.
3. **Confirm provenance and reuse basis.** Record the publisher, exact URL, title, document identifier, and the permitted basis for retaining or indexing the content. Do not assume that a public URL automatically grants unrestricted bulk reuse. If rights/terms are uncertain, mark `review_required` or keep only allowable metadata pending review.
4. **Preserve the exact version.** Record fetch time, SHA-256 of the source artifact, parser version, and document/version label. A checksum identifies the collected bytes; it does not prove that a document is current.
5. **Validate legal dates separately.** Record publication date and effective dates only when supported by the source or an authoritative amendment. Do not infer effective date from upload date. Mark unknown status or supersession with a quality flag.
6. **Review text quality.** Check Arabic encoding, RTL ordering, article/section boundaries, footnotes, tables, scanned pages, page numbering and extraction errors. OCR output is not approved until manually checked for the intended use.
7. **Approve before retrieval.** Set `verification_status` to `approved` only after source authority, reuse basis, extracted text and date/status metadata are reviewed. Keep retired/superseded records for traceability only if retention/use is appropriate; exclude them from current-answer retrieval by default.
8. **Re-run impact checks on refresh.** When content changes, compare checksums, retain provenance, review amendments/repeals, update the corpus version and rerun affected evaluation cases. Never silently overwrite legal history.

Store source documents and parsed text in a deliberately chosen storage location with access, backup, deletion and retention controls. The public repository should normally hold only reviewed metadata, schemas, authored test cases and non-sensitive provenance—not a copy of an entire document collection unless reuse rights and repository suitability are confirmed.

## Metadata contract

The JSON Schema in `schemas/legal-rag-source-manifest.schema.json` defines source-level metadata including:
- stable source ID and canonical HTTPS URL;
- publisher, title, document type, jurisdiction, language and script;
- publication/effective dates and a cautious document-status field;
- retrieval timestamp, SHA-256 checksum and parser/version notes;
- a reuse basis with evidence and explanatory note;
- verification status and quality flags.

Use `unknown`/null plus a quality flag rather than filling in a guess. The schema validates structure only; it cannot certify legal authority or that a regulation remains in force.

## Evaluation-case authoring

Use `schemas/legal-rag-evaluation-set.schema.json` to curate questions and expected behavior. Include cases for:
- answerable questions with the exact source IDs required to support an answer;
- unanswerable or out-of-scope questions where the expected behavior is abstention;
- ambiguous requests that require clarification;
- amendment/repeal and effective-date traps;
- conflicting or incomplete source documents;
- Arabic, French, English, Arabic-script Darija, Latin-script Darija and code-switching;
- prompt-injection-like text inside a document, malformed extraction and missing citations.

Do not copy private user chats, account history, uploaded identity/financial documents or other personal content into the evaluation set by default. Prefer authored synthetic test questions. Any future use of personal data requires a separate informed opt-in, data minimization, retention/deletion rules and review.

Only mark a case `approved` after an appropriate reviewer has verified its target source IDs and expected behavior. An expected source ID must resolve to an approved corpus record in the corpus version used for that run. Store model output and scores as a separate run artifact instead of overwriting expected answers.

## Future validation requirements

Before any production or public pilot:
- add automated JSON Schema validation to CI or an explicit validator script;
- version the manifest, corpus, extraction pipeline, retrieval/index, prompt and evaluation set together;
- prove that displayed citations refer to the retrieved passages actually used for generation;
- test stale, amended, repealed, missing and conflicting-source behavior;
- test injection-like source text and citation hallucination;
- measure retrieval quality separately across language/script groups;
- establish latency, token/context and cost limits;
- confirm endpoint authorization, quotas and live AppDeploy behavior before exposing a new endpoint.

The current CI build passing does not validate these data schemas or a future RAG pipeline. The schemas and empty templates should remain preparatory assets until their own validation tests are implemented and passing.
