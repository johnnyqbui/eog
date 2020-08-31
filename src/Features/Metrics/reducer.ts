import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Metrics = {
  metrics: Array<string>
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metrics: [],
  selectedMetrics: []
}

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    selectedMetric: (state: any, action: any) => {
      const { selectedMetrics } = state;
      const isMetricSelected = selectedMetrics.includes(action.payload)
      console.log(action.payload, isMetricSelected)
      if (isMetricSelected) {
        const filtered = selectedMetrics.filter((selectedMetric: string) => selectedMetric !== action.payload)
        console.log({ filtered })
        return {
          ...state,
          selectedMetrics: filtered
        }
      } else {
        state.selectedMetrics.push(action.payload)
      }
    },
    metricsReceived: (state, action: any) => {
      state.metrics = action.payload;
    },
    metricsApiErrorReceived: (state, action) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
