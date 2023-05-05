'use strict';
const pdbSearch = 'https://search.rcsb.org/rcsbsearch/v1/query?json=';
const modelServer = 'https://models.rcsb.org/v1/';
const pdbEntryService = 'https://data.rcsb.org/rest/v1/core/entry/';

const httpClient = (url, requestOption) => fetch(url, requestOption);

const pdbSearchService = () => {
  const pdbSearchAbortController = new AbortController();
  return async (searchValue) => {
    const encodedSearchValue = encodeURI(JSON.stringify(searchValue));
    pdbSearchAbortController.abort();
    const signal = pdbSearchAbortController.signal;
    const url = pdbSearch + encodedSearchValue;
    try {
      const response = await httpClient(url, { signal });
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        return await (response.json());
      }
      throw new Error ('Failed to fetch search result');

    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };
};

export const searchPdbEntry = (searchValue) => pdbSearchService(searchValue);

export const getProteinStructure = async (pdbId)  => {
  if (!pdbId) throw ('Invalid identification');
  const lowerCaseID = pdbId.toLowerCase();
  const searchParams = `${lowerCaseID}/full?encoding=cif&copy_all_categories=false`;
  try {
    const response = await httpClient(modelServer + searchParams);
    if (!response.ok) {
      throw new Error('Response error');
    }
    return response.text();
  } catch (error) {
    console.log(error);
    throw 'Error occurred while fetching data';
  }

};

export const getPdbEntry = async (pdbId) =>  {
  if (!pdbId) throw new Error('Invalid identification');
  const lowerCaseID = pdbId.toLowerCase();
  try {
    const response = httpClient(pdbEntryService + lowerCaseID);
    if (!response.ok) {
      throw new Error('Response error');
    }
    return response.json();
  } catch (error) {
    console.log(error);
    throw new Error('Error occurred while fetching data');
  }
};
