import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    category: string;
    budget: {
      amount: number;
      currency: string;
      type: string;
    };
  };
  applicant: {
    _id: string;
    firstName: string;
    lastName: string;
    averageRating: number;
  };
  employer: {
    _id: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  };
  status: 'pending' | 'viewed' | 'shortlisted' | 'interview' | 'hired' | 'rejected' | 'withdrawn';
  coverLetter?: string;
  proposedRate?: {
    amount: number;
    currency: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ApplicationState {
  applications: Application[];
  currentApplication: Application | null;
  isLoading: boolean;
  error: string | null;
  totalApplications: number;
  currentPage: number;
  totalPages: number;
}

const initialState: ApplicationState = {
  applications: [],
  currentApplication: null,
  isLoading: false,
  error: null,
  totalApplications: 0,
  currentPage: 1,
  totalPages: 1,
};

// Async thunks
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.status) queryParams.append('status', params.status);

      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch applications');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const applyToJob = createAsyncThunk(
  'applications/applyToJob',
  async (applicationData: {
    jobId: string;
    coverLetter?: string;
    proposedRate?: {
      amount: number;
      currency: string;
      type: string;
    };
  }, { rejectWithValue }) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to apply to job');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Applications
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload.data.applications;
        state.totalApplications = action.payload.data.total;
        state.currentPage = action.payload.data.page;
        state.totalPages = action.payload.data.pages;
        state.error = null;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Apply to Job
    builder
      .addCase(applyToJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.unshift(action.payload);
        state.error = null;
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = applicationSlice.actions;
export default applicationSlice.reducer;