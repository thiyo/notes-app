  const baseUrl = "https://notes-api.dicoding.dev/v2";

  async function getAllNotes() {
    try {
      const response = await fetch(`${baseUrl}/notes`);
      const responseJson = await response.json();
      const notes = responseJson.data;

      if(!response.ok) {
        showResponseMessage("Gagal memuat catatan"+ responseJson.message)
      }
        return notes;
    } catch (error) {
      showResponseMessage(responseJson.message)
    }
  }

  async function saveNote(title, body) {
    const newNote = {
      title: title,
      body: body,
    };
    try {
      const response = await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });
      const responseJson = await response.json();
      if(!response.ok) {
        showResponseMessage("Gagal menyimpan catatan"+ responseJson.message)
      }
      return responseJson;

    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function deleteNote(id) {
    try {
      const response = await fetch(`${baseUrl}/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseJson = await response.json();
      if(!response.ok) {
        showResponseMessage("Gagal menghapus catatan"+ responseJson.message)
      }
      return responseJson;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function searchNote(query) {
    const notes = await getAllNotes();
    return notes.filter((note) => {
      const loweredCaseNoteName = (note.title || '-').toLowerCase();
      const jammedNoteName = loweredCaseNoteName.replace(/\s/g, '');
      const loweredCaseQuery = query.toLowerCase();
      const jammedQuery = loweredCaseQuery.replace(/\s/g, '');
      
      return jammedNoteName.indexOf(jammedQuery) !== -1;
    });
  }

const showResponseMessage = (message = 'Check your internet connection') => {
    alert(message);
  };

export default {getAllNotes, searchNote, saveNote, deleteNote};
