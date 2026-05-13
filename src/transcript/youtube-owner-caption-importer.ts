import type { TranscriptIntakeResult } from './transcript.types.js';

/**
 * Stub for YouTube owner OAuth caption download.
 * This method requires the video owner to authenticate via OAuth
 * and explicitly grants permission to download their own captions.
 *
 * NOT implemented yet. Shows setup instructions.
 */
export async function importFromYouTubeOwnerOAuth(
  _outputFile: string,
  sourceUrl?: string,
): Promise<TranscriptIntakeResult> {
  const videoNote = sourceUrl ? ` for ${sourceUrl}` : '';

  return {
    ok: false,
    method: 'youtube-owner-oauth',
    wordCount: 0,
    warnings: [],
    errors: [
      `YouTube owner OAuth caption download is not yet implemented${videoNote}.`,
      '',
      'To use this method when available, you will need:',
      '  1. A Google Cloud project with YouTube Data API v3 enabled',
      '  2. OAuth 2.0 credentials (client_id + client_secret)',
      '  3. To be the owner of the YouTube video',
      '',
      'In the meantime, use one of these methods:',
      '  devdocs-forge-agent transcript clipboard --out <file>',
      '  devdocs-forge-agent transcript paste --out <file>',
      '  devdocs-forge-agent transcript import-file --from <file> --out <file>',
    ],
    nextCommands: [],
  };
}
