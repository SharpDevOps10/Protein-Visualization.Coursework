'use strict';

import { SpinnerElement } from './spinner-element.js';
import { AlertElement } from './alert-element.js';

import ProteinStructure from './protein-structure.js';
import Graph from './widget-graph.js';
import GraphControls from './graph-controls.js';

export default class GraphApp extends HTMLElement {
  constructor() {
    super();
    this.registerDependencies();
    this.shadowRootRef = this.attachShadow({ mode: 'open' });
    this.MAX_RESIDUES = 200;

    this.graphHeight = this.getAttribute('graph-height');
    this.graphWidth = this.getAttribute('graph-width');
    this.render();

  }

  registerDependencies() {

    customElements.define('spinner-element', SpinnerElement);
    customElements.define('alert-element', AlertElement);
    customElements.define('protein-structure', ProteinStructure);
    customElements.define('graph', Graph);
    customElements.define('graph-controls', GraphControls);

  }

  connectedCallback() {
    const spinnerEl = this.shadowRootRef.querySelector('spinner-element');
    const mesmerStruct = this.shadowRootRef.querySelector('protein-structure');
    const mesmerGraph = this.shadowRootRef.querySelector('graph');
    const mesmerGraphControls = this.shadowRootRef.querySelector('graph-controls');

    mesmerStruct.addEventListener('xhr-state', (event) => {
      spinnerEl.enabled = event.detail.value;
      console.log('mesmer struct ', event.detail.value);
    });
    mesmerStruct.addEventListener('pdb-search-error', () => {
      this.showAlert('error', 'Pdb search error.');
    });
    mesmerStruct.addEventListener('got-residue-stats', (event) => {
      console.log('mesmer struct got residue stats: ', event.detail.value);
      const { residues, numResidues } = event.detail.value;
      mesmerGraph.residues = residues;

      mesmerGraphControls.maxResPairGap = numResidues - 1;

      if (numResidues > this.MAX_RESIDUES) {
        this.showAlert('warning', 'Max number of residues exceeded: ' + numResidues);
      } else if (numResidues < 1) {
        this.showAlert('error', 'Invalid number of residues: ' + numResidues);
      }
    });
    mesmerStruct.addEventListener('got-pairwise-dist-stats', (event) => {
      console.log('mesmer struct got residue stats: ', event.detail.value);
      const pairwiseDistStats = event.detail.value;
      mesmerGraph.resPairwiseDistances = pairwiseDistStats.resPairwiseDistances;

      mesmerGraphControls.maxDistCutoff = pairwiseDistStats.maxDistCutoff;
    });

    mesmerGraphControls.addEventListener('max-distance-change', (event) => {
      const distCutoffNew = event.detail.value;
      mesmerGraph.distCutoff = distCutoffNew;
    });
    mesmerGraphControls.addEventListener('min-res-pair-gap-change', (event) => {
      const resPairGapMinNew = event.detail.value;
      mesmerGraph.resPairGapMin = resPairGapMinNew;
    });

  }

  showAlert = (alertType, alertText) => {
    const alertEl = this.shadowRootRef.querySelector('alert-element');
    alertEl.alertText = alertText;
    alertEl.alertType = alertType;
    alertEl.enabled = true;
  };


  render() {
    this.shadowRootRef.innerHTML = `
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
      <script src="path/to/local/library.js"></script>
      <alert-element></alert-element>
      <spinner-element></spinner-element>
      <protein-structure></protein-structure>
      <graph graph-width="${this.graphWidth}" graph-height="${this.graphHeight}"></graph>
      <graph-controls></graph-controls>    
    `;
  }


}
