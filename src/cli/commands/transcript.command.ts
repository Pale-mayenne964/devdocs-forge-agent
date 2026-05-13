import { logger } from '../../utils/logger.js';
import { runIntake } from '../../transcript/transcript-intake.service.js';
import type { TranscriptImportMethod, TranscriptIntakeResult } from '../../transcript/transcript.types.js';

function printResult(result: TranscriptIntakeResult): void {
  if (!result.ok) {
    for (const err of result.errors) {
      if (err === '') {
        logger.line();
      } else {
        logger.fail(err);
      }
    }
    if (result.warnings.length > 0) {
      for (const w of result.warnings) logger.warn(w);
    }
    process.exitCode = 1;
    return;
  }

  logger.ok(`Transcript saved: ${result.outputFile}`);
  logger.ok(`Word count: ${result.wordCount} words`);

  for (const w of result.warnings) {
    logger.warn(w);
  }

  if (result.nextCommands.length > 0) {
    logger.line();
    logger.success('Ready to generate. Run:');
    for (const cmd of result.nextCommands) {
      logger.dim(`  ${cmd}`);
    }
  }
}

export async function transcriptPasteCommand(opts: {
  url?: string;
  out: string;
}): Promise<void> {
  logger.section('Transcript Paste');
  const result = await runIntake({
    method: 'paste',
    outputFile: opts.out,
    sourceUrl: opts.url,
  });
  printResult(result);
}

export async function transcriptClipboardCommand(opts: {
  url?: string;
  out: string;
}): Promise<void> {
  logger.section('Transcript Clipboard');
  const result = await runIntake({
    method: 'clipboard',
    outputFile: opts.out,
    sourceUrl: opts.url,
  });
  printResult(result);
}

export async function transcriptImportFileCommand(opts: {
  from: string;
  url?: string;
  out: string;
}): Promise<void> {
  logger.section('Transcript Import File');
  const result = await runIntake({
    method: 'file',
    outputFile: opts.out,
    sourceUrl: opts.url,
    sourceFile: opts.from,
  });
  printResult(result);
}

export async function transcriptYouTubeOwnerCommand(opts: {
  url: string;
  out: string;
}): Promise<void> {
  logger.section('Transcript YouTube Owner OAuth');
  const result = await runIntake({
    method: 'youtube-owner-oauth',
    outputFile: opts.out,
    sourceUrl: opts.url,
  });
  printResult(result);
}

export async function transcriptTranscribeFileCommand(opts: {
  file: string;
  out: string;
}): Promise<void> {
  logger.section('Transcript Local Media Transcription');
  const result = await runIntake({
    method: 'local-media-transcription',
    outputFile: opts.out,
    sourceFile: opts.file,
  });
  printResult(result);
}

const INTAKE_INSTRUCTIONS = `
How to provide your transcript:

  1. Clipboard   (copy text first, then run):
       devdocs-forge-agent transcript clipboard --out input/transcript.md

  2. Paste       (type/paste, end with :::end):
       devdocs-forge-agent transcript paste --out input/transcript.md

  3. Import file (.md, .txt, .vtt, .srt):
       devdocs-forge-agent transcript import-file --from transcript.vtt --out input/transcript.md

  4. YouTube owner OAuth (requires you to own the video):
       devdocs-forge-agent transcript youtube-owner --url "<video-url>" --out input/transcript.md

devdocs-forge-agent does not scrape transcripts from YouTube or other platforms.
`;

export function showIntakeInstructions(url?: string): void {
  logger.section('Transcript Required');
  if (url) {
    logger.info(`Video URL: ${url}`);
    logger.line();
  }
  logger.info('Please provide your transcript using one of these methods:');
  process.stdout.write(INTAKE_INSTRUCTIONS);
}
