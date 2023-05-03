'use strict';

const pbdSearch = 'https://search.rcsb.org/rcsbsearch/v1/query?json=';
const modelServer = 'https://models.rcsb.org/v1/';
const pdbEntryService = 'https://data.rcsb.org/rest/v1/core/entry/';

const httpClient = (url, requestOption) => {
  return fetch(url, requestOption);
};

const pbdSearchService = () => {
  const pbdSearchAbortController = new AbortController();
  return (searchValue) => {
    const encodedSearchValue = encodeURI(JSON.stringify(searchValue));
    pbdSearchAbortController.abort();
    const signal = pbdSearchAbortController.signal;
    const url = pbdSearch + encodedSearchValue;

    return new Promise((resolve, reject) => {
      httpClient(url, {signal})
        .then((response) => {
          const contentType = response.headers.get('content-type');
          if (response.ok && contentType && contentType.includes('application/json')) {
            resolve(response.json());
          } else {
            const error = new Error('Failed to fetch search result');
            error.status = response.status;
            error.statusText = response.statusText;
            reject(error);
          }
        })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
    });
  };
};

