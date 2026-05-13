import { importFromClipboard } from './clipboard-transcript-importer.js';
import { importFromPaste } from './pasted-transcript-importer.js';
import { importFromFile } from './file-transcript-importer.js';
import { importFromYouTubeOwnerOAuth } from './youtube-owner-caption-importer.js';
import { transcribeLocalMedia } from './local-media-transcriber.js';
import type { TranscriptIntakeResult, TranscriptImportMethod } from './transcript.types.js';

export interface IntakeOptions {
  method: TranscriptImportMethod;
  outputFile: string;
  sourceUrl?: string;
  sourceFile?: string;
  minWords?: number;
}

/**
 * Routes a transcript intake request to the correct importer
 * based on the requested method.
 */
export async function runIntake(opts: IntakeOptions): Promise<TranscriptIntakeResult> {
  const { method, outputFile, sourceUrl, sourceFile, minWords } = opts;

  switch (method) {
    case 'clipboard':
      return importFromClipboard(outputFile, sourceUrl, minWords);

    case 'paste':
      return importFromPaste(outputFile, sourceUrl, minWords);

    case 'file': {
      if (!sourceFile) {
        return {
          ok: false,
          method: 'file',
          wordCount: 0,
          warnings: [],
          errors: ['--from <file> is required for the import-file method.'],
          nextCommands: [],
        };
      }
      return importFromFile(sourceFile, outputFile, sourceUrl, minWords);
    }

    case 'youtube-owner-oauth':
      return importFromYouTubeOwnerOAuth(outputFile, sourceUrl);

    case 'local-media-transcription': {
      if (!sourceFile) {
        return {
          ok: false,
          method: 'local-media-transcription',
          wordCount: 0,
          warnings: [],
          errors: ['--file <media-file> is required for the transcribe-file method.'],
          nextCommands: [],
        };
      }
      return transcribeLocalMedia(sourceFile, outputFile);
    }

    default: {
      const _exhaustive: never = method;
      return {
        ok: false,
        method: 'paste',
        wordCount: 0,
        warnings: [],
        errors: [`Unknown intake method: ${_exhaustive}`],
        nextCommands: [],
      };
    }
  }
}
