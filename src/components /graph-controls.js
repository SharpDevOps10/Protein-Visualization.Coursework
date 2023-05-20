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

  createRangeInput(value, min, max, id, label, onChangeCallback) {
    const rangeInput = document.createElement('input');
    rangeInput.setAttribute('type', 'range');
    rangeInput.setAttribute('value', value);
    rangeInput.setAttribute('value', value);
    rangeInput.setAttribute('min', (min || 0).toString());
    rangeInput.setAttribute('max', (max || 0).toString());
    rangeInput.setAttribute('step', 1);
    rangeInput.setAttribute('id', id || 'range-id');

    rangeInput.addEventListener('change', onChangeCallback);
    const rangeValue = document.createElement('span');
    rangeValue.setAttribute('id', id+'-value');
    rangeValue.innerText = value;

    const rangeLabel = document.createElement('label');
    rangeLabel.setAttribute('id', id+"-wrapper");
    rangeLabel.innerText = label;

    rangeLabel.appendChild(rangeValue);
    rangeLabel.appendChild(rangeInput);
    return rangeLabel;

  }

}