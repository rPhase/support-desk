import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import noteService from './noteService';
import { extractErrorMessage } from '../utils';

// Removed isLoading, isSuccess, isError, message, and reset
// loading can be infered from presence or absence of notes
// success can be infered from presence or absences of notes
// error messages can be recieved at component level from AsynThunkAction
const initialState = {
  notes: null,
};

// Get ticket notes
export const getNotes = createAsyncThunk(
  'notes/getAll',
  async (ticketID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await noteService.getNotes(ticketID, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Create ticket note
export const createNote = createAsyncThunk(
  'notes/create',
  async ({ noteText, ticketID }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await noteService.createNote(noteText, ticketID, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        // Reset notes to null to show spinner while fetching
        state.notes = null;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.push(action.payload);
      });
  },
});

export default noteSlice.reducer;
