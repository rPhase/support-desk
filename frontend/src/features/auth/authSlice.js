import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import authService from './authService';
import { extractErrorMessage } from '../utils';

// Get user from localstorage
const user = JSON.parse(localStorage.getItem('user'));

// Remove isSuccess, isError, message from state
// Can infer from presence or absence of user
// errors can be caught when unwrapping thunk
const initialState = {
  user,
  isLoading: false,
};

// Register new user
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

// Logout user (client side)
// does not need to be async
// createAction used instead of thunk
export const logout = createAction('auth/logout', () => {
  authService.logout();
  // return empty object as the payload
  // prepare function requires payload
  return {};
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        // reset state on pending
        state.user = null;
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.user = null;
        state.isLoading = false;
      })
      .addCase(login.pending, (state) => {
        // reset state on pending
        state.user = null;
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.isLoading = false;
      })
      .addCase(logout, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
