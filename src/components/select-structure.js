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


}
