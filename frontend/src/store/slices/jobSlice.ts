import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  employer: {
    _id: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    averageRating: number;
    totalReviews: number;
  };
  location: {
    address: {
      street?: string;
      city: string;
      state: string;
      zipCode?: string;
      country: string;
    };
    coordinates: {
      lat: number;
      lng: number;
    };
    isRemote: boolean;
  };
  budget: {
    amount: number;
    currency: string;
    type: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'fixed';
  };
  duration: 'one_time' | 'temporary' | 'permanent' | 'contract';
  startDate: string;
  endDate?: string;
  status: 'draft' | 'active' | 'paused' | 'filled' | 'cancelled' | 'expired';
  requirements: string[];
  skills: string[];
  featured: boolean;
  urgent: boolean;
  applicationsCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  isLoading: boolean;
  error: string | null;
  totalJobs: number;
  currentPage: number;
  totalPages: number;
  filters: {
    category?: string;
    location?: string;
    budget?: {
      min?: number;
      max?: number;
    };
    duration?: string;
    search?: string;
  };
}

const initialState: JobState = {
  jobs: [],
  currentJob: null,
  isLoading: false,
  error: null,
  totalJobs: 0,
  currentPage: 1,
  totalPages: 1,
  filters: {},
};

// Async thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params: {
    page?: number;
    limit?: number;
    category?: string;
    location?: string;
    search?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.category) queryParams.append('category', params.category);
      if (params.location) queryParams.append('location', params.location);
      if (params.search) queryParams.append('search', params.search);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch jobs');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch job');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<JobState['filters']>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Jobs
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.data.jobs;
        state.totalJobs = action.payload.data.total;
        state.currentPage = action.payload.data.page;
        state.totalPages = action.payload.data.pages;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Job by ID
    builder
      .addCase(fetchJobById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentJob = action.payload;
        state.error = null;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters, clearFilters, setCurrentPage } = jobSlice.actions;
export default jobSlice.reducer;