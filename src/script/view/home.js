import Utils from "../utils.js";
import {getAllNotes, searchNote, saveNote, getArchivedNotes} from "../data/api/notes.js";
import Swal from "sweetalert2";

const home = () => {
  const searchFormElement = document.querySelector("search-bar");
  const submitNoteFormElement = document.getElementById("addNote");
  const noteTitleInput = submitNoteFormElement.elements.title;
  const noteListContainerElement = document.querySelector("#noteListContainer");
  const noteQueryWaitingElement =
    noteListContainerElement.querySelector(".query-waiting");
  const noteLoadingElement =
    noteListContainerElement.querySelector(".search-loading");
  const noteListElement = noteListContainerElement.querySelector("note-list");
  const archivedListElement =
    noteListContainerElement.querySelector("archived-list");
  const modalAdd = document.getElementById("myModal");
  const addBtn = document.getElementById("addNoteButton");
  const span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  addBtn.onclick = function () {
    modalAdd.style.display = "block";
  };
  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modalAdd.style.display = "none";
  };
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modalAdd) {
      modalAdd.style.display = "none";
    }
  };

  const onSaveNote = async function (event) {
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;

    saveNote(title, body);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Your note has been saved",
      showConfirmButton: false,
      timer: 1500,
    });
    submitNoteFormElement.reset();
    modalAdd.style.display = "none";
    event.preventDefault();
    const result = await getAllNotes();
    displayResult(result);
  };

  const showNote = async function (query) {
    //
    showLoading();
    const result = await searchNote(query);
    if (result.length === 0) {
      Utils.hideElement(noteLoadingElement);
    } 
    displayResult(result);
    showNoteList();
  };

  const customValidationBodyHandler = (event) => {
    event.target.setCustomValidity("");

    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity("Wajib diisi.");
      return;
    }

    if (event.target.validity.tooShort) {
      event.target.setCustomValidity("Minimal panjang adalah enam karakter.");
      return;
    }
  };

  const onSearchHandler = (event) => {
    event.preventDefault();
    const { query } = event.detail;
    showNote(query);
  };

  const displayResult = (notes) => {
    const noteItemElements = notes.map((note) => {
      const noteItemElements = document.createElement("note-item");
      noteItemElements.note = note;
      return noteItemElements;
    });
    Utils.emptyElement(noteListElement);
    noteListElement.append(...noteItemElements);
  };

  const displayArchivedResult = (notes) => {
    const archivedItemElements = notes.map((note) => {
      const archivedItemElements = document.createElement("note-item");
      archivedItemElements.note = note;
      return archivedItemElements;
    });
    Utils.emptyElement(archivedListElement);
    archivedListElement.append(...archivedItemElements);
  };

  const showLoading = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteLoadingElement);
  };

  const showNoteList = () => {
    //
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteListElement);
  };

  const showQueryWaiting = async function () {
    const notes = await getAllNotes();
    displayResult(notes);
    console.log(notes);
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(noteQueryWaitingElement);
      Utils.hideElement(noteLoadingElement);
    });
    Utils.showElement(noteQueryWaitingElement);
  };

  const showArcivedNotes = async function () {
    const notes = await getArchivedNotes();
    displayArchivedResult(notes);
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(noteQueryWaitingElement);
      Utils.hideElement(noteLoadingElement);
    });
    Utils.showElement(noteQueryWaitingElement);
  };

  searchFormElement.addEventListener("search", onSearchHandler);
  submitNoteFormElement.addEventListener("submit", onSaveNote);

  noteTitleInput.addEventListener("change", customValidationBodyHandler);
  noteTitleInput.addEventListener("invalid", customValidationBodyHandler);

  noteTitleInput.addEventListener("blur", (event) => {
    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;
    const connectedValidationId = event.target.getAttribute("aria-describedby");
    const connectedValidationEl = connectedValidationId
      ? document.getElementById(connectedValidationId)
      : null;

    if (connectedValidationEl && errorMessage && !isValid) {
      connectedValidationEl.innerHTML =
        `<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>  <p class="validation-message" aria-live="polite">` +
        errorMessage +
        `</p>`;
      connectedValidationEl.style.display = "block";
    } else {
      connectedValidationEl.innerHTML = "";
      connectedValidationEl.style.display = "none";
    }
  });
  showQueryWaiting();
  showArcivedNotes();
};

export default home;
