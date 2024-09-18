class FooterBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");

    this._bgcolor = this.getAttribute("bgcolor");
    this._color = this.getAttribute("color");
  }

  _updateStyle() {
    this._style.textContent = `
            :host {
                display: block;
                width: 100%;
                color: ${this._color};
                background-color: ${this._bgcolor};
                
            }
            div {
                padding: 24px 20px;
                text-align: left;
            }
            .brand-name {
                margin:0;
                font-size: 1.5rem;
            }
        `;
  }
  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
            <div>
                My Note by Trio Maulana &copy; 2024
            </div>
        `;
  }
}

customElements.define("footer-bar", FooterBar);
