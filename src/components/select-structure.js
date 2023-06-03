'use strict';

import { PdbSearch } from './pdb-search.js';
import { StructureInfo } from './structure-info.js';
import { getProteinStructure } from '../services.js';

export class SelectStructure extends HTMLElement {
  constructor() {
    super();

    customElements.define('pdb-search', PdbSearch);
    customElements.define('structure-info', StructureInfo);
    this.render();
  }

  connectedCallback() {
    const pdbSearchElement = this.querySelector('pdb-search');
    pdbSearchElement.addEventListener('pdb-selected', (event) => {
      const pdbId = event.detail.value;
      this.handlePdbSelection(pdbId);
    });
  }

  handlePdbSelection(pdbId) {
    console.log('Got pdb selection:', pdbId);

    const structureInfoElement = this.querySelector('structure-info');
    structureInfoElement.setAttribute('pdb-id', pdbId);

    this.dispatchXhrStateEvent(true);

    getProteinStructure(pdbId).then((fullStructure) => {
      this.dispatchXhrStateEvent(false);
      this.dispatchEvent(
        new CustomEvent('structure-fetched', {
          detail: {
            value: fullStructure,
          },
          bubbles: true,
        })
      );
    });
  }

  dispatchXhrStateEvent(state) {
    this.dispatchEvent(
      new CustomEvent('xhr-state', {
        detail: {
          value: state,
        },
        bubbles: true,
      })
    );
  }
}
