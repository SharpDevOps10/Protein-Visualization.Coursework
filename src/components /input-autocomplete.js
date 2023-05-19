'use strict';

const componentHtml = document.createElement('template');
componentHtml.innerHTML = `
  <input list="list-items">
  <datalist id="list-items">
  </datalist>
`;

export class InputAutocomplete extends HTMLElement {
  constructor() {
    super();

    this.shadowRootRef = this.attachShadow({ mode: 'open' });
    this.shadowRootRef.appendChild(componentHtml.content.cloneNode(true));
    this._listItems = [];
  }
}
