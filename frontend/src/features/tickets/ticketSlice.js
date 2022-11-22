import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ticketService from './ticketService';
import { extractErrorMessage } from '../utils';

// Remove isLoading, isSuccess, isError, message state
// loading can be infered from presence or absence of tickets
// success can be infered from presence or absence of tickets
// error messages can be recieved at component level from AsynThunkAction
const initialState = {
  tickets: null,
  ticket: null,
};

// Create new ticket
export const createTicket = createAsyncThunk(
  'tickets/create',
  async (ticketData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ticketService.createTicket(ticketData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Get user tickets
export const getTickets = createAsyncThunk(
  'tickets/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ticketService.getTickets(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Get single user ticket
export const getTicket = createAsyncThunk(
  'tickets/get',
  async (ticketID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ticketService.getTicket(ticketID, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Close ticket
export const closeTicket = createAsyncThunk(
  'tickets/close',
  async (ticketID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ticketService.closeTicket(ticketID, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getTickets.pending, (state) => {
        // Clear single ticket on tickets page
        state.ticket = null;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.tickets = action.payload;
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.ticket = action.payload;
      })
      .addCase(closeTicket.fulfilled, (state, action) => {
        state.ticket = action.payload;
        state.tickets = state.tickets.map((ticket) =>
          ticket._id === action.payload._id ? action.payload : ticket
        );
      });
  },
});

export default ticketSlice.reducer;
