import { normalizeTranscript, countWords } from './transcript-normalizer.js';
import { writeTranscript } from './transcript-output-writer.js';
import type { TranscriptIntakeResult } from './transcript.types.js';

/**
 * Reads text from the system clipboard, normalizes it, validates it,
 * and writes it to the output file.
 *
 * Requires clipboardy (cross-platform: macOS pbpaste, Linux xclip/xsel,
 * Windows PowerShell). Never fetches content from the network.
 */
export async function importFromClipboard(
  outputFile: string,
  sourceUrl?: string,
  minWords = 150,
): Promise<TranscriptIntakeResult> {
  const warnings: string[] = [];
  const errors: string[] = [];

  let raw = '';
  try {
    const { default: clipboardy } = await import('clipboardy');
    raw = await clipboardy.read();
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : String(err);
    errors.push(
      `Could not read clipboard: ${msg}\n` +
        '  On Linux, install xclip or xsel.\n' +
        '  On macOS, ensure Terminal has clipboard access.\n' +
        '  On Windows, ensure PowerShell is available.',
    );
    return {
      ok: false,
      method: 'clipboard',
      wordCount: 0,
      warnings,
      errors,
      nextCommands: [],
    };
  }

  if (!raw || !raw.trim()) {
    return {
      ok: false,
      method: 'clipboard',
      wordCount: 0,
      warnings,
      errors: [
        'Clipboard is empty.',
        'Copy the transcript text first, then rerun:',
        `  devdocs-forge-agent transcript clipboard --out ${outputFile}${sourceUrl ? ` --url "${sourceUrl}"` : ''}`,
      ],
      nextCommands: [],
    };
  }

  const normalized = normalizeTranscript(raw, '.txt');
  const wc = countWords(normalized);

  if (wc < minWords) {
    errors.push(
      `Clipboard text is too short (${wc} words). Minimum required: ${minWords}.`,
    );
  } else if (wc < 500) {
    warnings.push(
      `Transcript is short (${wc} words). Consider adding more context for better output.`,
    );
  }

  if (errors.length > 0) {
    return { ok: false, method: 'clipboard', wordCount: wc, warnings, errors, nextCommands: [] };
  }

  writeTranscript({ text: normalized, outputFile, sourceUrl, importMethod: 'clipboard' });

  const nextCmd = sourceUrl
    ? `devdocs-forge-agent generate --url "${sourceUrl}" --file ${outputFile} --type docusaurus`
    : `devdocs-forge-agent generate --file ${outputFile} --type docusaurus`;

  return {
    ok: true,
    method: 'clipboard',
    outputFile,
    wordCount: wc,
    warnings,
    errors: [],
    nextCommands: [nextCmd],
  };
}
