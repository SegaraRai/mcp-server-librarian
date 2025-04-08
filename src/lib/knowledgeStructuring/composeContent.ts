export function composeContent(
  contentSpecifiers: readonly string[],
  sourceDocumentLines: readonly string[],
): string {
  const lines = [];

  for (const specifier of contentSpecifiers) {
    const match = specifier?.match(/^@\D*(\d+)(?:-\D*(\d+))?/);
    if (match) {
      const start = parseInt(match[1], 10) - 1;
      const end = match[2] ? parseInt(match[2], 10) : start + 1;
      lines.push(...sourceDocumentLines.slice(start, end));
      continue;
    }

    lines.push(specifier.replace(/^=/, ""));
  }

  return lines.join("\n");
}
