const apiHost = 'https://bakesaleforgood.com';

const fetchJson = async url => {
  try {
    console.log('Fetching data', url);
    const response = await fetch(url);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
};

export default {
  fetchInitialDeals: async () => fetchJson(`${apiHost}/api/deals`),
  fetchDealDetail: async dealId => fetchJson(`${apiHost}/api/deals/${dealId}`),
  fetchDealsSearchResults: async searchTerm =>
    fetchJson(`${apiHost}/api/deals?searchTerm=${searchTerm}`),
};
