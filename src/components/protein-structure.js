'use strict';

import { SelectStructure } from './select-structure.js';
import {
  calcPairwiseDistances,
  filterAtomLines,
  getAtomCoordinates,
  getCoordinates,
  getResidues,
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

  dispatchCustomEvent(name, eventValue) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          value: eventValue,
        },
        bubbles: true,
      })
    );
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

    if (residueStats.numResidues > 1) {
      const pairwiseDistStats = this.getPairwiseDistStats(cBetasAdjusted);
      this.dispatchCustomEvent('got-pairwise-dist-stats', pairwiseDistStats);
    }
  }

  getResidueStats(cBetas) {
    const residues = getResidues(cBetas);
    const numResidues = residues.length;
    console.log('Number of residues:', numResidues);
    return {
      residues: residues,
      numResidues: numResidues,
    };
  }

  getPairwiseDistStats(cBetas) {
    const refAtomCoords = getCoordinates(cBetas);
    console.log(refAtomCoords);

    const resPairwiseDistances = calcPairwiseDistances(refAtomCoords);
    const allDistances = resPairwiseDistances.flat();
    const _maxDistCutoff = this.getMaxDistCutoff(allDistances);
    console.log('Max pair-wise distance calculated is ', _maxDistCutoff);

    return {
      resPairwiseDistances: resPairwiseDistances,
      maxDistCutoff: _maxDistCutoff,
    };
  }

  getMaxDistCutoff = (dist) => {
    try {
      const maxDistance = Math.max(...dist);
      return Math.floor(maxDistance);
    } catch (ex) {
      console.log('Exception occurred while calculating max distance cutoff: ', ex);
      return null;
    }
  };

  render() {
    this.innerHTML = `<select-structure></select-structure>`;
  }
}
