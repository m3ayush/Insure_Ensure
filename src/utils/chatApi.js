const API_BASE = "/api";

export async function sendChatMessage(firebaseUid, message, conversationHistory) {
  const response = await fetch(`${API_BASE}/chatbot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firebase_uid: firebaseUid,
      message,
      conversationHistory,
    }),
  });

  if (!response.ok) {
    let msg = "Failed to get a response";
    try {
      const err = await response.json();
      msg = err.message || msg;
    } catch {
      if (response.status === 429) msg = "You're sending messages too quickly. Please wait a moment.";
      else if (response.status === 503) msg = "Chatbot is starting up. Please try again shortly.";
      else if (response.status === 403) msg = "Backend server is not running. Start it with: cd server && npm run dev";
      else msg = `Server error (${response.status})`;
    }
    throw new Error(msg);
  }

  return response.json();
}
