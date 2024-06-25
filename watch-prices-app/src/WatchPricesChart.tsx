import React from 'react';
import { LineChart } from '@mui/x-charts';

const WatchPricesChart = ({ data }) => {
	// Extract relevant data for charting
	let labels;
	let currentPrices;
	let discountedPrices;
	Object.keys(data).forEach(function(key) {
		labels = data[key].Title;
	});
	Object.keys(data).forEach(function(key) {
		currentPrices = parseFloat(data[key].Price_new);
	});
	Object.keys(data).forEach(function(key) {
		discountedPrices = data[key].Price_old;
	});
	






	
	return (
		<LineChart
		xAxis={[{ data: currentPrices }]}
		series={[
		  {data: currentPrices ,},
		]}
		width={500}
		height={300}
	  />
	);
};

export default WatchPricesChart;
