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

  connectedCallback() {
    const inputElement = this.shadowRootRef.querySelector('input');
    inputElement.addEventListener('change', (event) => {
      const value = event.target.value;
      console.log('Value changed: ', value);
    });
    inputElement.addEventListener('keydown', (event) => {
      const value = event.target.value;
      console.log("Keydown event: ", value);
    });
  }

  get itemsList() {
    return this._listItems;
  }

  set itemsList(items) {
    this._listItems = items;
    this.render();
  }

  renderItemsOptions() {
    const optionElements = this._listItems.map((item) => {
      return `<option>${item}</option>`;
    });
    return optionElements.join('');
  }

  render() {
    this.shadowRootRef.querySelector('datalist')
      .innerHTML = `${this.renderItemsOptions()}`;
  }





}
