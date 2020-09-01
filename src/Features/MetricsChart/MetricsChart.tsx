import React from 'react';
import { useSelector } from 'react-redux';
import { Provider, createClient, useQuery } from 'urql';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';

import { ResponsiveLine } from '@nivo/line';

const useStyles = makeStyles({
  chartHeight: {
    height: 500,
  },
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
  query($input: [MeasurementQuery!]) {
    getMultipleMeasurements(input: $input) {
      metric
      measurements {
        metric
        at
        value
        unit
      }
    }
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
  const { selectedMetrics } = useSelector(getMetrics);

  const metricInput = selectedMetrics.map((selectedMetric: string) => ({
    metricName: selectedMetric,
  }));

  const [result] = useQuery({
    query,
    variables: {
      input: metricInput,
    },
  });
  const { data } = result;
  const chartData = data
    ? data.getMultipleMeasurements.map((metricMeasurement: any) => ({
        id: metricMeasurement.metric,
        color: 'hsl(257, 70%, 50%)',
        data: metricMeasurement.measurements.map((measurements: any) => {
          return {
            x: moment(measurements.at).format('hh:mm:ss'), // time,
            y: measurements.value,
          };
        }),
      }))
    : [];

  console.log({ chartData });
  return (
    <Card className={classes.chartHeight} raised={true}>
      <CardHeader title="Metrics Chart" />
      <ResponsiveLine
        data={chartData}
        margin={{ top: 50, right: 150, bottom: 200, left: 60 }}
        xFormat="time:%X"
        xScale={{ type: 'time', format: '%I:%M:%S' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendOffset: 36,
          legendPosition: 'middle',
          format: '%I:%M',
          tickValues: 'every 15 minutes',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        colors={{ scheme: 'nivo' }}
        lineWidth={1}
        enablePoints={false}
        enableCrosshair={true}
        useMesh={true}
        animate={false}
        enableSlices="x"
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </Card>
  );
};
