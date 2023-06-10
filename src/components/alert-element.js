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
    if (alertElement) alertElement.classList.add(alertClass);
  }

  updateAlertText(alertText) {
    const alertElement = this.getAlertElement();
    if (alertElement) alertElement.textContent = alertText;
  }

  getAlertElement() {
    return this.querySelector('div.alert');
  }

  attributeChangedCallback(attributeName, previousVal, nextVal) {
    const isInitialLoad = (attributeName === 'enabled' && this.hasAttribute('enabled'));

    const attributeActions = new Map([
      ['alert-type', () => {
        this._alertType = nextVal;
        if (!isInitialLoad) this.updateAlertClass(nextVal);
      }],
      ['alert-text', () => {
        this._alertText = nextVal;
        if (!isInitialLoad) this.updateAlertText(nextVal);
      }]
    ]);

    const action = attributeActions.get(attributeName);
    if (action) {
      action();
    }

    this.render();
    if (isInitialLoad) {
      const closeButton = this.querySelector('button');
      closeButton.addEventListener('click', this.onAlertCloseClick.bind(this));
    }
  }

  onAlertCloseClick() {
    this.enabled = false;
  }

  getAlertClass(alertType) {
    const alertClasses = new Map([
      ['warning', 'alert-warning'],
      ['error', 'alert-danger'],
      ['info', 'alert-info']
    ]);

    return alertClasses.get(alertType) || alertClasses.get('info');
  }

  render() {
    this.innerHTML = this.hasAttribute('enabled')
      ? `
      <style>
        alert-element {
          position: absolute;
          width: 100%;
        }
        button {
          float: right;
        }
      </style>
      <div class="alert ${this.getAlertClass(this._alertType) || 'alert-info'}" role="alert">
        ${this._alertText}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `
      : ``;
  }


}
