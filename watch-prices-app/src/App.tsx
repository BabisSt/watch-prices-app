import React, { useState, useEffect } from 'react';
import WatchPricesChart from './WatchPricesChart'; // No need to specify .jsx extension here


const App = () => {
	const [data, setData] = useState({});

	// Fetch data from your CSV file or source
	useEffect(() => {
		fetch('../../Watches.csv') // Adjust path as per your setup
			.then(response => response.text())
			.then(text => {
				// Parse CSV data
				const rows = text.split('\n').slice(1); // Skip header row
				const parsedData = rows.map(row => {
					const columns = row.split('",');
					return {
						Title: columns[0].replace(/"/g, ''), // Remove quotes
						Url: columns[1].replace(/"/g, ''), // Remove quotes
						Price_old: columns[2], // Remove $ and convert to float
						Price_new: columns[3], // Remove $ and convert to float
					};
				});
				console.log(parsedData)
				setData(parsedData);
			})
			.catch(error => console.error('Error fetching data:', error));
	}, []);

	return (
		<div className="App">
			<h1>Watch Prices</h1>
			<WatchPricesChart data={data} />
		</div>
	);
};

export default App;
