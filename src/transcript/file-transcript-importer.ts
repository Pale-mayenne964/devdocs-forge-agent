import { extname } from 'path';
import { readFile } from '../utils/fs-utils.js';
import { normalizeTranscript, countWords } from './transcript-normalizer.js';
import { writeTranscript } from './transcript-output-writer.js';
import type { TranscriptIntakeResult } from './transcript.types.js';

const SUPPORTED_EXTENSIONS = ['.md', '.txt', '.vtt', '.srt'];

/**
 * Imports a transcript from a local file (.md, .txt, .vtt, .srt).
 * Strips VTT/SRT timestamps for word counting and normalizes the text.
 * Does NOT modify the source file — writes normalized output to outputFile.
 */
export function importFromFile(
  sourceFile: string,
  outputFile: string,
  sourceUrl?: string,
  minWords = 150,
): TranscriptIntakeResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  const ext = extname(sourceFile).toLowerCase();

  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    return {
      ok: false,
      method: 'file',
      wordCount: 0,
      warnings,
      errors: [
        `Unsupported file type: ${ext}`,
        `Supported formats: ${SUPPORTED_EXTENSIONS.join(', ')}`,
      ],
      nextCommands: [],
    };
  }

  let raw: string;
  try {
    raw = readFile(sourceFile);
  } catch {
    return {
      ok: false,
      method: 'file',
      wordCount: 0,
      warnings,
      errors: [`Could not read file: ${sourceFile}`],
      nextCommands: [],
    };
  }

  if (!raw.trim()) {
    return {
      ok: false,
      method: 'file',
      wordCount: 0,
      warnings,
      errors: [`File is empty: ${sourceFile}`],
      nextCommands: [],
    };
  }

  const normalized = normalizeTranscript(raw, ext);
  const wc = countWords(normalized);

  if (wc < minWords) {
    errors.push(
      `File transcript is too short (${wc} words). Minimum required: ${minWords}.`,
    );
  } else if (wc < 500) {
    warnings.push(
      `Transcript is short (${wc} words). Consider adding more context for better output.`,
    );
  }

  if (errors.length > 0) {
    return { ok: false, method: 'file', wordCount: wc, warnings, errors, nextCommands: [] };
  }

  writeTranscript({
    text: normalized,
    outputFile,
    sourceUrl,
    importMethod: 'file',
    originalFile: sourceFile,
  });

  const nextCmd = sourceUrl
    ? `devdocs-forge-agent generate --url "${sourceUrl}" --file ${outputFile} --type docusaurus`
    : `devdocs-forge-agent generate --file ${outputFile} --type docusaurus`;

  return {
    ok: true,
    method: 'file',
    outputFile,
    originalFile: sourceFile,
    wordCount: wc,
    warnings,
    errors: [],
    nextCommands: [nextCmd],
  };
}
