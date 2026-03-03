// ============================================================
// appRecipe.js
// Loads a single recipe from AWS proxy using ?id=123
// and fills in the recipe.html placeholders.
// ============================================================




function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setText(sel, text) {
  const el = document.querySelector(sel);
  if (el) el.textContent = text;
}

function setHtml(sel, html) {
  const el = document.querySelector(sel);
  if (el) el.innerHTML = html;
}

function setImg(sel, src, alt) {
  const el = document.querySelector(sel);
  if (el) {
    el.src = src;
    if (alt) el.alt = alt;
  }
}

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return tmp.textContent || tmp.innerText || "";
}

async function loadRecipe() {

    console.log("RECIPE PAGE URL:", window.location.href);
  console.log("RECIPE PAGE SEARCH:", window.location.search);

  const id = qs("id");
  if (!id) return;

  setText("[data-recipe-title]", "Loading recipe...");
  setHtml("[data-recipe-body]", `<p class="text-muted">Loading...</p>`);

  let data;
  try {
    data = await window.fetchRecipeById(id);
  } catch (err) {
    setText("[data-recipe-title]", "Could not load recipe");
    setHtml("[data-recipe-body]", `
      <div class="alert alert-danger">
        <div>${escapeHtml(err.message || String(err))}</div>
      </div>
    `);
    return;
  }

  const title = data.title || "Recipe";
  setText("[data-recipe-title]", title);

  if (data.image) setImg("[data-recipe-image]", data.image, title);

  // Tags (season from session)
  const season = sessionStorage.getItem("season") || "";
  const tagWrap = document.querySelector("[data-tags]");
  if (tagWrap && season) {
    tagWrap.innerHTML = `<span class="tag tag-season ${escapeHtml(season)}">${escapeHtml(season)}</span>`;
  }

  // Ingredients
  const ingredients = (data.extendedIngredients || []).map(i => i.original).filter(Boolean);

  
  const summaryText = stripHtml(data.summary || "");
  const instructionsText = stripHtml(data.instructions || "");

  setHtml("[data-recipe-body]", `
    ${summaryText ? `<p class="lead">${escapeHtml(summaryText)}</p>` : ""}

    ${ingredients.length ? `
      <h2 class="h5 mt-4">Ingredients</h2>
      <ul>
        ${ingredients.map(x => `<li>${escapeHtml(x)}</li>`).join("")}
      </ul>
    ` : ""}

    ${instructionsText ? `
      <h2 class="h5 mt-4">Instructions</h2>
      <p>${escapeHtml(instructionsText)}</p>
    ` : `<p class="text-muted mt-4">No instructions provided by the API for this recipe.</p>`}
  `);
}

document.addEventListener("DOMContentLoaded", loadRecipe);
