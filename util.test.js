import { describe, it, expect } from 'vitest';
import { escapeHtml, safeUrl, splitCsvLine, parseGameCsv, gamesToCsv } from './util.js';

describe('escapeHtml', () => {
  it('escapes markup characters', () => {
    expect(escapeHtml('<img src=x onerror="alert(1)">&\''))
      .toBe('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&amp;&#39;');
  });
});

describe('safeUrl', () => {
  it('keeps http(s) URLs', () => {
    expect(safeUrl('https://skribbl.io/')).toBe('https://skribbl.io/');
    expect(safeUrl('http://example.com/a?b=1')).toBe('http://example.com/a?b=1');
  });
  it('adds https:// to bare domains', () => {
    expect(safeUrl('skribbl.io')).toBe('https://skribbl.io/');
  });
  it('rejects script and data URLs', () => {
    expect(safeUrl('javascript:alert(1)')).toBe('');
    expect(safeUrl(' JavaScript:alert(1)')).toBe('');
    expect(safeUrl('data:text/html,<b>x</b>')).toBe('');
  });
  it('returns empty string for empty input', () => {
    expect(safeUrl('')).toBe('');
    expect(safeUrl(undefined)).toBe('');
  });
});

describe('CSV', () => {
  it('splits quoted fields', () => {
    expect(splitCsvLine('"a, b","say ""hi"""')).toEqual(['a, b', 'say "hi"']);
  });

  it('parses names, urls, comments and blank lines', () => {
    const text = '# comment\r\nWordle,https://wordle.com\r\n\r\nCharades\n';
    expect(parseGameCsv(text)).toEqual([
      { name: 'Wordle', url: 'https://wordle.com/' },
      { name: 'Charades', url: '' },
    ]);
  });

  it('keeps unquoted commas in names when no URL follows', () => {
    expect(parseGameCsv('Rock, Paper, Scissors')).toEqual([{ name: 'Rock, Paper, Scissors', url: '' }]);
  });

  it('drops unsafe URLs on import', () => {
    expect(parseGameCsv('Evil,javascript:alert(1)')).toEqual([{ name: 'Evil', url: '' }]);
  });

  it('round-trips names with commas and quotes', () => {
    const games = [
      { name: 'Rock, Paper, Scissors', url: 'https://rps.example/' },
      { name: 'The "Best" Game', url: '' },
      { name: 'Plain', url: 'https://plain.example/' },
    ];
    expect(parseGameCsv(gamesToCsv(games))).toEqual(games);
  });
});
