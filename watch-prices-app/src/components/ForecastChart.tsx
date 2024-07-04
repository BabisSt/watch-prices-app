import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface ForecastData {
    ds: number;
    yhat: number;
}

interface ForecastChartProps {
    watchId?: string; // Make watchId prop optional
}

const ForecastChart: React.FC<ForecastChartProps> = ({ watchId }) => {
    const [chartData, setChartData] = useState({
        labels: [] as string[], // Initialize labels as an empty string array
        datasets: [
            {
                label: 'Forecasted Price',
                data: [] as number[], // Initialize data as an empty number array
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    });

    useEffect(() => {
        // Ensure watchId is defined before fetching data
        if (!watchId) {
            return;
        }

        const fetchForecastData = async () => {
            try {
                // Construct the filename with the correct format
                const fileName = `${watchId.replace(/ /g, '_')}_timeseries_forecast.json`;
                const response = await fetch(`/public/${fileName}`); // Adjust the path as per your public directory structure

                console.log(fileName);
                if (!response.ok) {
                    throw new Error('Network response for forecast data was not ok');
                }

                const forecastData: ForecastData[] = await response.json();

                // Process forecastData and update chartData
                const labels = forecastData.map(entry => new Date(entry.ds).toLocaleDateString());
                const prices = forecastData.map(entry => entry.yhat);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Forecasted Price',
                            data: prices,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: true,
                        },
                    ],
                });

            } catch (error) {
                console.error('Error fetching forecast data:', error);
            }
        };

        fetchForecastData();
    }, [watchId]);

    if (!watchId) {
        return <div>Loading...</div>; // Handle case where watchId is undefined
    }

    return (
        <div>
            <h2>Watch Price Forecast</h2>
            <Line data={chartData} />
        </div>
    );
};

export default ForecastChart;
