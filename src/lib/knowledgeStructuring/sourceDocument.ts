export async function fetchSourceDocument(source: string): Promise<string> {
  if (!/^https?:\/\//.test(source)) {
    throw new Error(
      "Unsupported source format. Only HTTP(S) URLs are supported.",
    );
  }

  const res = await fetch(source, {
    cache: "no-store",
    headers: {
      "User-Agent": "Librarian/1.0.0",
      Accept: "text/markdown, text/plain",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch source document: ${res.statusText}`);
  }

  const text = await res.text();
  if (!text.trim()) {
    throw new Error("Source document is empty.");
  }

  return text.trim();
}

export function sourceDocumentToLines(sourceDocument: string): string[] {
  const lines = sourceDocument.split("\n");
  const lineNumberWidth = String(lines.length).length;
  return lines.map(
    (line, index) =>
      `${String(index + 1).padStart(lineNumberWidth, " ")} | ${line}`,
  );
}
