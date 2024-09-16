import Utils from '../utils.js';
import Notes from '../data/api/notes.js';

const home = () => {
  const searchFormElement = document.querySelector('search-bar');
  const submitNoteFormElement = document.getElementById('addNote');
  const noteTitleInput = submitNoteFormElement.elements.title;
  const noteListContainerElement = document.querySelector('#noteListContainer');
  const noteQueryWaitingElement = noteListContainerElement.querySelector('.query-waiting');
  const noteLoadingElement = noteListContainerElement.querySelector('.search-loading');
  const noteListElement = noteListContainerElement.querySelector('note-list');
  const modal = document.getElementById("myModal");
  const addBtn = document.getElementById("addNoteButton");
  const span = document.getElementsByClassName("close")[0];
  // When the user clicks the button, open the modal 
addBtn.onclick = function() {
  modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

  const onSaveNote = async function(event) {
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;

    Notes.saveNote( title, body);
    submitNoteFormElement.reset();
    modal.style.display = "none";
    event.preventDefault();
    const result = await Notes.getAllNotes();
    displayResult(result);
  }



  const showNote = async function(query) {//
    showLoading();
      const result = await Notes.searchNote(query);
      if(result.length === 0) {
        Utils.hideElement(noteLoadingElement);
      }
      displayResult(result);
      showNoteList();
  };

  const customValidationBodyHandler = (event) => {
    event.target.setCustomValidity('');
  
    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity('Wajib diisi.');
      return;
    }
  
    if (event.target.validity.tooShort) {
      event.target.setCustomValidity('Minimal panjang adalah enam karakter.');
      return;
    }
  };

  const onSearchHandler = (event) => {
    event.preventDefault();
    const {query} = event.detail;
    showNote(query);
  }


  const displayResult = (notes) => {
    const noteItemElements = notes.map((note) => {
      const noteItemElements = document.createElement('note-item');
      noteItemElements.note = note;
      return noteItemElements;
    });
    Utils.emptyElement(noteListElement);
    noteListElement.append(...noteItemElements);
  };

  const showLoading = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteLoadingElement);
  };

  const showNoteList = () => {//
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteListElement);
  };
  
  const showQueryWaiting = async function() {
    const notes =  await Notes.getAllNotes();
    displayResult(notes);
    console.log(notes);
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(noteQueryWaitingElement);
      Utils.hideElement(noteLoadingElement);
    });
    Utils.showElement(noteQueryWaitingElement);
  };


  searchFormElement.addEventListener('search', onSearchHandler); 
  submitNoteFormElement.addEventListener('submit', onSaveNote); 
  
  noteTitleInput.addEventListener('change', customValidationBodyHandler);
  noteTitleInput.addEventListener('invalid', customValidationBodyHandler);

  noteTitleInput.addEventListener('blur', (event) => {
    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;
    const connectedValidationId = event.target.getAttribute('aria-describedby');
    const connectedValidationEl = connectedValidationId
      ? document.getElementById(connectedValidationId)
      : null;

    if (connectedValidationEl && errorMessage && !isValid) {
      connectedValidationEl.innerHTML= `<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>  <p class="validation-message" aria-live="polite">` + errorMessage + `</p>`;
      connectedValidationEl.style.display = 'block';
    } else {
      connectedValidationEl.innerHTML = '';
      connectedValidationEl.style.display = 'none';
    }
    });
  showQueryWaiting();
};

export default home;
