'use strict';
import { getPdbEntry } from '../services';

const structureComponent = document.createElement('template');
structureComponent.innerHTML = `
<heading>Structure Information</heading>
  <div>PDB Id: <span id="pdb-id"></span></div>
  <div>Citation: <span id="citation"></span></div>
  <style>
    :host {
      display: block;
    }
  </style>
`;

export class StructureInfo extends HTMLElement {
  constructor() {
    super();
    this.shadowRootRef = this.attachShadow({ mode: 'open' });
    this.shadowRootRef.appendChild(structureComponent.content.cloneNode(true));
    this.pdbID = null;
    this.citation = null;
  }

  static get observedAttribute() {
    return ['pdb-id'];
  }

  onPdbChange(pdbID) {
    getPdbEntry(pdbID).then((entry) => {
      const { citation } = entry;
      this.updateCitation(citation);
      this.render();
    });
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (newValue !== oldValue) {
      this.pdbID = newValue;
      this.onPdbChange(newValue);
    }
  }


  updateCitation(citation) {
    const { journalAbbrev, pageFirst, pageLast,
      rcsbAuthors, title, year } = citation[0];
    const authors = rcsbAuthors.join(', ');
    this.citation = `${authors}, (${year}), ${title}, 
    ${journalAbbrev}, ${pageFirst}:${pageLast}`;
  }

  render() {
    this.shadowRootRef.querySelector('#pdb-id').innerHTML = this.pdbID;
    this.shadowRootRef.querySelector('#citation').innerHTML = this.citation;
  }



}
