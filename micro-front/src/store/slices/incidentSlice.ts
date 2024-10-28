import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance, { setAuthToken } from "../actionAxios";
import { RootState } from "../store";
import { ReactNode } from "react";

export interface IIncident {
  createdBy: ICreatedBy;
  _id?: string;
  type: string;
  description: IDescriptionIncident;
  date: string;
  employees: IEmployeeQuality[];
  jobPosition: IJobPosition;
  user?: string;
}

interface ICreatedBy {
  _id: string;
  username: string;
}

interface IJobPosition {
  _id: string;
  name: string;
}

export interface IDescriptionIncident {
  details?: string;
  isApprehended?: boolean;
  ethylBreath?: boolean;
  alcoholTest?: number;
  weaponSeizure?: boolean;
  chalecoSeizure?: boolean;
  credentialSeizure?: boolean;
}

export interface IEmployeeQuality {
  _id?: string;
  id: string,
  name?: ReactNode;
  employee?: {
    name?: string;
    cuil?: string;
    hierarchy?: { name?: string; }[];
  }
  isCivil: boolean;
  nameOrDni: string;
  quality: string;
}

export interface IncidentsState {
  incidents: IIncident[];
  loading: boolean;
  error: string | null;
  status: string;
}

const initialState: IncidentsState = {
  incidents: [],
  loading: false,
  error: null,
  status: '',
};

export const fetchEmployeesByNameOrDni = createAsyncThunk(
  'incidents/fetchEmployeesByNameOrDni',
  async (searchTerm: string, { getState }) => {
    const state = getState() as { auth: { token: string } };
    try {
      const response = await axiosInstance.get(`/incidents/search?namesOrDnis=${searchTerm}`, {
        headers: { Authorization: `Bearer ${state.auth.token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }
);

export const fetchIncidents = createAsyncThunk(
  'incidents/fetchIncidents',
  async (_, { getState }) => {
    const state = getState() as RootState;
    try {
      const token = state.auth.token;
      setAuthToken(token);
      const response = await axiosInstance.get('/incidents');
      return response.data;
    } catch (error: any) {
      return Promise.reject(error.message);
    }
  }
);

export const createIncident = createAsyncThunk(
  'incidents/createIncident',
  async (incident: IIncident, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    try {
      const token = state.auth.token;
      setAuthToken(token);
      const response = await axiosInstance.post('/incidents', incident);
      if (response.data.error) {
        return rejectWithValue(response.data.error);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteIncident = createAsyncThunk(
  'incidents/deleteIncident',
  async (id: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    try {
      const token = state.auth.token;
      setAuthToken(token);
      const response = await axiosInstance.delete(`/incidents/${id}`);
      if (response.data.error) {
        return rejectWithValue(response.data.error);
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateIncident = createAsyncThunk(
  'incidents/updateIncident',
  async (incident: IIncident) => {
    const response = await axiosInstance.put(`/incidents/${incident._id}`, incident);
    return response.data;
  }
);

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false;
        state.incidents = action.payload;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching incidents';
      })
      .addCase(createIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIncident.fulfilled, (state, action) => {
        state.loading = false;
        state.incidents.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(createIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = 'failed';
      })
      .addCase(deleteIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIncident.fulfilled, (state, action) => {
        state.loading = false;
        state.incidents = state.incidents.filter(incident => incident._id !== action.payload);
      })
      .addCase(deleteIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error deleting incident';
      })
      .addCase(updateIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIncident.fulfilled, (state, action) => {
        state.incidents = state.incidents.map((incident) => {
          if (incident._id?.toString() === action.payload._id.toString()) {
            return action.payload;
          }
          return incident;
        });
        state.loading = false;
        state.status = 'success';
      })
      .addCase(updateIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error updating incident';
      })
      // .addCase(fetchEmployeesByNameOrDni.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(fetchEmployeesByNameOrDni.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.error = null;
      //   state.incidents = action.payload;
      // })
      // .addCase(fetchEmployeesByNameOrDni.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string || 'Error fetching employees';
      // });
  },
});

export default incidentsSlice.reducer;