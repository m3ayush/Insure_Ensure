const API_BASE = "/api";

export async function fetchRecommendationHistory(uid) {
  const response = await fetch(`${API_BASE}/recommendations/${uid}`);
  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }
  const data = await response.json();
  return data.data || [];
}

export async function submitRecommendation(payload) {
  const response = await fetch(`${API_BASE}/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let message = "Submission failed";
    try {
      const err = await response.json();
      message = err.message || message;
    } catch {
      message = response.status === 403
        ? "Backend server is not running. Start it with: cd server && npm run dev"
        : `Server error (${response.status})`;
    }
    throw new Error(message);
  }
  return response.json();
}
