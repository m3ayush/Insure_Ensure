const API_BASE = "/api";

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/document-chat/upload`, {
    method: "POST",
    credentials: "include",
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

export async function sendDocumentQuestion(sessionId, message, conversationHistory) {
  const response = await fetch(`${API_BASE}/document-chat/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ sessionId, message, conversationHistory }),
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
