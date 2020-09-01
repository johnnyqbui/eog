import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  formContainer: {
    display: 'inline',
    margin: '0 15px',
  },
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
  query {
    getMetrics
  }
`;

const getMetrics = (state: any) => state.metrics;

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};

const Metrics = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { metrics, selectedMetrics } = useSelector(getMetrics);
  const [result] = useQuery({ query });
  const { fetching, data, error } = result;

  const handleChange = (event: any) => {
    dispatch(actions.selectedMetric(event.target.value));
  };

  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch(actions.metricsReceived(getMetrics));
  }, [dispatch, data, error]);

  return (
    <Card>
      <CardHeader title="Metrics Selection" />
      <FormControl className={classes.formContainer} component="fieldset">
        {fetching ? (
          <LinearProgress />
        ) : (
          metrics.map((metric: string) => (
            <FormControlLabel
              key={metric}
              label={metric}
              value={metric}
              control={
                <Checkbox
                  color="primary"
                  checked={selectedMetrics.includes(metric)}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              labelPlacement="end"
            />
          ))
        )}
      </FormControl>
    </Card>
  );
};
