'use strict';

export class AlertElement extends HTMLElement {
  constructor() {
    super();
    this._alertType = this.getAttribute('alert-type');
    this._alertText = this.getAttribute('alert-text');
    this.render();
  }

  static get observedAttributes() {
    return ['enabled', 'alert-type', 'alert-text'];
  }

  set isActive(val) {
    val ? this.setAttribute('enabled', '') : this.removeAttribute('enabled');
  }

}
