import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import annotationPlugin, { AnnotationOptions, LabelOptions } from 'chartjs-plugin-annotation';

interface ForecastData {
  ds: number;
  yhat: number;
}

interface ForecastChartProps {
  watchId?: string;
}

const ForecastChart: React.FC<ForecastChartProps> = ({ watchId }) => {
  const [historicalData, setHistoricalData] = useState<number[]>([]);
  const [forecastData, setForecastData] = useState<number[]>([]);

  useEffect(() => {
    if (!watchId) {
      return;
    }

    const fetchForecastData = async () => {
      try {
        const formattedWatchId = watchId.replace(/\s+/g, '_') + '_timeseries_forecast.json';
        const response = await fetch(`/${formattedWatchId}`);

        if (!response.ok) {
          throw new Error('Network response for forecast data was not ok');
        }

        const forecastData: ForecastData[] = await response.json();
        const today = new Date().setHours(0, 0, 0, 0);
        const historicalPrices: number[] = [];
        const forecastedPrices: number[] = [];

        forecastData.forEach(entry => {
          const date = new Date(entry.ds).getTime();
          if (date <= today) {
            historicalPrices.push(entry.yhat);
          } else {
            forecastedPrices.push(entry.yhat);
          }
        });

        setHistoricalData(historicalPrices);
        setForecastData(forecastedPrices);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      }
    };

    fetchForecastData();
  }, [watchId]);

  if (!watchId) {
    return <div>Loading...</div>;
  }

  const historicalLabels = historicalData.map((_, index) => `Day ${index + 1}`);
  const forecastLabels = forecastData.map((_, index) => `Day ${historicalData.length + index + 1}`);

  const historicalDataset = {
    label: 'Historical Price',
    data: historicalData,
    borderColor: 'rgba(0, 0, 0, 1)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    fill: true,
    borderWidth: 1,
    tension: 0.4 // Add tension to the line for a smoother curve (optional)
  };

  const forecastDataset = {
    label: 'Forecasted Price',
    data: forecastData,
    borderColor: 'rgba(75, 192, 192, 1)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    fill: true,
    borderWidth: 1,
    tension: 0.4 // Add tension to the line for a smoother curve (optional)
  };

  const options = {
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            xMin: new Date().toLocaleDateString(),
            xMax: new Date().toLocaleDateString(),
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 2,
            label: {
              content: 'Today',
              position: 'top'
            } as LabelOptions // Specify type explicitly for label options
          }
        } as Record<string, AnnotationOptions<'line' | 'label'>> // Ensure correct annotation options type
      }
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10 // Limit the maximum number of ticks on the x-axis
        }
      },
      y: {
        ticks: {
          maxTicksLimit: 5 // Limit the maximum number of ticks on the y-axis
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, height: '600px', width: '800px', marginRight: '20px' }}>
        <div style={{ width: '100%', height: '100%' }}>
          <h2>Historical Price Data</h2>
          <Line data={{ labels: historicalLabels, datasets: [historicalDataset] }} options={options} />
        </div>
      </div>
      <div style={{ flex: 1, height: '600px', width: '800px' }}>
        <div style={{ width: '100%', height: '100%' }}>
          <h2>Forecasted Price Data</h2>
          <Line data={{ labels: forecastLabels, datasets: [forecastDataset] }} options={{ scales: { x: { ticks: { maxTicksLimit: 10 } } } }} />
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;
