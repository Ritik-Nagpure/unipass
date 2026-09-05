import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Application } from '../shared/services/applications';

interface ApplicationsState {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ApplicationsState = {
  applications: [],
  isLoading: false,
  error: null,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.applications = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addApplication: (state, action: PayloadAction<Application>) => {
      state.applications.unshift(action.payload);
    },
    updateApplication: (state, action: PayloadAction<Application>) => {
      const index = state.applications.findIndex(
        (app) => app.id === action.payload.id
      );
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
    },
    removeApplication: (state, action: PayloadAction<string>) => {
      state.applications = state.applications.filter(
        (app) => app.id !== action.payload
      );
    },
    clearApplications: (state) => {
      state.applications = [];
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setApplications,
  addApplication,
  updateApplication,
  removeApplication,
  clearApplications,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;