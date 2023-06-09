// USED FOR SEEDING THE DATABASE WITH COPY PASTE OF FETCH CALL INTO THE vaHealthFacility then gets applied to the seeder file after looping
import vaHealthFacility from '../data/vaHealthFacility.js';
// import crawler from '../backend/crawler.js';

const formatVAData = vaHealthFacility.map((item) => {
  const long = parseFloat(item.geometry.coordinates[0]);
  const lat = parseFloat(item.geometry.coordinates[1]);

  let formattedData = {
    vaId: item?.properties?.id,
    name: item?.properties?.name,
    state: item?.properties?.address?.physical?.state,
    zip: item?.properties?.address?.physical?.zip,
    city: item?.properties?.address?.physical?.city,
    lat: lat,
    long: long,
    vaWebsite:
      item?.properties?.website === null
        ? 'https://www.va.gov/'
        : `${item?.properties?.website?.split('locations')[0]}programs/whole-health/`,
    scrapedUrlResults: [],
    equineProviderName: '',
    equineProviderPhone: '',
    equineProviderEmail: '',
    equineProviderWebsite: '',
  };
  return formattedData;
});
// console.log('formatVAData', formatVAData);

export default formatVAData;
