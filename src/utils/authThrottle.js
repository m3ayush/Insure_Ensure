const buckets = new Map();

function getBucket(scope, key) {
  const id = `${scope}::${key}`;
  let bucket = buckets.get(id);
  if (!bucket) {
    bucket = { fails: [], lockedUntil: 0 };
    buckets.set(id, bucket);
  }
  return bucket;
}

export function checkThrottle({ scope, key, maxAttempts, windowMs }) {
  const bucket = getBucket(scope, key);
  const now = Date.now();
  if (bucket.lockedUntil > now) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.lockedUntil - now) / 1000) };
  }
  bucket.fails = bucket.fails.filter((t) => now - t < windowMs);
  if (bucket.fails.length >= maxAttempts) {
    bucket.lockedUntil = now + windowMs;
    return { allowed: false, retryAfterSec: Math.ceil(windowMs / 1000) };
  }
  return { allowed: true };
}

export function recordFailure({ scope, key }) {
  getBucket(scope, key).fails.push(Date.now());
}

export function clearThrottle({ scope, key }) {
  const id = `${scope}::${key}`;
  buckets.delete(id);
}
