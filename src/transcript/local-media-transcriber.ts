import type { TranscriptIntakeResult } from './transcript.types.js';

const SUPPORTED_EXTENSIONS = ['.mp3', '.mp4', '.m4a', '.wav', '.ogg', '.webm'];

/**
 * Stub for local media transcription.
 * Transcribes audio/video files using a local or remote AI model.
 *
 * NOT implemented yet. Shows setup instructions.
 */
export async function transcribeLocalMedia(
  mediaFile: string,
  _outputFile: string,
): Promise<TranscriptIntakeResult> {
  const ext = mediaFile.split('.').pop()?.toLowerCase() ?? '';

  if (!SUPPORTED_EXTENSIONS.includes(`.${ext}`)) {
    return {
      ok: false,
      method: 'local-media-transcription',
      wordCount: 0,
      warnings: [],
      errors: [
        `Unsupported media format: .${ext}`,
        `Supported formats: ${SUPPORTED_EXTENSIONS.join(', ')}`,
      ],
      nextCommands: [],
    };
  }

  return {
    ok: false,
    method: 'local-media-transcription',
    wordCount: 0,
    warnings: [],
    errors: [
      `Local media transcription is not yet implemented for: ${mediaFile}`,
      '',
      'Planned: whisper.cpp or OpenAI Whisper API integration.',
      '',
      'In the meantime, transcribe your media manually and use:',
      '  devdocs-forge-agent transcript clipboard --out <file>',
      '  devdocs-forge-agent transcript paste --out <file>',
      '  devdocs-forge-agent transcript import-file --from <transcript.txt> --out <file>',
    ],
    nextCommands: [],
  };
}
