import {deleteNote, archiveNote, unarchiveNote, getArchivedNotes} from "../data/api/notes.js";

class NoteItem extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
    archived: null,
  };

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
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
    let bgcolor ;
    if (!this._note.archived) {
      bgcolor = "#FADFA1";
    } else {
      bgcolor = "#ECDFCC";
    }
    this._style.textContent = `
      :host {
        display: block;
        border-radius: 8px;
        background-color: ${bgcolor};
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
        cursor: pointer;
        }
      
      .note-info__archived:hover {
        background-color: #C99999;
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
    let month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][mydate.getMonth()];
    let newCreatedDate =
      mydate.getDate() + " " + month + " " + mydate.getFullYear();
    let status;
    let color;
    if (this._note.archived) {
      status = "Unarchive";
      color = "red";
    } else {
      status = "Archive";
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
            <button id="${this._note.id}"  type="button" class="btn note-info__archived"  style = "background-color: ${color};" >${status}</button>
            <button type="button" class="btn btn-danger delete-button" id="${this._note.id}">Hapus</button>
          </div>
        </div>
    `;
    const button = this._shadowRoot.querySelector(".delete-button");
    const archived = this._shadowRoot.querySelector(".note-info__archived");

    button.addEventListener("click", onDeleteNote);
    if (!this._note.archived) {
      archived.addEventListener("click", onArchivedNote);
    } else {
      archived.addEventListener("click", onUnarchivedNote);
    }
  }
}
const Swal = require("sweetalert2");
const onDeleteNote = async function (event) {
  const Id = event.target.id;
  event.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteNote(Id);
    }
  });
};
const onArchivedNote = async function (event) {
  const Id = event.target.id;
  event.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Archive it!",
  }).then((result) => {
    if (result.isConfirmed) {
      archiveNote(Id);
    }
  });
};

const onUnarchivedNote = async function (event) {
  const Id = event.target.id;
  event.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Archive it!",
  }).then((result) => {
    if (result.isConfirmed) {
      unarchiveNote(Id);
    }
  });
};
customElements.define("note-item", NoteItem);
