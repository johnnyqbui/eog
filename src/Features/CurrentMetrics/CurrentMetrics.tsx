import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { actions } from './reducer';
import { Provider, createClient, defaultExchanges, subscriptionExchange, useSubscription } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '../../components/Chip';
import { IState } from '../../store';
import { any } from 'prop-types';

const subscriptionClient = new SubscriptionClient('wss://react.eogresources.com/graphql', { reconnect: true });

const client = createClient({
  url: '/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        return subscriptionClient.request(operation);
      },
    }),
  ],
});

const query = `
  subscription {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;

const getSelectedMetrics = (state: IState) => {
  const { selectedMetrics } = state.metrics;
  return {
    selectedMetrics,
  };
};

export default () => {
  return (
    <Provider value={client}>
      <CurrentMetrics />
    </Provider>
  );
};

const CurrentMetrics = () => {
  const { selectedMetrics } = useSelector(getSelectedMetrics);

  const [result] = useSubscription({ query }, (measurements = {}, response: any) => {
    measurements[response.newMeasurement.metric] = { ...response.newMeasurement };
    return measurements;
  });
  console.log({ selectedMetrics });

  const { data } = result;
  console.log({ data });
  return (
    <Card>
      <CardHeader title="Current Metric Measurements" />
      {selectedMetrics.map(selectedMetric => (
        <CardContent>
          <Typography variant="body1">
            {data[selectedMetric].metric} - {data[selectedMetric].value}
          </Typography>
        </CardContent>
      ))}
    </Card>
  );
};
