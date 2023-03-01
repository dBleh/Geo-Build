import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'


// Get User from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user ? user : null,
  sceneTitles: null,
  sceneObjs: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

export const getScene = createAsyncThunk(
  'auth/getscene',
  async(getReq,thunkAPI) => {
    try {
      return await authService.getScene(getReq)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)
export const sceneNames = createAsyncThunk(
  'auth/scenenames',
  async(userId, thunkAPI) => {
    try {
      return await authService.sceneNames(userId)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)
export const saveScene = createAsyncThunk(
  'auth/savescene',
  async(objs, thunkAPI) => {
    try {
      return await authService.saveScene(objs)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
        console.log(message)
      return thunkAPI.rejectWithValue(message)
    }
  }
)
// Register User
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      return await authService.register(user)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)
// Login user
export const login = createAsyncThunk(
    'auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout()
})
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
    removeEvent: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      }) 
      .addCase(sceneNames.pending, (state) => {
        state.isLoading = true
      })
      .addCase(sceneNames.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.sceneTitles = action.payload
      })
      .addCase(sceneNames.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.sceneTitles = null
      }) 
      .addCase(getScene.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getScene.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.sceneObjs = action.payload
      })
      .addCase(getScene.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.sceneObjs = null
      }) 
  },
})

export const { reset, removeEvent } = authSlice.actions
export default authSlice.reducer