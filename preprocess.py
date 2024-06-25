import pandas as pd
import matplotlib.pyplot as plt

# Load the dataset (adjust the path as per your file location)
data = pd.read_csv('Watches.csv')

# Select the first 10 rows
data_subset = data.head(10).copy()  # Ensure a copy to avoid SettingWithCopyWarning

# Convert 'Price_old' and 'Price_new' to numeric format using .loc
data_subset.loc[:, 'Price_old'] = data_subset['Price_old'].replace(r'[\$,]', '', regex=True).astype(float)
data_subset.loc[:, 'Price_new'] = data_subset['Price_new'].replace(r'[\$,]', '', regex=True).astype(float)

# Calculate discount as a percentage
data_subset.loc[:, 'Discount'] = ((data_subset['Price_old'] - data_subset['Price_new']) / data_subset['Price_old'] * 100).round(1)

# Sort data by 'Price_old' ascending
data_subset_sorted = data_subset.sort_values(by='Price_old').reset_index(drop=True)

# Print the first row to verify
print(data_subset_sorted.iloc[0])


# Plotting the first 10 rows
plt.figure(figsize=(12, 8))

# Plot current price ('Price_old') with dots and line
plt.plot(data_subset_sorted.index, data_subset_sorted['Price_old'], marker='o', markersize=10, label='Current Price', linestyle='-', color='b')

# Plot discounted price ('Price_new') with dots and line
plt.plot(data_subset_sorted.index, data_subset_sorted['Price_new'], marker='x', markersize=10, label='Discounted Price', linestyle='-', color='r')

# Connect the dots for both current and discounted prices
plt.plot(data_subset_sorted.index, data_subset_sorted['Price_old'], linestyle='-', color='b')
plt.plot(data_subset_sorted.index, data_subset_sorted['Price_new'], linestyle='-', color='r')

# Annotate each dot with the watch title and prices
for i, (title, price_old, price_new) in enumerate(zip(data_subset_sorted['Title'], data_subset_sorted['Price_old'], data_subset_sorted['Price_new'])):
    plt.text(i, price_old, f'{title}\n${price_old:.2f}', ha='center', va='bottom', fontsize=10, color='b')
    plt.text(i, price_new, f'${price_new:.2f}', ha='center', va='top', fontsize=10, color='r')

# Set plot labels and title
plt.xticks(range(len(data_subset_sorted)), data_subset_sorted['Title'], rotation=90)
plt.title('Current vs Discounted Prices (First 10 Rows)')
plt.xlabel('Watch Model')
plt.ylabel('Price (USD)')
plt.legend()
plt.tight_layout()
plt.grid(True)

# Save the plot as an image
plt.savefig('plot.png')
plt.close()