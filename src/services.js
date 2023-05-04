'use strict';
const pdbSearch = 'https://search.rcsb.org/rcsbsearch/v1/query?json=';
const modelServer = 'https://models.rcsb.org/v1/';
const pdbEntryService = 'https://data.rcsb.org/rest/v1/core/entry/';

const httpClient = (url, requestOption) => fetch(url, requestOption);

const pdbSearchService = () => {
  const pdbSearchAbortController = new AbortController();
  return (searchValue) => {
    const encodedSearchValue = encodeURI(JSON.stringify(searchValue));
    pdbSearchAbortController.abort();
    const signal = pdbSearchAbortController.signal;
    const url = pdbSearch + encodedSearchValue;

    return new Promise((resolve, reject) => {
      httpClient(url, { signal })
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

export const searchPdbEntry = (searchValue) => pdbSearchService(searchValue);

export const getProteinStructure = (pdbId) => new Promise((resolve, reject) => {
  if (!pdbId) {
    reject('Invalid identification');
  } else {
    pdbId = pdbId.toLowerCase();
    const searchParams = `${pdbId}/full?encoding=cif&copy_all_categories=false`;
    httpClient(modelServer + searchParams)
      .then((response) => {
        if (!response.ok) {
          reject('Response error');
        } else {
          resolve(response.text());
        }
      })
      .catch((error) => {
        console.log(error);
        reject('Error occurred while fetching data');
      });
  }
});

export const getPdbEntry = (pdbId) => new Promise((resolve, reject) => {
  if (!pdbId) {
    reject('Invalid identification');
  } else {
    pdbId = pdbId.toLowerCase();
    httpClient(pdbEntryService + pdbId)
      .then((response) => {
        if (!response.ok) {
          reject('Response error');
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        console.error(error);
        reject(error.message);
      });
  }
});
