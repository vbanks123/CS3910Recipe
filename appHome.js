// ============================================================
// appHome.js
// Handles the Home page search and sends the user to result.html
// ============================================================

function getSelectedAllergiesFromHome() {
  const selected = [];
  // IDs in home.html: dairy, gluten, nuts, soy
  if (document.getElementById("dairy")?.checked) selected.push("dairy");
  if (document.getElementById("gluten")?.checked) selected.push("gluten");
  if (document.getElementById("nuts")?.checked) selected.push("treeNuts");
  if (document.getElementById("soy")?.checked) selected.push("soy");
  return selected;
}

function getZipFromForm(form) {
  const input = form.querySelector("input[type='text'], input[type='search']");
  return (input?.value || "").trim();
}

function attachHomeHandlers() {
  const form = document.querySelector("form.search-wrap");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const zip = getZipFromForm(form);
    const loc = window.getRegionFromZipCode?.(zip);

    if (!loc) {
      alert("Please enter a valid 5-digit ZIP code.");
      return;
    }

    const allergies = getSelectedAllergiesFromHome();

    // Save user choices for results page
    sessionStorage.setItem("zip", zip);
    sessionStorage.setItem("season", loc.season);
    sessionStorage.setItem("region", loc.region);
    sessionStorage.setItem("allergies", JSON.stringify(allergies));

    // Go to results
    window.location.href = "result.html";
  });
}

document.addEventListener("DOMContentLoaded", attachHomeHandlers);
