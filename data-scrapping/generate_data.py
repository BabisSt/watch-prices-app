import pandas as pd
import numpy as np
import random
import datetime
import os
import re

def generate_organic_price_series(base_price, num_days, fluctuation_range=5, inflation_rate=0.0001):
    """Generate a price series for a given number of days with a steady increase due to inflation."""
    prices = []
    current_price = base_price
    for _ in range(num_days):
        # Apply a daily inflation rate
        current_price *= (1 + inflation_rate)
        # Add some random fluctuation
        current_price += random.uniform(-fluctuation_range, fluctuation_range)
        # Append the rounded price to the list
        prices.append(round(current_price, 2))
    return prices

def create_timeseries_dataframe(csv_file, num_days=730, fluctuation_range=5, inflation_rate=0.0001):
    # Read the CSV file
    df = pd.read_csv(csv_file)

    # Define the date range for the timeseries
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(days=num_days)
    date_range = pd.date_range(start=start_date, end=end_date)

    # Create an empty dictionary to store the timeseries data for each watch
    timeseries_data = {}

    for index, row in df.iterrows():
        # Extract base old price and remove any dollar signs or commas
        base_price = float(row['Price_old'].replace('$', '').replace(',', ''))
        organic_prices = generate_organic_price_series(base_price, num_days + 1, fluctuation_range, inflation_rate)  # Ensure same length as date_range

        # Create a DataFrame for the current watch's timeseries
        watch_timeseries = pd.DataFrame({
            'Date': date_range,
            'Title': row['Title'],
            'Price_old': organic_prices
        })

        # Save the DataFrame to the dictionary
        # Clean the title for filename by removing invalid characters
        watch_title = re.sub(r'[<>:"/\\|?*]', '_', row['Title'])
        watch_title = watch_title.replace(' ', '_')
        timeseries_data[watch_title] = watch_timeseries

    return timeseries_data

# Define the path to your input CSV file
csv_file_path = './Watches.csv'

# Create the timeseries DataFrames for each watch with more organic price increases over 2 years
timeseries_data = create_timeseries_dataframe(csv_file_path, num_days=730, fluctuation_range=5, inflation_rate=0.0001)

# Create output directory if it doesn't exist
output_dir = 'watch_timeseries_data'
os.makedirs(output_dir, exist_ok=True)

# Save each timeseries DataFrame to a separate CSV file
for watch_title, watch_timeseries in timeseries_data.items():
    output_csv_file = os.path.join(output_dir, f'{watch_title}_timeseries.csv')
    watch_timeseries.to_csv(output_csv_file, index=False)
