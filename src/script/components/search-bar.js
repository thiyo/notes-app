class SearchBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _submitEvent = "submit";
  _searchEvent = "search";

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");

    this.render();
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this._shadowRoot
      .querySelector("form")
      .addEventListener("submit", (event) => this._onFormSubmit(event, this));
    this.addEventListener(this._submitEvent, this._onSearchBarSubmit);
  }

  disconnectedCallback() {
    this._shadowRoot
      .querySelector("form")
      .removeEventListener("submit", (event) =>
        this._onFormSubmit(event, this),
      );
    this.removeEventListener(this._submitEvent, this._onSearchBarSubmit);
  }

  _onFormSubmit(event, searchBarInstance) {
    searchBarInstance.dispatchEvent(new CustomEvent("submit"));

    event.preventDefault();
  }

  _onSearchBarSubmit() {
    const query = this._shadowRoot.querySelector("input#name").value;

    if (!query) return;

    this.dispatchEvent(
      new CustomEvent(this._searchEvent, {
        detail: { query },
        bubbles: true,
      }),
    );
  }

  _updateStyle() {
    this._style.textContent = `
        :host {
            display: inline;
        }
      
        .floating-form {
            background-color: #FFF7FC;
            height: 50px;
            padding: 5px;
            border-radius: 50PX;
            position: sticky;
            top: 10px;
        }
        .search-form {
            display: flex;
            gap: 16px;
        }
        .search-form .form-group {
            flex-grow: 1;
            position: relative;
        }
        
        .search-form .form-group input {
            background-color: #FFF7FC;
            display: block;
            width: 100%;
            height: 50px;
            padding: 0px 0px 0 10px;
            border: none;
            border-radius: 50PX;
            font-size: 1.3em;
        }
        .search-form .form-group input:focus-visible {
            outline: 0;
        }

        .search-form button{
            border: 0;
            height: 50px;
            border-radius: 50px;
            padding-inline: 24px;
            background-color: #FFF7FC;
            text-transform: uppercase;
            font-size: 1rem;
            color: white;
            cursor: pointer;
            transition: 100ms linear;
        }
      `;
  }
  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
        <div class="floating-form">
            <form id="searchForm" class="search-form">
                <div class="form-group">
                    <input id="name" name="name" type="search" placeholder="search notes" />
                </div>
                <button><img src="filter.png" width="40px" alt="filter"></button>
            </form>
        </div>
      `;
  }
}

customElements.define("search-bar", SearchBar);
