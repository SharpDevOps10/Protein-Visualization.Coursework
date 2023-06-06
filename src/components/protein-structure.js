'use strict';

import { SelectStructure } from './select-structure.js';
import {
  getAtomCoordinates,
  filterAtomLines,
  getResidues,
  getCoordinates,
  calcPairwiseDistances,
} from '../utils/structure.js';

export default class ProteinStructure extends HTMLElement {
  constructor() {
    super();
    customElements.define('select-structure', SelectStructure);
    this.render();
  }

  connectedCallback() {
    const structureInfo = this.querySelector('select-structure');
    structureInfo.addEventListener('structure-fetched', (event) => {
      console.log('Structure fetched in Mesmer protein structure');
      this.processStructure(event.detail.value);
    });
  }
}