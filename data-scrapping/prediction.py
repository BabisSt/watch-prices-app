import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from prophet import Prophet

# Step 1: Load the Data
df = pd.read_csv('./watch_timeseries_data/PRX_Powermatic_80_Automatic_Blue_Dial_Mens_Watch_T137.407.11.041.00_timeseries.csv')

# Ensure the 'Date' column is parsed as datetime
df['Date'] = pd.to_datetime(df['Date'], errors='coerce')

# Step 2: Preprocess the Data
df = df.sort_values('Date')
df.rename(columns={'Price_old': 'y', 'Date': 'ds'}, inplace=True)
df = df[['ds', 'y']]
df = df.dropna()  # Drop rows with missing values

# Step 3: Create and Fit Prophet Model
model = Prophet()
model.fit(df)

# Step 4: Make Future Predictions
future = model.make_future_dataframe(periods=100)  # Forecast for 1 year
forecast = model.predict(future)

# Step 5: Plot the Forecast
fig = model.plot(forecast)
plt.title('Watch Price Forecast using Prophet')
plt.xlabel('Date')
plt.ylabel('Price')
plt.show()

# Optional: Plot components (trend, weekly seasonality, yearly seasonality)
fig = model.plot_components(forecast)
plt.show()
