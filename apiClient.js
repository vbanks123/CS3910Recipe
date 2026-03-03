// ============================================================
// apiClient.js
// Thin client for YOUR AWS proxy (not Spoonacular directly)
// Routes expected:
//   GET {BASE}/search?query=...&intolerances=comma,separated
//   GET {BASE}/recipe/{id}
// ============================================================

function assertAwsConfigured() {
  const base = window.AWS_API_BASE_URL;
  if (!base || base.includes("PASTE_YOUR_AWS_ENDPOINT_HERE")) {
    throw new Error(
      "AWS_API_BASE_URL is not set. Open awsConfig.js and paste your AWS endpoint."
    );
  }
  return base.replace(/\/$/, "");
}

async function apiGet(path, params = null) {
  const base = assertAwsConfigured();

  let url = base + path;
  if (params) {
    const qs = new URLSearchParams(params);
    url += "?" + qs.toString();
  }

  const res = await fetch(url, { method: "GET" });
  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    throw new Error("API returned non-JSON response");
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) ? (data.message || data.error) : ("HTTP " + res.status);
    throw new Error(msg);
  }

  return data;
}

// Public helpers
window.fetchRecipes = async function ({ query, intolerances, number = 12 }) {
  const params = { number: String(number) };
  if (query) params.query = query;
  if (intolerances) params.intolerances = intolerances; 
  return await apiGet("/search", params);
};

window.fetchRecipeById = async function (id) {
  return await apiGet(`/recipe/${encodeURIComponent(id)}`);
};
