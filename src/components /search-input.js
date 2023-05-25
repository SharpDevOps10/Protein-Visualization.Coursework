'use strict';
let templateElement = document.createElement('template');
templateElement.innerHTML = `
  <style>
    label {
      display: block;
      width: 100%;
    }
    input {
      width: 100%;
    }
  </style>
  <label for="search-input"></label>
  <input type="text" id="search-input" name="search-input">
`;

export class SearchInput extends HTMLElement {
  constructor() {
    super();
    this.appendChild(templateElement.content);

  }

  connectedCallback() {
    const inputElement = this.querySelector('input');
    inputElement.addEventListener('change', (event) => {
      console.log('Value changed: ', event.target.value);
      this.dispatchEvent(new CustomEvent('item-selected', {
        detail: {
          value: event.target.value
        },
        bubbles: true,
      }));
    });

    inputElement.addEventListener('keyup', (event) => {
      const enteredValue = event.target.value;
      console.log('Value changed: ', enteredValue);
      this.dispatchEvent(new CustomEvent('item-selected', {
        detail: {
          value: enteredValue
        },
        bubbles: true,
      }));
    });


  }


}
