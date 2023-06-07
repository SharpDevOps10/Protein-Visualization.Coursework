'use strict';

export class SpinnerElement extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  static get observedAttributes() {
    return ['enabled'];
  }

  set enabled(value) {
    if (value) {
      this.setAttribute('enabled', '');
    } else {
      this.removeAttribute('enabled');
    }
  }

  render() {
    this.innerHTML = this.hasAttribute('enabled')
      ? `
      <style>
        spinner-element {
          position: absolute;
          width: 100%;
          height: 100%;        
        }
        #spinner-overlay {
          background-color: white;
          opacity: 0.7;
          position: absolute;
          width: 100%;
          height: 100%;        
        }
        #spinner-wrapper {
          position: absolute;
          top: calc(50% - 2rem);
          left: calc(50% - 2rem);
          z-index: 1000;
        }
      </style>
      <div id="spinner-wrapper">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div id="spinner-overlay"></div>
    `
      : ``;
  }
}
