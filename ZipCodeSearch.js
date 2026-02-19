// Season and region mapping based on ZIP code first digit
const zipToRegion = {
  9: { season: 'summer', region: 'West Coast' },
  8: { season: 'summer', region: 'Mountain/Rockies' },
  7: { season: 'summer', region: 'South Central' },
  6: { season: 'fall', region: 'Great Lakes/Ohio Valley' },
  5: { season: 'fall', region: 'Upper Midwest' },
  4: { season: 'fall', region: 'Mid-Atlantic' },
  3: { season: 'spring', region: 'Southeast' },
  2: { season: 'spring', region: 'Mid-Atlantic/DC' },
  1: { season: 'winter', region: 'Northeast' },
  0: { season: 'winter', region: 'Northeast' }
};

// Get season and region from zip code
function getRegionFromZipCode(zipCode) {
  // Validate zip code
  if (!zipCode || zipCode.length < 5) {
    return null;
  }
  
  const firstDigit = parseInt(zipCode.toString()[0]);
  return zipToRegion[firstDigit] || null;
}

// Handle search form submission
function handleZipSearch(event) {
  event.preventDefault();
  
  const zipInput = document.getElementById('zip-search').value;
  const info = getRegionFromZipCode(zipInput);
  
  if (info) {
    console.log(`Season: ${info.season}`);
    console.log(`Region: ${info.region}`);
    // Here you could:
    // - Display the region map image
    // - Filter recipes by season
    // - Show "This is a ${info.season} recipe from the ${info.region} region"
    // - Update the location section with the region map
    // - Make an API call to fetch seasonal recipes
  } else {
    console.log('Invalid zip code');
  }
}