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
