import pandas as pd
import numpy as np
import random
import datetime

def generate_random_price_series(base_price, num_days):
    """Generate a random price series for a given number of days."""
    return [round(base_price + random.uniform(-10, 10), 2) for _ in range(num_days)]

def create_timeseries_dataframe(csv_file):
    # Read the CSV file
    df = pd.read_csv(csv_file)

    # Number of days for the timeseries
    num_days = 30
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(days=num_days)
    date_range = pd.date_range(start=start_date, end=end_date)

    # Create an empty DataFrame to store the timeseries data
    timeseries_data = pd.DataFrame()

    for index, row in df.iterrows():
        # Extract base old price and remove any dollar signs or commas
        base_price = float(row['Price_old'].replace('$', '').replace(',', ''))
        random_prices = generate_random_price_series(base_price, num_days + 1)  # Ensure same length as date_range

        # Create a DataFrame for the current watch's timeseries
        watch_timeseries = pd.DataFrame({
            'Date': date_range,
            'Title': row['Title'],
            'Price_old': random_prices
        })

        # Append to the main timeseries DataFrame
        timeseries_data = pd.concat([timeseries_data, watch_timeseries], ignore_index=True)

    return timeseries_data

# Define the path to your input CSV file
csv_file_path = './Watches.csv'

# Create the timeseries DataFrame
timeseries_df = create_timeseries_dataframe(csv_file_path)

# Save the timeseries DataFrame to a new CSV file
output_csv_file = 'watch_prices_timeseries.csv'
timeseries_df.to_csv(output_csv_file, index=False)

print(f"Timeseries data saved to {output_csv_file}")
