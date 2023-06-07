'use strict';

import { D3Graph } from './visual-graph.js';
import { memoize } from '../utils/memoization.js';

export default class Graph extends HTMLElement {
  constructor() {
    super();

    this.memoized = {};

    this.d3Graph = null;
    this.nodes = null;
    this.links = [];
    this.linkText = (linkData) => linkData.dist;

    this.distCutoff = 5;
    this.resPairGapMin = 4;

    this.graphHeight = this.getHeight();
    this.graphWidth = this.getWidth();

    this.registerDependencies();
    this.render();
  }

  getWidth() {
    let width = this.getAttribute('graph-width');
    if (width === 'null') {
      width = window.innerWidth;
    }
    return width;
  }

  getHeight() {
    let height = this.getAttribute('graph-height');
    if (height === 'null') {
      height = window.innerHeight - 250;
    }
    return height;
  }

  set residues(res) {
    this._residues = res;
    this.nodes = this.residuesToNodes(this._residues);
    this.renderD3Graph();

    this.memoized.getMesmerGraphLinks = null;
  }

  set resPairwiseDistances(pairwiseDist) {
    this._resPairwiseDistances = pairwiseDist;
    this.links = this.getMesmerGraphLinks(this.distCutoff, this.resPairGapMin);
    this.renderD3Graph();
  }

  set distCutoff(value) {
    this._distCutoff = value;
    this.links = this.getMesmerGraphLinks(this.distCutoff, this.resPairGapMin);
    this.renderD3Graph();
  }

  set resPairGapMin(value) {
    this._resPairGapMin = value;
    this.links = this.getMesmerGraphLinks(this.distCutoff, this.resPairGapMin);
    this.renderD3Graph();
  }

  registerDependencies() {
    customElements.define('d3-graph', D3Graph);
  }

  connectedCallback() {
    this.d3Graph = this.querySelector('d3-graph');
  }

  residuesToNodes(residues) {
    const graphNodes = residues.map((resName, index) => ({
      id: resName + ' ' + (index + 1),
    }));
    return graphNodes;
  }

  pairwiseDistToLinks(resPairwiseDistances) {
    const distCutoff = 5;
    const resPairGapMin = 4;

    const graphLinks = this.getMesmerGraphLinks(resPairwiseDistances, distCutoff, resPairGapMin);
    return graphLinks;
  }

  getMesmerGraphLinks = memoize((distCutoff, resPairGapMin) => {
    let graphLinks = [];
    this._resPairwiseDistances.forEach((singleDist, sourceIndex) => {
      const res1Index = sourceIndex;
      singleDist.forEach((dist, targetIndex) => {
        const res2Index = sourceIndex + targetIndex + 1;
        if (
          !distCutoff ||
          (distCutoff &&
            dist <= distCutoff &&
            res2Index - res1Index >= resPairGapMin)
        ) {
          graphLinks.push({
            source: res1Index,
            target: res2Index,
            dist: dist.toFixed(3),
          });
        }
      });
    });
    return graphLinks;
  });

  renderD3Graph() {
    this.d3Graph.nodes = this.nodes ?? this.d3Graph.nodes;
    this.d3Graph.links = this.links ?? this.d3Graph.links;
    this.d3Graph.linkText = this.linkText ?? this.d3Graph.linkText;
  }

  render() {
    this.innerHTML = `<d3-graph width="${this.graphWidth}" height="${this.graphHeight}"></d3-graph>`;
  }
}
