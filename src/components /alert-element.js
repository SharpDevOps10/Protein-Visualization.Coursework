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

  set alertProperties(val) {
    this.setAttribute('alert-type', val);
    this.setAttribute('alert-text', val);
  }
  updateAlertClass(alertClass) {
    const alertElement = this.getAlertElement();
    alertElement && (alertElement.className = `alert ${alertClass}`);
  }
  updateAlertText() {
    const alertElement = this.getAlertElement();
    alertElement && (alertElement.innerText = alertElement);
  }
  getAlertElement() {
    return this.querySelector('div.alert');
  }







}
