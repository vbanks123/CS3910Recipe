// ============================================================
// AllergyFilter.js
// Depends on: ZipCodeSearch.js (getRegionFromZipCode,
//             fetchRecipesByLocation)
//
// This file receives recipes from ZipCodeSearch.js and filters
// them based on the user's selected allergy categories.
// It no longer fetches recipes itself — that is handled by
// handleZipSearch() in ZipCodeSearch.js, which then passes
// the results here.
// ============================================================

// ------------------------------------------------------------
// ALLERGY KEYWORD LISTS
// Each key matches a selectable allergy category.
// Add or remove keywords here as needed.
// ------------------------------------------------------------
const allergyKeywords = {
  dairy: [
    'milk', 'butter', 'cream', 'cheese', 'yogurt', 'whey', 'casein',
    'lactose', 'ghee', 'custard', 'half-and-half', 'sour cream',
    'ice cream', 'buttermilk', 'parmesan', 'mozzarella', 'cheddar',
    'brie', 'ricotta', 'mascarpone', 'kefir', 'paneer'
  ],
  gluten: [
    'wheat', 'flour', 'bread', 'barley', 'rye', 'oats', 'pasta',
    'semolina', 'spelt', 'farro', 'bulgur', 'couscous', 'malt',
    'breadcrumbs', 'croutons', 'soy sauce', 'seitan', 'triticale',
    'durum', 'noodles', 'tortilla', 'pita', 'panko'
  ],
  treeNuts: [
    'almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'hazelnut',
    'macadamia', 'brazil nut', 'pine nut', 'chestnut', 'coconut',
    'praline', 'marzipan', 'nougat', 'nut butter', 'almond flour',
    'almond milk', 'coconut milk', 'coconut cream', 'coconut oil'
  ],
  soy: [
    'soy', 'soybean', 'tofu', 'tempeh', 'miso', 'edamame',
    'soy sauce', 'tamari', 'soy milk', 'soy protein', 'natto',
    'textured vegetable protein', 'tvp', 'soya', 'shoyu'
  ]
};

// ------------------------------------------------------------
// SCAN RECIPE TEXT FOR ALLERGENS
// Checks a recipe's text content against the selected allergy
// keyword lists and returns whether it's safe + what triggered.
//
// @param {string}   text              - Raw text from the recipe page
// @param {string[]} selectedAllergies - e.g. ['dairy', 'gluten']
// @returns {{ safe: boolean, triggered: Object }}
//   triggered maps each allergy to the keywords found, e.g.:
//   { dairy: ['butter', 'cream'], gluten: ['pasta'] }
// ------------------------------------------------------------
function scanForAllergens(text, selectedAllergies) {
  const lowerText = text.toLowerCase();
  const triggered = {};

  for (const allergy of selectedAllergies) {
    const keywords = allergyKeywords[allergy] || [];

    // Find any keywords from this allergy category present in the text
    const found = keywords.filter(kw => lowerText.includes(kw.toLowerCase()));

    // Only record this allergy if at least one keyword was matched
    if (found.length > 0) {
      triggered[allergy] = found;
    }
  }

  return {
    safe: Object.keys(triggered).length === 0, // safe if nothing was triggered
    triggered
  };
}

// ------------------------------------------------------------
// MAIN FILTER FUNCTION
// Receives recipes and location data directly from
// ZipCodeSearch.js (via handleZipSearch) rather than fetching
// them itself. Filters out any recipes containing allergens
// from the user's selected allergy categories.
//
// @param {Object[]} recipes          - Recipe array from apiResponse.recipes
// @param {Object}   apiLocation      - Location from apiResponse.location
//                                      e.g. { region: string, season: string }
// @param {string[]} selectedAllergies - Allergies to filter for
// @returns {Object[]}                - Array of safe recipes
// ------------------------------------------------------------
function filterRecipesByAllergens(recipes, apiLocation, selectedAllergies) {

  console.log(`Filtering recipes for: ${apiLocation.region} (${apiLocation.season})`);

  const safeRecipes = [];

  for (const recipe of recipes) {

    // Skip recipes that don't match the API-provided region or season
    if (
      recipe.region !== apiLocation.region &&
      recipe.season !== apiLocation.season
    ) {
      continue;
    }

    // Scan the recipe's text for allergy keywords
    const { safe, triggered } = scanForAllergens(recipe.pageText, selectedAllergies);

    if (safe) {
      // No allergens found — include this recipe in the results
      safeRecipes.push(recipe);
    } else {
      // Log which allergens caused this recipe to be excluded
      console.log(
        `"${recipe.name}" excluded — contains: `,
        Object.entries(triggered)
          .map(([allergy, kws]) => `${allergy} (${kws.join(', ')})`)
          .join(' | ')
      );
    }
  }

  return safeRecipes;
}

// ------------------------------------------------------------
// EXAMPLE USAGE
// In production, handleZipSearch() in ZipCodeSearch.js will
// call this function automatically after fetching recipes.
// The call will look like this:
//
//   const safeRecipes = filterRecipesByAllergens(
//     apiResponse.recipes,
//     apiResponse.location,
//     userSelectedAllergies
//   );
//
// For now, here is a manual example using mock data:
// ------------------------------------------------------------
const mockApiResponse = {
  location: { region: 'Northeast', season: 'winter' },
  recipes: [
    {
      name: 'Creamy Mushroom Pasta',
      region: 'Northeast',
      season: 'winter',
      pageText: 'Ingredients: pasta, butter, cream, mushrooms, garlic, parmesan cheese.'
    },
    {
      name: 'Winter Veggie Stew',
      region: 'Northeast',
      season: 'winter',
      pageText: 'Ingredients: potatoes, carrots, celery, vegetable broth, olive oil, thyme.'
    },
    {
      name: 'Avocado Toast',
      region: 'West Coast',
      season: 'summer',
      pageText: 'Ingredients: sourdough bread, avocado, lemon juice, olive oil, chili flakes.'
    }
  ]
};

const userAllergies = ['dairy', 'gluten'];

const results = filterRecipesByAllergens(
  mockApiResponse.recipes,
  mockApiResponse.location,
  userAllergies
);

console.log('Safe recipes:', results.map(r => r.name));
// Expected output: ["Winter Veggie Stew"]
// "Creamy Mushroom Pasta" excluded — dairy (butter, cream, parmesan cheese)
// "Avocado Toast" skipped — wrong region