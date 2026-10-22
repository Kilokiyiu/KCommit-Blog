/**
 * 黄道十二星座数据与投影
 *（Stellarium 官方连线 · 等距圆柱 + cos(δ) 修正）
 */

import raw from './zodiac-data.json';

export type ZodiacId =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

/** [赤经°, 赤纬°, 视星等, 中文星名] */
export type ZodiacStar = [number, number, number, string];

export interface ZodiacConstellation {
  id: ZodiacId;
  code: string;
  name: string;
  la: string;
  en: string;
  stars: ZodiacStar[];
  lines: [number, number][];
  outline: [number, number][][];
}

export const ZODIAC = raw as ZodiacConstellation[];
export const ZODIAC_IDS = ZODIAC.map((z) => z.id);

export function isZodiacId(value: string): value is ZodiacId {
  return (ZODIAC_IDS as string[]).includes(value);
}

export function getZodiac(id: ZodiacId | string) {
  return ZODIAC.find((z) => z.id === id || z.code === id || z.name === id);
}

export type Pt = [number, number];

/** 等距圆柱投影 + cos(δ) 横向修正；返回 (ra,dec) → [x,y] */
export function makeProjector(
  c: ZodiacConstellation,
  W: number,
  H: number,
  pad: number,
): (ra: number, dec: number) => Pt {
  const pts: Pt[] = c.stars.map((s) => [s[0], s[1]]);
  for (const sub of c.outline) {
    for (const p of sub) pts.push([p[0], p[1]]);
  }

  let dmin = Infinity;
  let dmax = -Infinity;
  for (const p of pts) {
    if (p[1] < dmin) dmin = p[1];
    if (p[1] > dmax) dmax = p[1];
  }
  const k = Math.cos(((dmin + dmax) / 2) * Math.PI / 180);

  const xs = pts.map((p) => -p[0] * k);
  const xmin = Math.min(...xs);
  const xmax = Math.max(...xs);
  const sc = Math.min((W - 2 * pad) / (xmax - xmin || 1), (H - 2 * pad) / (dmax - dmin || 1));
  const ox = (W - (xmax - xmin) * sc) / 2;
  const oy = (H - (dmax - dmin) * sc) / 2;

  return (ra, dec) => [ox + (-ra * k - xmin) * sc, oy + (dmax - dec) * sc];
}

export function starRadius(mag: number) {
  return Math.max(1.35, 5.0 - 0.8 * mag);
}

export interface ProjectedChart {
  id: ZodiacId;
  name: string;
  la: string;
  W: number;
  H: number;
  lines: { x1: number; y1: number; x2: number; y2: number }[];
  stars: {
    i: number;
    x: number;
    y: number;
    r: number;
    mag: number;
    label: string;
  }[];
}

export function projectChart(
  c: ZodiacConstellation,
  W = 800,
  H = 560,
  pad = 48,
): ProjectedChart {
  const proj = makeProjector(c, W, H, pad);
  const lines = c.lines.map(([a, b]) => {
    const p = proj(c.stars[a][0], c.stars[a][1]);
    const q = proj(c.stars[b][0], c.stars[b][1]);
    return { x1: p[0], y1: p[1], x2: q[0], y2: q[1] };
  });
  const stars = c.stars.map((s, i) => {
    const [x, y] = proj(s[0], s[1]);
    return {
      i,
      x,
      y,
      r: starRadius(s[2]),
      mag: s[2],
      label: s[3] || `${c.name} 无名星`,
    };
  });
  return { id: c.id, name: c.name, la: c.la, W, H, lines, stars };
}
