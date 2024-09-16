import Notes from "../data/api/notes.js";
import Home from "../view/home.js";
class NoteItem extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    favColor: null,
    createdAt: null,
    archived: null,
  };
 
  constructor() {
    super();
 
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }
 
  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }
 
  set note(value) {
    this._note = value;
 
    // Render ulang
    this.render();
  }
 
  get note() {
    return this._note;
  }
 
  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        border-radius: 8px;
        background-color: #FADFA1;
        overflow: hidden;
      }
 
      .fan-art-note {
        width: 100%;
        max-height: 450px;
        
        object-fit: cover;
        object-position: center;
      }
 
      .note-info {
        display: flex;
        flex-direction: column;
        padding: 16px 24px;
      }
 
      .note-info__title h2 {
        font-weight: bold;
      }
 
      .note-info__description p {
        display: -webkit-box;
        margin-top: 10px;
        
        overflow: hidden;
 
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5; /* number of lines to show */
      }

      .action-bar {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
      }
      .note-info__archived {
        width: fit-content;
        margin-top: 10px;
        padding: 6px 12px;
        border: none;
        color: white;
        border-radius: 12px;
        }
      
      .delete-button {
        background-color: #C96868;
        width: fit-content;
        margin-top: 10px;
        padding: 10px 20px;
        border: none;
        color: white;
        border-radius: 12px;
        cursor: pointer;
      }
      .delete-button:hover {
        background-color: #C99999;
      }
    `;
  }
 
  render() {
    this._emptyContent();
    this._updateStyle();
    let mydate = new Date(this._note.createdAt);
    let month = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"][mydate.getMonth()];
    let newCreatedDate = mydate.getDate() + ' ' + month + ' ' + mydate.getFullYear();
    let status;
    let color;
    if (this._note.archived) {
        status = "archived";
        color = "red";
    } else {
        status = "active";
        color = "green";
    }
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="card">
        <div class="note-info">
          <div class="note-info__title">
            <h2>${this._note.title}</h2>
            <p>${newCreatedDate}</p>
          </div>
          <div class="note-info__description">
            <p>${this._note.body}</p>
            <div class= "action-bar">
            <div class="note-info__archived" style = "background-color: ${color};" >${status}</div>
            <button type="button" class="btn btn-danger delete-button" id="${this._note.id}">Hapus</button>
          </div>
        </div>
      </div>
    `;
    const button = this._shadowRoot.querySelector('.delete-button');

    button.addEventListener('click', onDeleteNote);
  
  }
  
}
const onDeleteNote = async function(event) {
  const Id = event.target.id;
      let text = "Kamu akan menghapus catatan ini";
      if (confirm(text) == true) {
        await Notes.deleteNote(Id);
      } 
  event.preventDefault();
  Home();
}
customElements.define('note-item', NoteItem);