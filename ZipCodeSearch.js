// Season mapping based on ZIP code first digit
const zipToSeason = {
  9: 'summer',
  8: 'summer',
  7: 'summer',
  6: 'fall',
  5: 'fall',
  4: 'fall',
  3: 'spring',
  2: 'spring',
  1: 'winter',
  0: 'winter'
};

// Get season from zip code
function getSeasonFromZipCode(zipCode) {
  // Validate zip code
  if (!zipCode || zipCode.length < 5) {
    return null;
  }
  
  const firstDigit = parseInt(zipCode.toString()[0]);
  return zipToSeason[firstDigit] || null;
}

// Example: Handle search form submission
function handleZipSearch(event) {
  event.preventDefault();
  
  const zipInput = document.getElementById('zip-search').value;
  const season = getSeasonFromZipCode(zipInput);
  
  if (season) {
    console.log(`Season: ${season}`);
    // Here you could:
    // - Filter recipes by season
    // - Redirect to seasonal recipe page
    // - Update the UI to show seasonal recipes
    // - Make an API call to fetch seasonal recipes
  } else {
    console.log('Invalid zip code');
  }
}