'use strict';
import { SearchResultItem } from './search-result-item.js';

const componentHtml = document.createElement('template');
componentHtml.innerHTML = `
  <ul></ul>
  <style>
    ul {
      position: absolute;
      background-color: #ececec;
      margin-top: 0;
      width: 100%;
    }
    
    li {
      list-style-type: none;   
      width: 80%;
      margin: 1rem;
      border: 1px solid #ccc;
      display: inline-block;
    }
    li:hover {
      background-color: #ccc;
      cursor: pointer;
    }
    @media (min-width: 768px) {
      li {
        width: 15%;
      }
    }
  </style>
  `;

export class SearchResult extends HTMLElement {
  constructor() {
    super();
    this.appendChild(componentHtml.content);
    this._resultList = [];
    customElements.define('result-item', SearchResultItem, { extends: 'li' });

    this.render();

  }

  get resultList() {
    return this._resultList;
  }

  set resultList(results) {
    this._resultList = results;
    this.render();
  }

  renderResultItems() {
    return this._resultList.map((resultText) => `<li is='result-item' text=${resultText}></li>`).join('');
  }

  render() {
    this.querySelector('ul')
      .innerHTML = `${this.renderResultItems()}`;
  }

}
