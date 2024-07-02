import pandas as pd
import numpy as np
import random
import datetime
import os

def generate_random_price_series(base_price, num_days, fluctuation_range=50):
    """Generate a random price series for a given number of days with larger price fluctuations."""
    return [round(base_price + random.uniform(-fluctuation_range, fluctuation_range), 2) for _ in range(num_days)]

def create_timeseries_dataframe(csv_file, num_days=730, fluctuation_range=50):
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
        random_prices = generate_random_price_series(base_price, num_days + 1, fluctuation_range)  # Ensure same length as date_range

        # Create a DataFrame for the current watch's timeseries
        watch_timeseries = pd.DataFrame({
            'Date': date_range,
            'Title': row['Title'],
            'Price_old': random_prices
        })

        # Save the DataFrame to the dictionary
        watch_title = row['Title'].replace(' ', '_').replace('/', '_')  # Clean the title for filename
        timeseries_data[watch_title] = watch_timeseries

    return timeseries_data

# Define the path to your input CSV file
csv_file_path = './Watches.csv'

# Create the timeseries DataFrames for each watch with larger price fluctuations over 2 years
timeseries_data = create_timeseries_dataframe(csv_file_path, num_days=730, fluctuation_range=100)

# Create output directory if it doesn't exist
output_dir = 'watch_timeseries_data'
os.makedirs(output_dir, exist_ok=True)

# Save each timeseries DataFrame to a separate CSV file
for watch_title, watch_timeseries in timeseries_data.items():
    output_csv_file = os.path.join(output_dir, f'{watch_title}_timeseries.csv')
    watch_timeseries.to_csv(output_csv_file, index=False)
