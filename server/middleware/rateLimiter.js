const windows = new Map(); // uid -> { count, windowStart }
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20;

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [uid, entry] of windows) {
    if (now - entry.windowStart > WINDOW_MS * 2) windows.delete(uid);
  }
}, 5 * 60_000);

export function chatRateLimiter(req, res, next) {
  const uid = req.body.firebase_uid;
  if (!uid) return next(); // validation middleware will catch this

  const now = Date.now();
  const entry = windows.get(uid);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    windows.set(uid, { count: 1, windowStart: now });
    return next();
  }

  if (entry.count >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: "You're sending messages too quickly. Please wait a moment before trying again.",
    });
  }

  entry.count++;
  next();
}
