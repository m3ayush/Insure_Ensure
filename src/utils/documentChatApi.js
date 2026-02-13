const API_BASE = "/api";

export async function uploadDocument(firebaseUid, file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("firebase_uid", firebaseUid);

  const response = await fetch(`${API_BASE}/document-chat/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let msg = "Failed to process document";
    try {
      const err = await response.json();
      msg = err.message || msg;
    } catch {
      if (response.status === 429) msg = "You're sending requests too quickly. Please wait a moment.";
      else if (response.status === 413) msg = "File is too large. Maximum size is 5MB.";
      else msg = `Server error (${response.status})`;
    }
    throw new Error(msg);
  }

  return response.json();
}

export async function sendDocumentQuestion(firebaseUid, sessionId, message, conversationHistory) {
  const response = await fetch(`${API_BASE}/document-chat/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firebase_uid: firebaseUid,
      sessionId,
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
      else if (response.status === 404) msg = "Document session expired. Please upload your document again.";
      else msg = `Server error (${response.status})`;
    }
    throw new Error(msg);
  }

  return response.json();
}
