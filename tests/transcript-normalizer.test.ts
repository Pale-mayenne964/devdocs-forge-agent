import { describe, it, expect } from 'vitest';
import { normalizeTranscript, countWords } from '../src/transcript/transcript-normalizer.js';

describe('normalizeTranscript', () => {
  it('returns plain text unchanged (minus trailing whitespace)', () => {
    const input = 'Hello world.\nThis is a transcript.';
    expect(normalizeTranscript(input, '.txt')).toBe(input);
  });

  it('strips WEBVTT header', () => {
    const input = 'WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nHello world.';
    const result = normalizeTranscript(input, '.vtt');
    expect(result).not.toContain('WEBVTT');
    expect(result).toContain('Hello world.');
  });

  it('strips VTT timestamps', () => {
    const vtt = [
      'WEBVTT',
      '',
      '1',
      '00:00:00.000 --> 00:00:02.000',
      'First line.',
      '',
      '2',
      '00:00:02.000 --> 00:00:04.500',
      'Second line.',
    ].join('\n');
    const result = normalizeTranscript(vtt, '.vtt');
    expect(result).not.toMatch(/\d{2}:\d{2}:\d{2}/);
    expect(result).toContain('First line.');
    expect(result).toContain('Second line.');
  });

  it('strips SRT sequence numbers and timestamps', () => {
    const srt = [
      '1',
      '00:00:00,000 --> 00:00:02,000',
      'Hello from SRT.',
      '',
      '2',
      '00:00:02,500 --> 00:00:04,000',
      'Another line.',
    ].join('\n');
    const result = normalizeTranscript(srt, '.srt');
    expect(result).not.toMatch(/\d{2}:\d{2}:\d{2},\d{3}/);
    expect(result).toContain('Hello from SRT.');
    expect(result).toContain('Another line.');
  });

  it('collapses 3+ blank lines into a single blank line', () => {
    const input = 'Line one.\n\n\n\nLine two.';
    const result = normalizeTranscript(input, '.txt');
    expect(result).not.toMatch(/\n{3,}/);
    expect(result).toContain('Line one.');
    expect(result).toContain('Line two.');
  });

  it('trims leading and trailing whitespace', () => {
    const input = '  \n\nHello world.\n\n  ';
    const result = normalizeTranscript(input, '.txt');
    expect(result).toBe('Hello world.');
  });

  it('preserves speaker labels in plain text', () => {
    const input = 'Speaker A: Hello.\nSpeaker B: World.';
    const result = normalizeTranscript(input, '.txt');
    expect(result).toContain('Speaker A: Hello.');
    expect(result).toContain('Speaker B: World.');
  });

  it('treats unknown extension as plain text', () => {
    const input = '00:00:01,000 --> 00:00:02,000\nThis is NOT stripped.';
    const result = normalizeTranscript(input, '.md');
    // Unknown extension: no stripping, just whitespace normalization
    expect(result).toContain('00:00:01,000 --> 00:00:02,000');
  });
});

describe('countWords', () => {
  it('counts words in plain text', () => {
    expect(countWords('Hello world')).toBe(2);
  });

  it('handles multiple spaces and newlines', () => {
    expect(countWords('  hello   world\n  foo  ')).toBe(3);
  });

  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });

  it('returns 0 for whitespace-only string', () => {
    expect(countWords('   \n  \t  ')).toBe(0);
  });

  it('counts a 150-word transcript as 150', () => {
    const words = Array(150).fill('word').join(' ');
    expect(countWords(words)).toBe(150);
  });
});
