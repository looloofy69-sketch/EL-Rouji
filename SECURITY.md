# Security Policy

## Scope

This policy applies to the EL-Rouji source in this repository and the associated application maintained by its owner.

## Reporting a vulnerability

Please do not publish exploitable details in a public issue. Use GitHub's private vulnerability reporting/security advisory feature if it is enabled for this repository. Otherwise, contact the repository owner privately through an established channel and include steps to reproduce, impact, and affected versions. Do not include real user data or credentials.

## Handling secrets

- Store `TAVILY_API_KEY` and other service credentials only in the server-side secret manager/environment.
- Never commit `.env`, keys, tokens, cookies, or private conversation exports.
- If a secret is exposed, revoke/rotate it immediately and remove it from active deployments; deleting a file from a later commit does not erase it from Git history.
- Treat uploaded content and conversation history as potentially sensitive.

## Current verification limits

A repository import and successful production deployment do not constitute a security audit. Authentication, authorization, file validation, calculator input handling, dependency vulnerabilities, and data retention still require independent review.