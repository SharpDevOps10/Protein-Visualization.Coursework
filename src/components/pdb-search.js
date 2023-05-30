'use strict';

import { TextSearch } from './text-search.js';
import { searchPdbEntry } from '../services';

export class PdbSearch extends HTMLElement {
  constructor() {
    super();
    customElements.define('text-search', TextSearch);
    this.render();
  }

  connectedCallback() {
    const textSearchElement = this.querySelector('text-search');
    const shadowRoot = textSearchElement.shadowRoot;
    shadowRoot.addEventListener('value-input', (event) => {
      const searchString = event.detail.value;
      if (!searchString) textSearchElement.resultList = [];
      const pdbSearchObj = {
        query: {
          type: 'terminal',
          service: 'full_text',
          parameters: {
            value: searchString,
          },
        },
        return_type: 'entry',
      };

      searchPdbEntry(pdbSearchObj)
        .then((pdbList) => {
          const pdbIdentifiers = pdbList.result_set.map((el) => el.identifier);
          textSearchElement.resultList = pdbIdentifiers;
        })
        .catch((error) => {
          this.dispatchPdbSearchError(error);
        });
    });

    shadowRoot.addEventListener('item-clicked', (event) => {
      const clickedItem = event.detail.value;
      textSearchElement.resultList = [];
      this.dispatchPdbSelected(clickedItem);
    });
  }

  dispatchPdbSelected(selectedPdbId) {
    const event = new CustomEvent('pdb-selected', {
      detail: {
        value: selectedPdbId,
      },
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  dispatchPdbSearchError(error) {
    const event = new CustomEvent('pdb-search-error', {
      detail: {
        value: error,
      },
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    this.innerHTML = `
      <text-search main-label="Search PDB"></text-search>
    `;
  }
}
