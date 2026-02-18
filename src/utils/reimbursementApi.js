const API_BASE = "/api";

export async function uploadPrimaryDocument(firebaseUid, file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("firebase_uid", firebaseUid);

  const response = await fetch(`${API_BASE}/reimbursement/upload-primary`, {
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

export async function selectInsurer(firebaseUid, sessionId, insurerKey) {
  const response = await fetch(`${API_BASE}/reimbursement/select-insurer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firebase_uid: firebaseUid,
      session_id: sessionId,
      insurer_key: insurerKey,
    }),
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

export async function uploadChecklistDoc(firebaseUid, sessionId, docId, file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("firebase_uid", firebaseUid);
  formData.append("session_id", sessionId);
  formData.append("doc_id", docId);

  const response = await fetch(`${API_BASE}/reimbursement/upload-doc`, {
    method: "POST",
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

export async function fetchAuditHistory(uid) {
  const response = await fetch(`${API_BASE}/reimbursement/history/${uid}`);

  if (!response.ok) {
    throw new Error("Failed to fetch audit history");
  }

  const data = await response.json();
  return data.data || [];
}
