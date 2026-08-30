/**
 * GRADELOCK AssemblyScript source — community telegraph-wasm-check ABI (PARTIAL).
 *
 * Exports: alloc, dealloc, rank_answer, breakdown_answer
 * Score = clamp01(1 - Brier(confidence, label)); empty answer → 0
 */

// @ts-nocheck — AssemblyScript; compiled with `asc`, not tsc.

const HEAP_BASE: i32 = 64 * 1024;
let heapOffset: i32 = HEAP_BASE;

const breakdownBuf = new Float32Array(5);

export function alloc(size: i32): i32 {
  if (size <= 0) return 0;
  const ptr = heapOffset;
  const aligned = (size + 7) & ~7;
  heapOffset += aligned;
  // Grow memory if needed (64KiB pages)
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
  if (ma_len <= 0) {
    writeBreakdown(0.0);
    return 0.0;
  }

  const answer = utf8(ma_ptr, ma_len);
  if (isBlank(answer)) {
    writeBreakdown(0.0);
    return 0.0;
  }

  const gt = utf8(gt_ptr, gt_len);
  const label = parseLabel(gt);
  const conf = parseConfidence(answer);

  if (label < 0 || conf < 0.0) {
    writeBreakdown(0.0);
    return 0.0;
  }

  const brier = (conf - f32(label)) * (conf - f32(label));
  let score: f32 = f32(1.0) - brier;
  if (score < f32(0.0)) score = f32(0.0);
  if (score > f32(1.0)) score = f32(1.0);
  writeBreakdown(score);
  return score;
}

export function breakdown_answer(): i32 {
  return changetype<i32>(breakdownBuf.dataStart);
}

function writeBreakdown(score: f32): void {
  breakdownBuf[0] = score;
  breakdownBuf[1] = score;
  breakdownBuf[2] = score;
  breakdownBuf[3] = score;
  breakdownBuf[4] = score;
}

function utf8(ptr: i32, len: i32): string {
  return String.UTF8.decodeUnsafe(ptr, len, true);
}

function isBlank(s: string): bool {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c != 32 && c != 9 && c != 10 && c != 13) return false;
  }
  return true;
}

/** Returns 0 or 1, or -1 on failure. */
function parseLabel(gt: string): i32 {
  // Prefer "label": <n>
  const key = '"label"';
  const idx = gt.indexOf(key);
  if (idx < 0) return -1;
  let i = idx + key.length;
  while (i < gt.length) {
    const c = gt.charCodeAt(i);
    if (c == 32 || c == 9 || c == 10 || c == 13 || c == 58) {
      i++;
      continue;
    }
    if (c == 48) return 0; // '0'
    if (c == 49) return 1; // '1'
    if (c == 116) return 1; // true
    if (c == 102) return 0; // false
    break;
  }
  return -1;
}

/** Returns confidence in [0,1], or -1 on failure. */
function parseConfidence(answer: string): f32 {
  const key = '"confidence"';
  const idx = answer.indexOf(key);
  if (idx < 0) return -1.0;
  let i = idx + key.length;
  while (i < answer.length) {
    const c = answer.charCodeAt(i);
    if (c == 32 || c == 9 || c == 10 || c == 13 || c == 58) {
      i++;
      continue;
    }
    break;
  }
  let start = i;
  let sawDot = false;
  while (i < answer.length) {
    const c = answer.charCodeAt(i);
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
  const numStr = answer.substring(start, i);
  const v = F32.parseFloat(numStr);
  if (isNaN(v) || v < 0.0 || v > 1.0) return -1.0;
  return v;
}
