// zipregionimages.js
// Relies on zipcodesearch.js — make sure it's loaded first in your HTML

const regionImages = {
  'West Coast': {
    regionImg: 'ZipCodeMapRegions/Zip-Code-Region-9.jpg',
    regionAlt: 'West Coast region',
    storeImg: 'RegionStores/WestCoast-Ralphs-Grocery.jpg',
    storeName: 'Safeway'
  },
  'Mountain/Rockies': {
    regionImg: 'ZipCodeMapRegions/Zip-Code-Region-8.jpg',
    regionAlt: 'Mountain/Rockies region',
    storeImg: 'RegionStores/Rockies-Silverton-Grocery.jpg',
    storeName: 'Albertsons'
  },
  'South Central': {
    regionImg: 'ZipCodeMapRegions/Zip-Code-Region-7.jpg',
    regionAlt: 'South Central region',
    storeImg: 'RegionStores/SouthCentral-CentralMarketHatch-Grocery.jpeg',
    storeName: 'H-E-B'
  },
  'Great Lakes/Ohio Valley': {
    regionImg: 'ZipCodeMapRegions/Zip-Code-Region-4.jpg',
    regionAlt: 'Great Lakes/Ohio Valley region',
    storeImg: 'RegionStores/GreatLakes-Great-Lakes-Grocery.jpg',
    storeName: 'Kroger'
  },
  'Upper Midwest': {
    regionImg: 'ZipCodeMapRegions/Zip-Code-Region-5.jpg',
    regionAlt: 'Upper Midwest region',
    storeImg: 'RegionStores/UpperMidwest-Hyvee-Grocery.jpg',
    storeName: 'Hy-Vee'
  },
  'Mid-Atlantic': {
    regionImg: 'ZipCodeMapRegions/Zip-Code-Region-1.jpg',
    regionAlt: 'Mid-Atlantic region',
    storeImg: 'RegionStores/Midatlantic-FoodLion-Grocery.jpg',
    storeName: 'Giant'
  },
  'Southeast': {
    regionImg: 'ZipCodeMapRegions/Zip-Code-Region-3.jpg',
    regionAlt: 'Southeast region',
    storeImg: 'RegionStores/Southeast-Publix-Grocery.jpg',
    storeName: 'Publix'
  },
  'Mid-Atlantic/DC': {
    regionImg: 'ZipCodeMapRegions/Zip-Code-Region-2.jpg',
    regionAlt: 'Mid-Atlantic/DC region',
    storeImg: 'RegionStores/MidatlanticDC-SaveAlot-Grocery.jpg',
    storeName: 'Harris Teeter'
  },
  'Northeast': {
    regionImg: 'ZipCodeMapRegions/Zip-Code-Region-0.jpg',
    regionAlt: 'Northeast region',
    storeImg: 'RegionStores/Northeast-GiantEagle-Grocery.jpg',
    storeName: 'Stop & Shop'
  }
};

// Call this after getRegionFromZipCode() returns a result
function displayRegionImages(zipCode) {
  const info = getRegionFromZipCode(zipCode); // from ZipCodeSearch.js

  if (!info) {
    console.log('Invalid zip code');
    return;
  }

  const data = regionImages[info.region];

  if (!data) {
    console.log('No image data found for region:', info.region);
    return;
  }

  // Update region image
  const regionImgEl = document.getElementById('region-image');
  if (regionImgEl) {
    regionImgEl.src = data.regionImg;
    regionImgEl.alt = data.regionAlt;
  }

  // Update store image
  const storeImgEl = document.getElementById('store-image');
  if (storeImgEl) {
    storeImgEl.src = data.storeImg;
    storeImgEl.alt = data.storeName;
    storeImgEl.style.display = 'block';
  }

  // Update store name text if element exists
  const storeNameEl = document.getElementById('store-name');
  if (storeNameEl) {
    storeNameEl.textContent = `Find it at: ${data.storeName}`;
  }

  // Update region name text if element exists
  const regionNameEl = document.getElementById('region-name');
  if (regionNameEl) {
    regionNameEl.textContent = `Region: ${info.region}`;
  }
}