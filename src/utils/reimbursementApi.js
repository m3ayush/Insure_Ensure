const API_BASE = "/api";

export async function uploadPrimaryDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/reimbursement/upload-primary`, {
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

export async function selectInsurer(sessionId, insurerKey) {
  const response = await fetch(`${API_BASE}/reimbursement/select-insurer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ session_id: sessionId, insurer_key: insurerKey }),
  });

  if (!response.ok) {
    let msg = "Failed to select insurer";
    try {
      const err = await response.json();
      msg = err.message || msg;
    } catch {
      msg = `Server error (${response.status})`;
    }
    throw new Error(msg);
  }

  return response.json();
}

export async function uploadChecklistDoc(sessionId, docId, file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("session_id", sessionId);
  formData.append("doc_id", docId);

  const response = await fetch(`${API_BASE}/reimbursement/upload-doc`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    let msg = "Failed to upload document";
    try {
      const err = await response.json();
      msg = err.message || msg;
    } catch {
      if (response.status === 429) msg = "You're sending requests too quickly. Please wait a moment.";
      else if (response.status === 404) msg = "Session expired. Please start a new audit.";
      else msg = `Server error (${response.status})`;
    }
    throw new Error(msg);
  }

  return response.json();
}

export async function fetchAuditHistory() {
  const response = await fetch(`${API_BASE}/reimbursement/history`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch audit history");
  }

  const data = await response.json();
  return data.data || [];
}
