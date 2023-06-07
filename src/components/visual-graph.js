'use strict';

const componentHtml = document.createElement('template');
componentHtml.innerHTML = `
  <style>
    .link-group line {
      stroke: #aaa;
    }
    .node-group circle {
      pointer-events: all;
      stroke: none;
      stroke-width: 40px;
    }
    .node-group circle:hover,
    .node-group text:hover {
      cursor: pointer;
    }
    #graph-container {
      border: 4px solid #ccc;
    }
  </style>
  <div id='graph-container'></div>
`;

export class D3Graph extends HTMLElement {
  constructor() {
    super();

    this.shadowRootRef = this.attachShadow({ mode: 'open' });
    this.shadowRootRef.appendChild(componentHtml.content.cloneNode(true));
    this.svg = null;
    this.width = this.getAttribute('width');
    this.height = this.getAttribute('height');
    this.node = null;
    this._nodeText = null;
    this.link = null;
    this._linkText = null;
    this._nodes = [];
    this._links = [];
    this.simulation = null;

    this.colors = null;
    this.nodeColor = null;
    this.nodeRadius = 25;

  }

  connectedCallback() {
    this.shadowRootRef.querySelector('#d3-graph-container').innerHTML = `<svg viewbox="${0} ${0} ${this.width} ${this.height}"></svg>`;

    this.svg = this.shadowRootRef.querySelector('svg');
    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);

    this.svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.svg.appendChild(this.svgGroup);

    this.simulation = {
      nodes: this._nodes,
      links: this._links,
      alphaTarget: () => {
      },
      tick: () => {
      },
    };

    this.colors = this.generateColors();
    this.nodeColor = (d, i) => this.colors(i);

    this.createNodeElements();
    this.createLinkElements();

    this._linkText = (d) => d.source.id + ' - ' + d.target.id;
    this._nodeText = (d) => d.id;

    this.render();
  }

  disconnectedCallback() {
    console.log('%c graph removed.', 'color: white; background-color: salmon');
  }

  static get observedAttributes() {
    return ['width', 'height'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
    }
  }

  set nodes(nodeList) {
    this.clearNodes();

    this._nodes = nodeList;
    this.joinNodes();

    this.addNodeText();

    this.render();
  }

  set nodeText(textFunc) {
    this._nodeText = textFunc;
    this.updateNodeText();
  }

  set links(linkList) {
    this.clearLinks();

    this._links = linkList;
    this.joinLinks();

    this.addLinkText();

    this.render();
  }

  set linkText(textFunc) {
    this._linkText = textFunc;
    this.updateLinkText();
  }

  updateGraph(nodesLinks) {
    this.clearNodes();
    this.clearLinks();

    const { nodes, links } = nodesLinks;
    this._nodes = nodes;
    this._links = links;

    this.joinNodes();
    this.joinLinks();

    this.render();
  }

  clearNodes() {
    this._nodes = [];
    this.joinNodes();
  }

  clearLinks() {
    this._links = [];
    this.joinLinks();
  }

  createNodeElements() {
    this.node = [];
  }

  createLinkElements() {
    this.link = [];
  }

  joinNodes() {
    this.node = this._nodes.map((node) => ({
      node,
      group: this.createNodeGroup(),
      circle: this.createNodeCircle(),
    }));
  }

  joinLinks() {
    this.link = this._links.map((link) => ({
      link,
      group: this.createLinkGroup(),
      line: this.createLinkLine(),
    }));
  }

  createNodeGroup() {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.svgGroup.appendChild(group);
    return group;
  }

  createNodeCircle() {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', this.nodeRadius);
    circle.setAttribute('fill', this.nodeColor);
    this.node.group.appendChild(circle);
    return circle;
  }

  createLinkGroup() {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.svgGroup.appendChild(group);
    return group;
  }

  createLinkLine() {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    this.link.group.appendChild(line);
    return line;
  }

  addNodeText() {
    this.node.forEach(({ node, group }) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '.35em');
      text.textContent = this._nodeText(node);
      group.appendChild(text);
    });
  }

  addLinkText() {
    this.link.forEach(({ link, group }) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '.35em');
      text.textContent = this._linkText(link);
      group.appendChild(text);
    });
  }

  updateNodeText() {
    this.node.forEach(({ node }) => {
      const text = this.node.group.querySelector('text');
      if (text) {
        text.textContent = this._nodeText(node);
      }
    });
  }

  updateLinkText() {
    this.link.forEach(({ link }) => {
      const text = this.link.group.querySelector('text');
      if (text) {
        text.textContent = this._linkText(link);
      }
    });
  }

  ticked = () => {
    this.link.forEach(({ link, line }) => {
      line.setAttribute('x1', link.source.x);
      line.setAttribute('y1', link.source.y);
      line.setAttribute('x2', link.target.x);
      line.setAttribute('y2', link.target.y);
    });

    this.node.forEach(({ node, group }) => {
      group.setAttribute('transform', `translate(${node.x},${node.y})`);
    });
  };

  render() {
    this.simulation.alphaTarget(1);
    this.simulation.tick();
    this.simulation.alphaTarget(0);

    requestAnimationFrame(this.render.bind(this));
  }

  generateColors() {
    const schemePaired = [
      '#a6cee3', '#1f78b4', '#b2df8a', '#33a02c',
      '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00',
      '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'
    ];

    return (i) => schemePaired[i % schemePaired.length];
  }
}

customElements.define('d3-graph', D3Graph);
