'use strict';

let componentHtml = document.createElement('template');
componentHtml.innerHTML = `
  <input list="list-items">
  <datalist id="list-items">
  </datalist>
`;