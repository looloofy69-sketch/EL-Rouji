/**
 * Identify research input that is a direct HTTP(S) URL rather than a question.
 *
 * This guard keeps the public research route from enabling direct page scraping.
 * It is not a network-fetch or SSRF security control.
 */
export function isDirectUrlResearchQuery(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}
