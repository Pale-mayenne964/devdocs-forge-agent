import { createInterface } from 'readline';
import { normalizeTranscript, countWords } from './transcript-normalizer.js';
import { writeTranscript } from './transcript-output-writer.js';
import type { TranscriptIntakeResult } from './transcript.types.js';

const END_MARKER = ':::end';

/**
 * Reads transcript text from stdin line by line until the user
 * types the end marker (:::end) on a line by itself.
 * Normalizes and validates the pasted content, then writes to outputFile.
 */
export async function importFromPaste(
  outputFile: string,
  sourceUrl?: string,
  minWords = 150,
): Promise<TranscriptIntakeResult> {
  const warnings: string[] = [];
  const errors: string[] = [];

  const lines: string[] = [];

  process.stdout.write(
    `Paste your transcript below. When done, type ${END_MARKER} on a new line and press Enter.\n\n`,
  );

  await new Promise<void>((resolve) => {
    const rl = createInterface({ input: process.stdin, terminal: false });

    rl.on('line', (line) => {
      if (line.trim() === END_MARKER) {
        rl.close();
      } else {
        lines.push(line);
      }
    });

    rl.on('close', resolve);
  });

  const raw = lines.join('\n');

  if (!raw.trim()) {
    return {
      ok: false,
      method: 'paste',
      wordCount: 0,
      warnings,
      errors: [
        'No transcript was pasted.',
        `Type or paste your transcript, then end with: ${END_MARKER}`,
      ],
      nextCommands: [],
    };
  }

  const normalized = normalizeTranscript(raw, '.txt');
  const wc = countWords(normalized);

  if (wc < minWords) {
    errors.push(
      `Pasted text is too short (${wc} words). Minimum required: ${minWords}.`,
    );
  } else if (wc < 500) {
    warnings.push(
      `Transcript is short (${wc} words). Consider adding more context for better output.`,
    );
  }

  if (errors.length > 0) {
    return { ok: false, method: 'paste', wordCount: wc, warnings, errors, nextCommands: [] };
  }

  writeTranscript({ text: normalized, outputFile, sourceUrl, importMethod: 'paste' });

  const nextCmd = sourceUrl
    ? `devdocs-forge-agent generate --url "${sourceUrl}" --file ${outputFile} --type docusaurus`
    : `devdocs-forge-agent generate --file ${outputFile} --type docusaurus`;

  return {
    ok: true,
    method: 'paste',
    outputFile,
    wordCount: wc,
    warnings,
    errors: [],
    nextCommands: [nextCmd],
  };
}
