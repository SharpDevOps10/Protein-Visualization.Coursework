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

  createRangeInput(value, min, max, id = 'range-id', label, onChangeCallback) {
    const rangeInput = document.createElement('input');
    rangeInput.type = 'range';
    rangeInput.value = value;
    rangeInput.min = (min || 0).toString();
    rangeInput.max = (max || 0).toString();
    rangeInput.step = '1';
    rangeInput.id = id;
    rangeInput.addEventListener('change', onChangeCallback);

    const rangeValue = document.createElement('span');
    rangeValue.id = `${id}-value`;
    rangeValue.innerText = value;

    const rangeLabel = document.createElement('label');
    rangeLabel.id = `${id}-wrapper`;
    rangeLabel.innerText = label;
    rangeLabel.appendChild(rangeValue);
    rangeLabel.appendChild(rangeInput);

    return rangeLabel;

  }
  createGraphControls() {
    const defaultMaxDistance = 3;
    const defaultMinValue = 1;
    const maxDistanceInput = this.createRangeInput(
      defaultMaxDistance,
      defaultMinValue,
      this._maxDistCutoff,
      'max-distance',
      'Maximum distance: ',
      this.onMaxDistanceChange
    );

    const minPairGap = this.createRangeInput(
      defaultMaxDistance,
      defaultMinValue,
      this._maxResPairGap,
      'min-res-gap',
      'Minimum residue pair gap:',
      this.onMinResGapChange
    );
    const controlWrapper = this.querySelector('#controls-wrapper');
    controlWrapper.append(maxDistanceInput, minPairGap);
  }

  connectedCallback() {
    this.createGraphControls();
  }

  onMaxDistanceChange(event) {
    const newMaxDistance = event.target.valueAsNumber;
    console.log('Max distance range changed: ', newMaxDistance);

    const rangeValueElement = event.target.previousElementSibling;
    rangeValueElement.innerText = newMaxDistance;

    const maxDistanceChangeEvent = new CustomEvent('max-distance-change', {
      detail: { value: newMaxDistance },
      bubbles: true,
    });
    this.dispatchEvent(maxDistanceChangeEvent);
  }

  onMinResGapChange(event) {
    const newMinPairGap = event.target.valueAsNumber;
    console.log('Minimum residue pair gap changed: ', newMinPairGap);

    const rangeValueElement = event.target.previousElementSibling;
    rangeValueElement.innerText = newMinPairGap;

    const minPairChangeEvent = new CustomEvent('min-res-pair-gap-change', {
      detail: { value: newMinPairGap },
      bubbles: true,
    });
    this.dispatchEvent(minPairChangeEvent);
  }

  render() {
    this.innerHTML = `
      <div id="controls-wrapper"></div>
    `;
  }






}
