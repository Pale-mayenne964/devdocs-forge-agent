import { writeFile } from '../utils/fs-utils.js';

interface TranscriptWriteOptions {
  text: string;
  outputFile: string;
  sourceUrl?: string;
  importMethod: string;
  originalFile?: string;
}

/**
 * Writes a normalized transcript to disk with optional YAML frontmatter
 * for source attribution. The frontmatter is minimal — only included
 * when a sourceUrl is provided so the file remains valid plain Markdown.
 */
export function writeTranscript(opts: TranscriptWriteOptions): void {
  const { text, outputFile, sourceUrl, importMethod, originalFile } = opts;

  const lines: string[] = [];

  if (sourceUrl) {
    lines.push('---');
    lines.push(`source_url: ${sourceUrl}`);
    lines.push(`import_method: ${importMethod}`);
    if (originalFile) lines.push(`original_file: ${originalFile}`);
    lines.push('---');
    lines.push('');
  }

  lines.push(text);

  writeFile(outputFile, lines.join('\n'));
}
