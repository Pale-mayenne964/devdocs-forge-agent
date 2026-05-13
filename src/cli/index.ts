#!/usr/bin/env node
import { createRequire } from 'node:module';
import { Command } from 'commander';
import dotenv from 'dotenv';

// Load .env before anything else
dotenv.config();

import { handleError } from '../utils/errors.js';
import { initCommand } from './commands/init.command.js';
import { doctorCommand } from './commands/doctor.command.js';
import { providersCommand } from './commands/providers.command.js';
import { examplesCommand } from './commands/examples.command.js';
import { generateCommand } from './commands/generate.command.js';
import { batchCommand } from './commands/batch.command.js';
import { verifyCommand } from './commands/verify.command.js';
import { inspectUrlCommand } from './commands/inspect-url.command.js';
import { validateSourceCommand } from './commands/validate-source.command.js';
import {
  transcriptPasteCommand,
  transcriptClipboardCommand,
  transcriptImportFileCommand,
  transcriptYouTubeOwnerCommand,
  transcriptTranscribeFileCommand,
} from './commands/transcript.command.js';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json') as { version: string; description: string };

const program = new Command();

program
  .name('devdocs-forge-agent')
  .description(pkg.description)
  .version(pkg.version);

program
  .command('init')
  .description('Initialize config, input/, output/, and user customization files')
  .action(() => initCommand().catch(handleError));

program
  .command('doctor')
  .description('Check your setup: Node version, config, provider, API keys, directories')
  .action(() => doctorCommand().catch(handleError));

program
  .command('providers')
  .description('List available AI providers and show the currently selected one')
  .action(() => providersCommand().catch(handleError));

program
  .command('examples')
  .description('Copy example transcripts from examples/ into your input/ directory')
  .action(() => examplesCommand().catch(handleError));

program
  .command('inspect-url')
  .description('Inspect and classify a video URL (no transcript scraping)')
  .argument('<url>', 'Video URL to inspect (YouTube or Vimeo)')
  .action((url: string) => inspectUrlCommand({ url }).catch(handleError));

const transcript = program
  .command('transcript')
  .description('Import a transcript into the input directory using a safe local method');

transcript
  .command('paste')
  .description('Paste transcript from stdin (end with :::end on a new line)')
  .option('--url <url>', 'Source video URL for attribution')
  .requiredOption('--out <path>', 'Output file path', 'input/transcript.md')
  .action((opts: { url?: string; out: string }) =>
    transcriptPasteCommand(opts).catch(handleError),
  );

transcript
  .command('clipboard')
  .description('Import transcript from system clipboard')
  .option('--url <url>', 'Source video URL for attribution')
  .requiredOption('--out <path>', 'Output file path', 'input/transcript.md')
  .action((opts: { url?: string; out: string }) =>
    transcriptClipboardCommand(opts).catch(handleError),
  );

transcript
  .command('import-file')
  .description('Import transcript from a local file (.md, .txt, .vtt, .srt)')
  .requiredOption('--from <path>', 'Source transcript file to import')
  .option('--url <url>', 'Source video URL for attribution')
  .requiredOption('--out <path>', 'Output file path', 'input/transcript.md')
  .action((opts: { from: string; url?: string; out: string }) =>
    transcriptImportFileCommand(opts).catch(handleError),
  );

transcript
  .command('youtube-owner')
  .description('Download captions via YouTube owner OAuth (requires video ownership)')
  .requiredOption('--url <url>', 'YouTube video URL (must be your own video)')
  .requiredOption('--out <path>', 'Output file path', 'input/transcript.md')
  .action((opts: { url: string; out: string }) =>
    transcriptYouTubeOwnerCommand(opts).catch(handleError),
  );

transcript
  .command('transcribe-file')
  .description('Transcribe a local audio/video file (mp3, mp4, wav, etc.)')
  .requiredOption('--file <path>', 'Local media file to transcribe')
  .requiredOption('--out <path>', 'Output file path', 'input/transcript.md')
  .action((opts: { file: string; out: string }) =>
    transcriptTranscribeFileCommand(opts).catch(handleError),
  );

program
  .command('validate-source')
  .description('Validate a video URL + local transcript file before generation')
  .requiredOption('--url <url>', 'Video URL to validate')
  .option('--file <path>', 'Local transcript file to validate')
  .action((opts: { url: string; file?: string }) =>
    validateSourceCommand(opts).catch(handleError),
  );

program
  .command('generate')
  .description('Generate documentation from a transcript file')
  .option('--file <path>', 'Path to the input transcript file')
  .option('--url <url>', 'Source video URL (requires --file for transcript — no scraping)')
  .option('--type <type>', 'Output type: blog, docs, docusaurus, gitbook, readme, faq, troubleshooting, lesson, social, changelog, seo')
  .option('--source-url <url>', 'Source URL to attribute (use --url instead when validating a video)')
  .option('--force', 'Bypass low-confidence tech video classification (use only if you own the content)')
  .action((opts: { file?: string; url?: string; type?: string; sourceUrl?: string; force?: boolean }) =>
    generateCommand(opts).catch(handleError),
  );

program
  .command('batch')
  .description('Process all .md and .txt files in a directory')
  .requiredOption('--dir <path>', 'Directory containing transcript files')
  .option('--type <type>', 'Output type for all files in the batch')
  .action((opts: { dir: string; type?: string }) =>
    batchCommand(opts).catch(handleError),
  );

program
  .command('verify')
  .description('Validate generated documentation in the output/ directory')
  .option('--dir <path>', 'Specific output subdirectory to verify')
  .action((opts: { dir?: string }) => verifyCommand(opts).catch(handleError));

program.parse(process.argv);
