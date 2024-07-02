import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from prophet import Prophet
import json
import os

# Directory containing the time series data CSV files
input_dir = './watch_timeseries_data'

# Directory where the forecast JSON files will be saved
output_dir = os.path.join('..', 'watch-prices-app', 'public')
os.makedirs(output_dir, exist_ok=True)

# Function to process each CSV file and create a forecast
def create_forecast(csv_file):
    # Load the data
    df = pd.read_csv(csv_file)

    # Ensure the 'Date' column is parsed as datetime
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')

    # Preprocess the data
    df = df.sort_values('Date')
    df.rename(columns={'Price_old': 'y', 'Date': 'ds'}, inplace=True)
    df = df[['ds', 'y']]
    df = df.dropna()  # Drop rows with missing values

    # Create and fit Prophet model
    model = Prophet()
    model.fit(df)

    # Make future predictions
    future = model.make_future_dataframe(periods=100)  # Forecast for 1 year
    forecast = model.predict(future)

    # Generate a safe filename for the JSON output
    base_filename = os.path.basename(csv_file)
    output_filename = base_filename.replace('.csv', '_forecast.json')
    output_file = os.path.join(output_dir, output_filename)

    # Save forecast to JSON
    forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_json(output_file, orient='records')

    # Optional: Plot the forecast
    fig = model.plot(forecast)
    plt.title(f'Forecast for {base_filename}')
    plt.xlabel('Date')
    plt.ylabel('Price')

    # Optional: Plot components (trend, weekly seasonality, yearly seasonality)
    fig = model.plot_components(forecast)

# Iterate over all CSV files in the input directory and create forecasts
for file_name in os.listdir(input_dir):
    if file_name.endswith('.csv'):
        csv_file = os.path.join(input_dir, file_name)
        create_forecast(csv_file)
