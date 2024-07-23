# Watch Prices App

Welcome to the Watch Prices App! This is an experimental project aimed at exploring and learning new technologies. The app allows users to view watch details and analyze price forecasts with interactive charts.

## Project Overview

The Watch Prices App fetches watch data from a CSV file, displays detailed information about individual watches, and provides interactive charts showing historical and forecasted prices. The application includes a feature to view images in a modal dialog, as well as links to external sources for further details. The project also includes functionality for scraping watch data from a website, generating time series data, and making price predictions.

## Technologies and Libraries Used

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript that adds static types.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Bootstrap**: A popular CSS framework for responsive design.
- **Chart.js**: A JavaScript library for creating interactive charts and graphs.
- **Chart.js Plugin Annotation**: A plugin for Chart.js to add annotations to charts.
- **Papa Parse**: A powerful CSV parser for JavaScript.
- **Material-UI**: A React component library that implements Google's Material Design.
- **PostCSS**: A tool for transforming CSS with JavaScript plugins.
- **Pandas**: A data analysis and manipulation library for Python.
- **Prophet**: A forecasting tool for time series data developed by Facebook.
- **Puppeteer**: A Node.js library for web scraping and browser automation.

## Installation

Follow these steps to set up and run the project on your local machine:

**Clone the Repository**

   ```
   git clone https://github.com/your-username/watch-prices-app.git
   cd watch-prices-app
   ```

**For Scraping, Formatting, and Forecasting**

1. Install Python Dependencies

Make sure you have Python installed. Install the required Python packages using:

```
cd data-scrapping
pip install pandas numpy matplotlib fbprophet
```

2. Scraping, Formatting, and Forecasting

To gather watch data, generate time series data, and create forecasts, follow these steps:

  - Run the Web Scraping Script

    Make sure you have Puppeteer installed.
    ```
    npm install puppeteer
    ```
    
  - Then run the run_all.bat script with:
  
  ```
  .\run_all.bat
  ```


**For React**

1. **Install Dependencies**

Make sure you have Node.js installed. Then run:

  ```
  cd watch-prices-app
  npm install
  ```
2.    **Run the Development Server**

Start the development server with:

```
npm start dev
```

## Usage

- View Watch Details: Click on any watch to view its details, including old and new prices.
- Interactive Charts: Explore historical and forecasted price data through interactive charts.
- Image Viewer: Click on the watch image to open a modal dialog displaying the image in full size.
- External Links: Use the "Click here to view in Jomashop" button to navigate to the watch's page on Jomashop.
