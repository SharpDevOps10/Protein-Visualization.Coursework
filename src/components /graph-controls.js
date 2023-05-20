'use strict';

export default class GraphControls extends HTMLElement {
  constructor() {
    super();
    this._maxDistCutoff = 5;
    this._maxResPairGap = 5;

    this.render();
  }

  set maxDistCutOff(newMaxDistCutoff) {
    this._maxDistCutoff = newMaxDistCutoff;
    const masDistInput = this.querySelector('#max-distance');
    masDistInput.setAttribute('max', this._maxDistCutoff);
  }

  set maxResPairGap(newMaxResPairGap) {
    this._maxResPairGap = newMaxResPairGap;
    const minResGapInput = this.querySelector('#min-res-gap');
    minResGapInput.setAttribute('max', this._maxDistCutoff);
  }

}