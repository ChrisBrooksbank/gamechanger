// util.js — pure helpers for escaping, URL safety and CSV round-tripping

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape a string for safe interpolation into innerHTML. */
export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => HTML_ESCAPES[ch]);
}

/**
 * Normalise a user-supplied game URL. Returns '' for anything that isn't
 * http(s) — blocks javascript:, data: etc. Bare domains get https:// added.
 */
export function safeUrl(raw) {
  const s = String(raw ?? '').trim();
  if (!s) return '';
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(withScheme);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : '';
  } catch {
    return '';
  }
}

/** Split one CSV line into fields, honouring double-quoted fields and "" escapes. */
export function splitCsvLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cur += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

/**
 * Parse "name[,url]" lines into [{ name, url }]. Blank lines and lines
 * starting with # are skipped. The last field is only treated as a URL when it
 * looks like one, so unquoted names containing commas (legacy exports) survive.
 */
export function parseGameCsv(text) {
  const out = [];
  String(text).split(/\r?\n/).forEach(raw => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const fields = splitCsvLine(line);
    const last = fields.length > 1 ? fields[fields.length - 1].trim() : '';
    const hasUrl = /[.:/]/.test(last) || last === '';
    const name = ((hasUrl && fields.length > 1 ? fields.slice(0, -1) : fields).join(',')).trim();
    const url = hasUrl ? last : '';
    if (!name) return;
    out.push({ name, url: safeUrl(url) });
  });
  return out;
}

function csvField(s) {
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Serialise games to CSV that parseGameCsv can read back losslessly. */
export function gamesToCsv(games) {
  return games.map(g => g.url ? `${csvField(g.name)},${csvField(g.url)}` : csvField(g.name)).join('\n');
}
