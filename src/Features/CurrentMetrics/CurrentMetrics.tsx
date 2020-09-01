import React from 'react';
import { useSelector } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { Provider, createClient, defaultExchanges, subscriptionExchange, useSubscription } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { IState } from '../../store';

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

  const { data } = result;
  return (
    <Card raised={true}>
      <CardHeader title="Current Metric Measurements" />
      <CardContent>
        {!data ? (
          <LinearProgress />
        ) : (
          selectedMetrics.map(selectedMetric => (
            <Typography key={selectedMetric} variant="body1">
              {data[selectedMetric].metric}: {data[selectedMetric].value}
            </Typography>
          ))
        )}
      </CardContent>
    </Card>
  );
};
