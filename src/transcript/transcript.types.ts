export type TranscriptImportMethod =
  | 'paste'
  | 'clipboard'
  | 'file'
  | 'youtube-owner-oauth'
  | 'local-media-transcription';

export interface TranscriptIntakeRequest {
  url?: string;
  method: TranscriptImportMethod;
  sourceFile?: string;
  outputFile: string;
  preserveOriginal?: boolean;
}

export interface TranscriptIntakeResult {
  ok: boolean;
  method: TranscriptImportMethod;
  outputFile?: string;
  originalFile?: string;
  wordCount: number;
  warnings: string[];
  errors: string[];
  nextCommands: string[];
}

export interface TranscriptValidationResult {
  exists: boolean;
  empty: boolean;
  wordCount: number;
  isLongEnough: boolean;
  warnings: string[];
  errors: string[];
}
