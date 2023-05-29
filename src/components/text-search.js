'use strict';
import { SearchInput } from './search-input.js';
import { SearchResult } from './search-result.js';

export class TextSearch extends HTMLElement {
  constructor() {
    super();
    this.shadowRootRef = this.attachShadow({ mode: 'open' });

    customElements.define('search-input', SearchInput);
    customElements.define('search-result', SearchResult);

    this._resultList = [];
    this.mainLabel = this.getAttribute('main-label');

    this.render();
  }

  get resultList() {
    return this.shadowRootRef.querySelector('search-result').resultList;
  }

  set resultList(results) {
    this.shadowRootRef.querySelector('search-result').resultList = results;
  }

  static get observedAttributes() {
    return ['main-label'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.mainLabel = newValue;
    this.shadowRootRef
      .querySelector('search-input')
      .setAttribute('main-label', newValue);
  }

  render() {
    this.shadowRootRef.innerHTML = `
      <search-input main-label=${this.mainLabel}></search-input>
      <search-result></search-result>
    `;
  }
}