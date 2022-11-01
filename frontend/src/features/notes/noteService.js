import axios from 'axios';

const API_URL = '/api/tickets';

// Get ticket notes
const getNotes = async (ticketID, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(API_URL + `/${ticketID}/notes`, config);

  return res.data;
};

// Create ticket note
const createNote = async (noteText, ticketID, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(
    API_URL + `/${ticketID}/notes`,
    { text: noteText },
    config
  );

  return res.data;
};

const noteService = { getNotes, createNote };

export default noteService;
