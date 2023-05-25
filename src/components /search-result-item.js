'use strict';

const componentHtml = document.createElement('template');
componentHtml.innerHTML = `
  <li></li>
`;

export class SearchResultItem extends HTMLElement {
  constructor() {
    super();
    this._text = '';
  }

  connectedCallback() {
    this.addEventListener('click', () => {
      console.log('li clicked');
      this.dispatchEvent(new CustomEvent('item-clicked', {
        detail: {
          value: this._text
        },
        bubbles: true
      }));
    });
  }

}
