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


}
