import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dropout, Dense, Input

def create_dataset(data, time_step=60):
    """Create X, y datasets."""
    X, y = [], []
    for i in range(time_step, len(data)):
        X.append(data[i-time_step:i, 0])
        y.append(data[i, 0])
    return np.array(X), np.array(y)

def train_and_predict(csv_file):
    # Load the timeseries data
    df = pd.read_csv(csv_file)

    # Convert 'Date' column to datetime
    df['Date'] = pd.to_datetime(df['Date'])

    # Ensure the data is sorted by Date
    df.sort_values('Date', inplace=True)

    # Prepare the dataset
    df.set_index('Date', inplace=True)
    df.drop(['Title'], axis=1, inplace=True)

    # Feature Scaling
    sc = MinMaxScaler(feature_range=(0, 1))
    scaled_data = sc.fit_transform(df)

    # Split into training and test sets
    train_size = int(len(scaled_data) * 0.8)
    train_data = scaled_data[:train_size]
    test_data = scaled_data[train_size:]

    # Create datasets
    time_step = 60
    X_train, y_train = create_dataset(train_data, time_step)
    X_test, y_test = create_dataset(test_data, time_step)

    # Debugging: Print shapes to diagnose the issue
    print("X_train shape:", X_train.shape)
    print("X_test shape:", X_test.shape)

    # Reshape data to be 3-dimensional
    X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))
    X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

    # Debugging: Print shapes after reshaping
    print("X_train reshaped:", X_train.shape)
    print("X_test reshaped:", X_test.shape)

    # Building the LSTM model
    model = Sequential()
    model.add(Input(shape=(X_train.shape[1], 1)))  # Correct input shape definition
    model.add(LSTM(units=50, return_sequences=True))
    model.add(Dropout(0.5))
    model.add(LSTM(units=50, return_sequences=True))
    model.add(Dropout(0.5))
    model.add(LSTM(units=50, return_sequences=True))
    model.add(Dropout(0.5))
    model.add(LSTM(units=50, return_sequences=False))  # Last LSTM layer with return_sequences=False
    model.add(Dropout(0.5))
    model.add(Dense(units=1))

    # Compiling the model
    model.compile(optimizer='adam', loss='mean_squared_error')

    # Fitting the model
    model.fit(X_train, y_train, epochs=20, batch_size=1)

    # Predicting on test data
    predicted_prices = model.predict(X_test)
    predicted_prices = np.reshape(predicted_prices, (predicted_prices.shape[0], 1))  # Reshape to 2D
    predicted_prices = sc.inverse_transform(predicted_prices)

    # Visualizing the results
    plt.figure(figsize=(20, 10))
    plt.plot(df.index[train_size+time_step:], df.iloc[train_size+time_step:, 0], color='red', label='Real Price')
    plt.plot(df.index[train_size+time_step:], predicted_prices, color='blue', label='Predicted Price')
    plt.xlabel('Time')
    plt.ylabel('Price')
    plt.legend()
    plt.show()

# Specify the path to your CSV file
csv_file = 'watch_timeseries_data/Couturier_Automatic_Black_Dial_Watch_T0354073605101_timeseries.csv'

train_and_predict(csv_file)
