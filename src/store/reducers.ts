import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricsReducer } from '../Features/MetricsSelection/reducer';

export default {
  weather: weatherReducer,
  metrics: metricsReducer,
};
