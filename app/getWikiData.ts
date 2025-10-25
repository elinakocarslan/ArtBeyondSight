// utils/getWikiData.ts

export interface WikiData {
  title: string;
  summary: string;
  thumbnail: string | null;
  wikiUrl: string | null;
}

/**
 * Fetches summary, image, and article link for a given title from Wikipedia.
 * 
 * @param title - The title of the article to fetch (e.g., "Mona Lisa")
 * @param lang - The language code (default: "en")
 * @returns A WikiData object or null if not found
 */
export async function getWikiData(title: string, lang: string = "en"): Promise<WikiData | null> {
  try {
    if (!title) throw new Error("Title is required");

    // Ensure fetch exists (Node <18 doesn't provide global fetch). Dynamically import node-fetch when needed.
    if (typeof globalThis.fetch !== 'function') {
      try {
        // Dynamically import node-fetch without requiring compile-time types
        const fetchModule: any = await import('node-fetch');
        // node-fetch v3 uses default export
        (globalThis as any).fetch = fetchModule.default ?? fetchModule;
      } catch {
        // If import fails, surface a clearer error
        throw new Error('Global fetch is not available and node-fetch could not be loaded. Install node-fetch or use Node 18+.');
      }
    }

    const encoded = encodeURIComponent(title.trim());
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encoded}`;

    // set a small timeout to avoid hanging
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`Wikipedia page not found for: ${title} (status ${res.status})`);
      return null;
    }

    const json = await res.json();

    return {
      title: json.title ?? title,
      summary: json.extract ?? 'No summary available.',
      thumbnail: json.thumbnail?.source ?? null,
      wikiUrl: json.content_urls?.desktop?.page ?? null,
    } as WikiData;
  } catch (error: any) {
    // Differentiate abort vs other
    if (error?.name === 'AbortError') {
      console.error('Wikipedia fetch aborted (timeout)');
    } else {
      console.error('Wikipedia fetch error:', error?.message ?? error);
    }
    return null;
  }
}

// default export for simpler imports in scripts/tests
export default getWikiData;
