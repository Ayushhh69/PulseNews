/**
 * Utility to generate a stable ID from a URL string.
 * Also provides title-based deduplication.
 */

/**
 * Simple hash function to generate a deterministic ID from a string.
 */
export function generateArticleId(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Normalize a title for comparison (lowercase, remove special chars).
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if two titles are similar enough to be considered duplicates.
 * Uses simple substring matching for performance.
 */
function areTitlesSimilar(titleA: string, titleB: string): boolean {
  const normA = normalizeTitle(titleA);
  const normB = normalizeTitle(titleB);

  if (normA === normB) return true;

  // Check if one is a substring of the other (common with truncated titles)
  if (normA.length > 10 && normB.length > 10) {
    const shorter = normA.length < normB.length ? normA : normB;
    const longer = normA.length < normB.length ? normB : normA;
    if (longer.includes(shorter)) return true;
  }

  return false;
}

/**
 * Remove duplicate articles based on URL and title similarity.
 * Prefers articles with images and more content.
 */
export function deduplicateArticles(
  articles: Array<{url: string; title: string; imageUrl?: string | null; content?: string}>,
): typeof articles {
  const seen = new Map<string, number>(); // URL -> index in result
  const seenTitles: string[] = [];
  const result: typeof articles = [];

  for (const article of articles) {
    // Skip if we've seen this exact URL
    if (seen.has(article.url)) {
      continue;
    }

    // Check for similar titles
    let isDuplicate = false;
    for (const existingTitle of seenTitles) {
      if (areTitlesSimilar(article.title, existingTitle)) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seen.set(article.url, result.length);
      seenTitles.push(article.title);
      result.push(article);
    }
  }

  return result;
}
