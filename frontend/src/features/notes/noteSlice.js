import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import noteService from './noteService';
import { extractErrorMessage } from '../utils';

// Removed isLoading, isSuccess and reset
// loading can be infered from presence or absence of data
// success can be infered from presence or absence of error
const initialState = {
  notes: [],
  isError: false,
  message: '',
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
        state.notes = [];
        state.isError = false;
        state.message = '';
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.push(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default noteSlice.reducer;
