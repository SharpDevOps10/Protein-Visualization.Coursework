'use strict';

import { SpinnerElement } from './spinner-element.js';
import { AlertElement } from './alert-element.js';

import ProteinStructure from './protein-structure.js';
import Graph from './widget-graph.js';
import GraphControls from './graph-controls.js';

export default class GraphApp extends HTMLElement {
  constructor() {
    super();

  }

  registerDependencies() {

    customElements.define('spinner-element', SpinnerElement);
    customElements.define('alert-element', AlertElement);
    customElements.define('protein-structure', ProteinStructure);
    customElements.define('graph', Graph);
    customElements.define('graph-controls', GraphControls);

  }

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
