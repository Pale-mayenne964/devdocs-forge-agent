/**
 * Transcript normalizer.
 * Strips timestamps from VTT/SRT, collapses blank lines,
 * and trims the result. Preserves speaker labels, code blocks,
 * and plain Markdown. Does NOT modify the source file.
 */

/** Strip WebVTT headers, timestamps, and metadata lines. */
function stripVtt(content: string): string {
  return content
    .replace(/^WEBVTT[^\n]*\n?/m, '')
    .replace(/^X-TIMESTAMP-MAP[^\n]*\n?/gm, '')
    .replace(/^NOTE\b[^\n]*/gm, '')
    .replace(/^\d{2}:\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}\.\d{3}[^\n]*/gm, '')
    .replace(/^\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}\.\d{3}[^\n]*/gm, '')
    .replace(/^\s*\d+\s*$/gm, ''); // VTT cue identifiers
}

/** Strip SRT sequence numbers and timestamps. */
function stripSrt(content: string): string {
  return content
    .replace(/^\d+\s*$/gm, '')
    .replace(/^\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}[^\n]*/gm, '');
}

/** Collapse 3+ consecutive blank lines into a single blank line. */
function collapseBlankLines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n');
}

/**
 * Normalize transcript text from a given format.
 *
 * @param content Raw file content
 * @param ext     Lowercase file extension including dot, e.g. '.vtt'
 * @returns Cleaned transcript text ready for word counting and storage
 */
export function normalizeTranscript(content: string, ext: string): string {
  let text = content;

  if (ext === '.vtt') {
    text = stripVtt(text);
  } else if (ext === '.srt') {
    text = stripSrt(text);
  }

  return collapseBlankLines(text).trim();
}

/**
 * Count words in normalized transcript text.
 * Splits on whitespace and filters empty tokens.
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
