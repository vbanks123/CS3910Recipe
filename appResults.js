// ============================================================
// appResults.js
// Loads results using ZIP/season/region saved in sessionStorage,
// calls AWS proxy, filters recipes, and renders recipe cards.
// ============================================================

function readSessionJSON(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function mapAllergiesToSpoonacularIntolerances(allergies) {
  const map = {
    dairy: "dairy",
    gluten: "gluten",
    treeNuts: "tree nut",
    soy: "soy",
  };
  const out = [];
  for (const a of allergies || []) if (map[a]) out.push(map[a]);
  return out.join(",");
}

function seasonToQuery(season) {
  const q = {
    winter: "winter soup",
    spring: "spring salad",
    summer: "summer grill",
    fall: "fall stew",
  };
  return q[season] || "seasonal recipe";
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderCount(n) {
  const el = document.querySelector("[data-recipe-count]");
  if (el) el.textContent = `Showing ${n} recipes`;
}

function renderLocationLine(region, season) {
  const el = document.querySelector("[data-location-line]");
  if (el) el.textContent = `Region: ${region} • Season: ${season}`;
}

function seasonClass(season) {
  return ["spring", "summer", "fall", "winter"].includes(season) ? season : "winter";
}

function getRecipeId(r) {
  
  return r?.id ?? r?.recipeId ?? r?.recipe_id ?? r?.sourceId ?? null;
}

function buildCard(recipe, season) {
  const title = escapeHtml(recipe.title || recipe.name || "Recipe");
  const img = recipe.image || "South-Pole.png";
  const id = getRecipeId(recipe);

  const buttonHtml = id
    ? `<button type="button" class="btn btn-dark js-view-recipe" data-id="${String(id)}">View Recipe</button>`
    : `<button type="button" class="btn btn-secondary" disabled title="Missing recipe id">No details</button>`;

  return `
    <div class="recipe-card p-4 mb-4" data-recipe-id="${id ? String(id) : ""}">
      <div class="row align-items-center g-4">
        <div class="col-12 col-md-7">
          <h2 class="h4">${title}</h2>

          <div class="d-flex gap-2 flex-wrap my-3">
            <span class="tag tag-season ${seasonClass(season)}">${escapeHtml(season)}</span>
          </div>

          ${buttonHtml}
        </div>

        <div class="col-12 col-md-5">
          <img class="recipe-map" src="${escapeHtml(img)}" alt="${title}" />
        </div>
      </div>
    </div>
  `;
}

function attachCardClicks(container) {
  // Event delegation: one handler for all cards
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-view-recipe");
    if (!btn) return;

    const idFromBtn = btn.getAttribute("data-id");
    const card = btn.closest(".recipe-card");
    const idFromCard = card?.getAttribute("data-recipe-id");

    const id = idFromBtn || idFromCard;
    if (!id || id === "undefined" || id === "null") {
      alert("That recipe has no valid id, so the details page can’t load.");
      return;
    }

    window.location.href = `./recipe.html?id=${encodeURIComponent(id)}`;
  });
}

async function loadResults() {
  const zip = sessionStorage.getItem("zip") || "";
  const season = sessionStorage.getItem("season") || "";
  const region = sessionStorage.getItem("region") || "";
  const allergies = readSessionJSON("allergies", []);

  if (zip && typeof displayRegionImages === "function") displayRegionImages(zip);

  renderLocationLine(region, season);

  const intolerances = mapAllergiesToSpoonacularIntolerances(allergies);
  const query = seasonToQuery(season);

  const container = document.querySelector("[data-results]");
  if (!container) return;

  container.innerHTML = `<p class="text-muted">Loading recipes...</p>`;

  let data;
  try {
    data = await window.fetchRecipes({ query, intolerances, number: 12 });
  } catch (err) {
    container.innerHTML = `
      <div class="alert alert-danger">
        <div><strong>Could not load recipes.</strong></div>
        <div>${escapeHtml(err?.message || String(err))}</div>
        <div class="mt-2 small">Check awsConfig.js and make sure your AWS endpoint is correct.</div>
      </div>
    `;
    renderCount(0);
    return;
  }

  const recipes = Array.isArray(data?.results) ? data.results : [];

  let safeRecipes = recipes;
  if (window.scanForAllergens && allergies.length) {
    safeRecipes = [];
    for (const r of recipes) {
      const pageText = `${r?.title || ""} ${r?.summary || ""}`;
      const scan = window.scanForAllergens(pageText, allergies);
      if (scan.safe) safeRecipes.push(r);
    }
  }

  renderCount(safeRecipes.length);

  if (safeRecipes.length === 0) {
    container.innerHTML = `<p class="text-muted">No recipes found for your filters.</p>`;
    return;
  }

  container.innerHTML = safeRecipes.map((r) => buildCard(r, season)).join("");

  attachCardClicks(container);
}

function attachResultsSearch() {
  const form = document.querySelector("form.search-wrap");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input[type='text'], input[type='search']");
    const zip = (input?.value || "").trim();
    const loc = window.getRegionFromZipCode?.(zip);

    if (!loc) {
      alert("Please enter a valid 5-digit ZIP code.");
      return;
    }

    sessionStorage.setItem("zip", zip);
    sessionStorage.setItem("season", loc.season);
    sessionStorage.setItem("region", loc.region);

    loadResults();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  attachResultsSearch();
  loadResults();
});