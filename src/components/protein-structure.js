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

  completeCBetaForGlycine(cAlphas, cBetas) {
    const cBetasCopy = cBetas;
    if (cAlphas.length > cBetasCopy.length) {
      cAlphas.forEach((cAlphaLine, index) => {
        if (cAlphaLine.includes('GLY')) {
          cBetasCopy.splice(index, 0, cAlphaLine);
        }
      });
    }
    return cBetasCopy;
  }

  processStructure(fullStructure) {
    const atomLines = getAtomCoordinates(fullStructure);
    const cAlphas = filterAtomLines('CA', atomLines);
    console.log('C-alphas:', cAlphas);

    const cBetas = filterAtomLines('CB', atomLines);
    const cBetasAdjusted = this.completeCBetaForGlycine(cAlphas, cBetas);
    console.log('C-betas:', cBetas);

    const residueStats = this.getResidueStats(cBetasAdjusted);
    this.dispatchCustomEvent('got-residue-stats', residueStats);

    if (residueStats.numResidues > 1)  {
      const pairwiseDistStats = this.getPairwiseDistStats(cBetasAdjusted);
      this.dispatchCustomEvent('got-pairwise-dist-stats', pairwiseDistStats);
    }


  }

}
