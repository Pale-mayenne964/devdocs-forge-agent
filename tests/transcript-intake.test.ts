import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFileSync, readFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { importFromFile } from '../src/transcript/file-transcript-importer.js';

const TMP_DIR = join(process.cwd(), 'tmp-test-intake');
const OUT_FILE = join(TMP_DIR, 'output.md');

function tmpFile(name: string, content: string): string {
  const p = join(TMP_DIR, name);
  writeFileSync(p, content, 'utf-8');
  return p;
}

function words(n: number): string {
  return Array(n).fill('word').join(' ');
}

beforeEach(() => {
  mkdirSync(TMP_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TMP_DIR, { recursive: true, force: true });
});

describe('importFromFile', () => {
  it('returns ok=false for unsupported extension', () => {
    const src = tmpFile('transcript.pdf', 'some content');
    const result = importFromFile(src, OUT_FILE);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes('Unsupported file type'))).toBe(true);
  });

  it('returns ok=false for missing file', () => {
    const result = importFromFile(join(TMP_DIR, 'nonexistent.md'), OUT_FILE);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes('Could not read file'))).toBe(true);
  });

  it('returns ok=false for empty file', () => {
    const src = tmpFile('empty.txt', '');
    const result = importFromFile(src, OUT_FILE);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes('empty'))).toBe(true);
  });

  it('returns ok=false for transcript below minimum words', () => {
    const src = tmpFile('short.txt', words(50));
    const result = importFromFile(src, OUT_FILE, undefined, 150);
    expect(result.ok).toBe(false);
    expect(result.wordCount).toBe(50);
    expect(result.errors.some((e) => e.includes('too short'))).toBe(true);
  });

  it('returns ok=true with warning for 150–499 word transcript', () => {
    const src = tmpFile('medium.txt', words(200));
    const result = importFromFile(src, OUT_FILE, undefined, 150);
    expect(result.ok).toBe(true);
    expect(result.wordCount).toBe(200);
    expect(result.warnings.some((w) => w.includes('short'))).toBe(true);
    expect(existsSync(OUT_FILE)).toBe(true);
  });

  it('returns ok=true with no warning for 500+ word transcript', () => {
    const src = tmpFile('long.txt', words(600));
    const result = importFromFile(src, OUT_FILE);
    expect(result.ok).toBe(true);
    expect(result.wordCount).toBe(600);
    expect(result.warnings).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
    expect(existsSync(OUT_FILE)).toBe(true);
  });

  it('writes YAML frontmatter when sourceUrl provided', () => {
    const src = tmpFile('long.md', words(600));
    const url = 'https://youtube.com/watch?v=test123';
    const result = importFromFile(src, OUT_FILE, url);
    expect(result.ok).toBe(true);
    const content = readFileSync(OUT_FILE, 'utf-8');
    expect(content).toContain('source_url:');
    expect(content).toContain(url);
    expect(content).toContain('import_method: file');
  });

  it('strips VTT timestamps for word count', () => {
    const vtt = [
      'WEBVTT',
      '',
      '1',
      '00:00:00.000 --> 00:00:02.000',
      ...Array(200).fill('word'),
    ].join('\n');
    const src = tmpFile('transcript.vtt', vtt);
    const result = importFromFile(src, OUT_FILE);
    // VTT overhead stripped; 200 actual words remain
    expect(result.ok).toBe(true);
    expect(result.wordCount).toBe(200);
  });

  it('includes originalFile in result', () => {
    const src = tmpFile('source.md', words(500));
    const result = importFromFile(src, OUT_FILE);
    expect(result.originalFile).toBe(src);
  });

  it('does not modify the source file', () => {
    const originalContent = words(500);
    const src = tmpFile('original.txt', originalContent);
    importFromFile(src, OUT_FILE);
    expect(readFileSync(src, 'utf-8')).toBe(originalContent);
  });

  it('generates correct nextCommands without URL', () => {
    const src = tmpFile('transcript.md', words(500));
    const result = importFromFile(src, OUT_FILE);
    expect(result.nextCommands[0]).toContain('devdocs-forge-agent generate');
    expect(result.nextCommands[0]).not.toContain('--url');
  });

  it('generates correct nextCommands with URL', () => {
    const src = tmpFile('transcript.md', words(500));
    const url = 'https://youtube.com/watch?v=abc';
    const result = importFromFile(src, OUT_FILE, url);
    expect(result.nextCommands[0]).toContain(`--url "${url}"`);
  });
});
