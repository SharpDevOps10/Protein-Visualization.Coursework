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


}