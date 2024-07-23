import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

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
                const formattedWatchId =
                    watchId.replace(/\s+/g, '_') + '_timeseries_forecast.json';
                const response = await fetch(`/${formattedWatchId}`);

                if (!response.ok) {
                    throw new Error(
                        'Network response for forecast data was not ok',
                    );
                }

                const forecastData: ForecastData[] = await response.json();
                const today = new Date().setHours(0, 0, 0, 0);
                const historicalPrices: number[] = [];
                const forecastedPrices: number[] = [];

                forecastData.forEach((entry) => {
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

    const historicalLabels = historicalData.map(
        (_, index) => `Day ${index + 1}`,
    );
    const forecastLabels = forecastData.map(
        (_, index) => `Day ${historicalData.length + index + 1}`,
    );

    const historicalDataset = {
        label: 'Historical Price',
        data: historicalData,
        borderColor: 'rgba(0, 0, 0, 1)',
        backgroundColor: '#76453B',
		fill: true, 
        borderWidth: 0.3,

    };

    const forecastDataset = {
        label: 'Forecasted Price',
        data: forecastData,
        borderColor: 'rgba(0, 0, 0, 1)',
        backgroundColor: '#5F8670',
        fill: true,
        borderWidth: 0.6,
    };

    const options = {
        scales: {
            x: {
                ticks: {
                    maxTicksLimit: 10,
                },
            },
            y: {
                ticks: {
                    maxTicksLimit: 5, 
                },
            },
        },
    };

    return (
        <div style={{ display: 'flex' }}>
            <div
                style={{
                    flex: 1,
                    height: '600px',
                    width: '800px',
                    marginRight: '20px',
                }}
            >
                <div style={{ width: '100%', height: '100%' }}>
                    <h2>Historical Price Data</h2>
                    <Line
                        data={{
                            labels: historicalLabels,
                            datasets: [historicalDataset],
                        }}
                        options={options}
                    />
                </div>
            </div>
            <div style={{ flex: 1, height: '600px', width: '800px' }}>
                <div style={{ width: '100%', height: '100%' }}>
                    <h2>Forecasted Price Data</h2>
                    <Line
                        data={{
                            labels: forecastLabels,
                            datasets: [forecastDataset],
                        }}
						options={options}
                    />
                </div>
            </div>
        </div>
    );
};

export default ForecastChart;
