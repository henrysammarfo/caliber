/**
 * GRADELOCK AssemblyScript — telegraph-wasm-check ABI (PARTIAL).
 *
 * Zero host imports (no env.abort). Exports: alloc, dealloc, rank_answer, breakdown_answer.
 * Score = clamp01(1 - Brier(confidence, label)); empty/blank miner_answer → 0.
 */

// @ts-nocheck — AssemblyScript; compiled with `asc`, not tsc.

/** Satisfy AS abort binding so the module does not import env.abort. */
@global
export function abort(
  _message: usize,
  _fileName: usize,
  _line: u32,
  _column: u32,
): void {
  /* no-op — host must not supply env.abort */
}

/** Fixed breakdown buffer: 5×f32 at a low address (before bump heap). */
const BREAKDOWN_PTR: i32 = 1024;
const HEAP_BASE: i32 = 64 * 1024;
let heapOffset: i32 = HEAP_BASE;

export function alloc(size: i32): i32 {
  if (size <= 0) return 0;
  const ptr = heapOffset;
  const aligned = (size + 7) & ~7;
  heapOffset += aligned;
  const pagesNeeded = (heapOffset + 65535) >>> 16;
  const current = memory.size();
  if (pagesNeeded > current) {
    memory.grow(pagesNeeded - current);
  }
  return ptr;
}

export function dealloc(_ptr: i32, _size: i32): void {
  // Bump allocator: no-op free (deterministic, Stage-1 compatible).
}

export function rank_answer(
  _q_ptr: i32,
  _q_len: i32,
  gt_ptr: i32,
  gt_len: i32,
  ma_ptr: i32,
  ma_len: i32,
): f32 {
  if (ma_len <= 0 || isBlankBytes(ma_ptr, ma_len)) {
    writeBreakdown(0.0);
    return 0.0;
  }

  const label = parseLabelBytes(gt_ptr, gt_len);
  const conf = parseConfidenceBytes(ma_ptr, ma_len);

  if (label < 0 || conf < 0.0) {
    writeBreakdown(0.0);
    return 0.0;
  }

  const diff = conf - f32(label);
  const brier = diff * diff;
  let score: f32 = f32(1.0) - brier;
  if (score < f32(0.0)) score = f32(0.0);
  if (score > f32(1.0)) score = f32(1.0);
  writeBreakdown(score);
  return score;
}

export function breakdown_answer(): i32 {
  return BREAKDOWN_PTR;
}

function writeBreakdown(score: f32): void {
  store<f32>(BREAKDOWN_PTR + 0, score);
  store<f32>(BREAKDOWN_PTR + 4, score);
  store<f32>(BREAKDOWN_PTR + 8, score);
  store<f32>(BREAKDOWN_PTR + 12, score);
  store<f32>(BREAKDOWN_PTR + 16, score);
}

function isBlankBytes(ptr: i32, len: i32): bool {
  for (let i: i32 = 0; i < len; i++) {
    const c = load<u8>(ptr + i);
    if (c != 32 && c != 9 && c != 10 && c != 13) return false;
  }
  return true;
}

/** ASCII key match at offset; returns true if bytes[off..) start with key. */
function matchKey(ptr: i32, len: i32, off: i32, key: StaticArray<u8>): bool {
  const klen = key.length;
  if (off + klen > len) return false;
  for (let i: i32 = 0; i < klen; i++) {
    if (load<u8>(ptr + off + i) != unchecked(key[i])) return false;
  }
  return true;
}

/** Index of first key occurrence, or -1. */
function findKey(ptr: i32, len: i32, key: StaticArray<u8>): i32 {
  const klen = key.length;
  if (klen <= 0 || len < klen) return -1;
  const last = len - klen;
  for (let i: i32 = 0; i <= last; i++) {
    if (matchKey(ptr, len, i, key)) return i;
  }
  return -1;
}

function skipWsColon(ptr: i32, len: i32, i: i32): i32 {
  while (i < len) {
    const c = load<u8>(ptr + i);
    if (c == 32 || c == 9 || c == 10 || c == 13 || c == 58) {
      i++;
      continue;
    }
    break;
  }
  return i;
}

/** Returns 0 or 1, or -1 on failure. Prefers "label" JSON key. */
function parseLabelBytes(ptr: i32, len: i32): i32 {
  // "label"
  const key = StaticArray.fromArray<u8>([
    0x22, 0x6c, 0x61, 0x62, 0x65, 0x6c, 0x22,
  ]);
  const idx = findKey(ptr, len, key);
  if (idx < 0) return -1;
  let i = skipWsColon(ptr, len, idx + key.length);
  if (i >= len) return -1;
  const c = load<u8>(ptr + i);
  if (c == 48) return 0; // '0'
  if (c == 49) return 1; // '1'
  if (c == 116) return 1; // true
  if (c == 102) return 0; // false
  return -1;
}

/** Returns confidence in [0,1], or -1 on failure. */
function parseConfidenceBytes(ptr: i32, len: i32): f32 {
  // "confidence"
  const key = StaticArray.fromArray<u8>([
    0x22, 0x63, 0x6f, 0x6e, 0x66, 0x69, 0x64, 0x65, 0x6e, 0x63, 0x65, 0x22,
  ]);
  const idx = findKey(ptr, len, key);
  if (idx < 0) return -1.0;
  let i = skipWsColon(ptr, len, idx + key.length);
  if (i >= len) return -1.0;

  let start = i;
  let sawDot = false;
  while (i < len) {
    const c = load<u8>(ptr + i);
    if (c >= 48 && c <= 57) {
      i++;
      continue;
    }
    if (c == 46 && !sawDot) {
      sawDot = true;
      i++;
      continue;
    }
    break;
  }
  if (i == start) return -1.0;
  return parseF32Bytes(ptr + start, i - start);
}

/** Parse a non-negative decimal float from UTF-8 ASCII digits (optional one '.'). */
function parseF32Bytes(ptr: i32, len: i32): f32 {
  if (len <= 0) return -1.0;
  let intPart: f32 = 0.0;
  let fracPart: f32 = 0.0;
  let fracDiv: f32 = 1.0;
  let inFrac = false;
  let sawDigit = false;

  for (let i: i32 = 0; i < len; i++) {
    const c = load<u8>(ptr + i);
    if (c == 46) {
      if (inFrac) return -1.0;
      inFrac = true;
      continue;
    }
    if (c < 48 || c > 57) return -1.0;
    sawDigit = true;
    const d: f32 = f32(c - 48);
    if (!inFrac) {
      intPart = intPart * f32(10.0) + d;
    } else {
      fracDiv *= f32(10.0);
      fracPart = fracPart + d / fracDiv;
    }
  }
  if (!sawDigit) return -1.0;
  const v = intPart + fracPart;
  if (v < 0.0 || v > 1.0) return -1.0;
  return v;
}
