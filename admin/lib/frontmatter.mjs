/**
 * Minimal YAML frontmatter for our content schemas.
 * Supports string, boolean, number, YYYY-MM-DD date, and string arrays.
 */

export function parseMarkdownFile(raw) {
  const text = raw.replace(/^\uFEFF/, '');
  if (!text.startsWith('---')) {
    return { data: {}, body: text };
  }
  const end = text.indexOf('\n---', 3);
  if (end === -1) {
    return { data: {}, body: text };
  }
  const fm = text.slice(4, end).trim();
  const body = text.slice(end + 4).replace(/^[\r\n]+/, '');
  return { data: parseYamlBlock(fm), body };
}

function parseYamlBlock(fm) {
  /** @type {Record<string, unknown>} */
  const data = {};
  for (const line of fm.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    const [, key, rawVal] = m;
    data[key] = parseScalar(rawVal.trim());
  }
  return data;
}

function parseScalar(raw) {
  if (raw === '') return '';
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  if (raw.startsWith('[') && raw.endsWith(']')) {
    const inner = raw.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((part) => unquote(part.trim()));
  }
  return unquote(raw);
}

function unquote(s) {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

/**
 * @param {Record<string, unknown>} data
 * @param {string} body
 */
export function stringifyMarkdownFile(data, body) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === '') continue;
    if (key === 'draft' && value === false) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    lines.push(`${key}: ${formatScalar(value)}`);
  }
  lines.push('---', '');
  const normalizedBody = body.replace(/\r\n/g, '\n').replace(/\s+$/, '') + '\n';
  return lines.join('\n') + normalizedBody;
}

function formatScalar(value) {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    return `[${value.map((v) => formatString(String(v))).join(', ')}]`;
  }
  return formatString(String(value));
}

function formatString(s) {
  if (/^[A-Za-z0-9_./:@+-]+$/.test(s) && !/^(true|false)$/i.test(s)) {
    return s;
  }
  return JSON.stringify(s);
}

/** Normalize date-ish values to YYYY-MM-DD for forms and files. */
export function toDateInput(value) {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const s = String(value);
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return s;
}
