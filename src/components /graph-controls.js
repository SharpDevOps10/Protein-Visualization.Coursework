'use strict';

export default class GraphControls extends HTMLElement {
  constructor() {
    super();
    this._maxDistCutoff = 5;
    this._maxResPairGap = 5;

    this.render();
  }
}